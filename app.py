from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS
from google import genai
from google.genai import types
from pathlib import Path
import subprocess
import os
import json
import requests
import mimetypes
import shutil
import threading
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
RESULTS_FOLDER = "results"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

def clear_folder(folder_path):
    """Delete all files in a folder but keep the folder itself."""
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)

        if os.path.isfile(file_path):
            os.remove(file_path)
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)

@app.route('/create-questions', methods=['POST'])
def create_questions():
    # Get topic from request body
    data = request.get_json()
    topic = data.get("topic")
    with open("./src/assets/question_create_prompt.txt", "r") as file:
        content = file.read()
    
    #################

    # API_KEY = os.getenv("GOOGLE_API_KEY")
    # client = genai.Client(api_key=API_KEY)
    # response = client.models.generate_content(
    #     model='gemini-2.5-flash',
    #     contents=[
    #         (
    #             content + topic
    #         )
    #     ]
    # )
    # raw_output = response.text

    model_api_key = os.getenv("MISTRAL_API_KEY")
    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {model_api_key}",
            "Content-Type": "application/json",
        },
        data=json.dumps({
            "model": "mistralai/devstral-2512:free",
            "messages": [
            {
                "role": "user",
                "content": content + topic
            }
            ]
        })
    )
    data = response.json()

    # # Extract the assistant message content
    raw_output = data["choices"][0]["message"]["content"]

    print("raw_output: " + raw_output)

    lines = raw_output.strip().split("\n")
    # Remove first and last lines (backticks)
    lines = raw_output.strip().split("\n")
    if len(lines) > 2:
        middle = "\n".join(lines[1:-1])
    else:
        middle = raw_output  # fallback if no extra lines

    # Attempt to parse JSON safely
    try:
        questions_json = json.loads(middle)
    except json.JSONDecodeError as e:
        print("JSON decode error:", e)
        return jsonify({"error": "Failed to parse questions JSON", "raw": middle}), 500

    print(middle)
    # Return JSON directly
    return jsonify(questions_json)

def generate_title(text):
    model_api_key = os.getenv("MISTRAL_API_KEY")
    response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {model_api_key}",
        "Content-Type": "application/json",
    },
    data=json.dumps({
        "model": "mistralai/devstral-2512:free",
        "messages": [
        {
            "role": "user",
            "content": '''Carefully review the text provided and generate a viable TITLE for the topic that the content is on. The content should be 10-12 words MAXIMUM, it can be shorter as needed.
                Do not include any other extra text like 'okay here's your message' or something similar. ONLY include the title.''' + text
        }
        ]
    })
    )
    data = response.json()

    # # Extract the assistant message content
    llm_output = data["choices"][0]["message"]["content"]

    return llm_output

def convert_to_latex(text):
    model_api_key = os.getenv("MISTRAL_API_KEY")
    response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {model_api_key}",
        "Content-Type": "application/json",
    },
    data=json.dumps({
        "model": "mistralai/devstral-2512:free",
        "messages": [
        {
            "role": "user",
            "content": '''Convert the text below into a LaTeX document.
                After converting, carefully review the text and correct any mistakes
                or misread characters. Preserve formatting like bullet points,
                headings, or mathematical notation where possible.
                Do not include any other extra text like 'okay here's your message' or something similar. ONLY include the extracted LaTeX output.''' + text
        }
        ]
    })
    )
    data = response.json()

    # # Extract the assistant message content
    llm_output = data["choices"][0]["message"]["content"]

    return llm_output
    
@app.route('/extract-text', methods=['POST'])
def extractText():
    # 1. Clear uploads and results folders
    clear_folder(UPLOAD_FOLDER)
    clear_folder(RESULTS_FOLDER)

    # --- 1. Handle multiple uploaded images ---
    uploaded_files = request.files.getlist('images')

    if not uploaded_files or uploaded_files == [None]:
        return jsonify({"error": "No images uploaded"}), 400

    for file in uploaded_files:
        if file.filename == "":
            continue
        
        filename = secure_filename(file.filename)
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)
        print(f"Saved uploaded image: {save_path}")

    API_KEY = os.getenv("GOOGLE_API_KEY")
    client = genai.Client(api_key=API_KEY)

    extracted_text = ""
    for filename in os.listdir(UPLOAD_FOLDER):
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        # Skip directories
        if not os.path.isfile(file_path):
            continue

        mime_type, _ = mimetypes.guess_type(file_path)

        # Accept only JPEG/PNG images
        if mime_type not in ("image/jpeg", "image/png"):
            print(f"Skipping non-image file: {filename}")
            continue

        print(f"\nProcessing image: {filename}")

        with open(file_path, 'rb') as f:
            image_bytes = f.read()

        response = client.models.generate_content(
            model='gemini-2.5-flash-lite',
            contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=mime_type,
                ),
                (
                    "Extract all the text from this image and "
                    "After extracting, carefully review the text and correct any mistakes "
                    "or misread characters. THEN, CONVERT the text into a neatly formatted notes with logical understanding."
                    " Do not include any other extra text like 'okay here's your message' or something similar. ONLY include the neatly formatted output."
                )
            ]
        )
        extracted_text += response.text + "\n"
    
    # Save to file
    results_file_path = os.path.join(RESULTS_FOLDER, "results.txt")
    with open(results_file_path, "w", encoding="utf-8") as f:
        f.write(extracted_text)

    print(f"\nAll results saved to {results_file_path}")
    
    #generate a title and return that too
    notes_title = generate_title(extracted_text)

    # Return the extracted text in the response
    return jsonify({
        "status": "success",
        "extracted_text": extracted_text,
        "notes_title" : notes_title,
    })

def background_video_creation(user_text):
    try:
        video_path = Path("media/videos/app/1080p60/Explainer.mp4")
        if video_path.exists():
            video_path.unlink()
        createVideo(user_text)
        print("Video generation finished!")
    except Exception as e:
        print("Error generating video:", e)
    
@app.route('/generate-video', methods=['POST'])
def generate_video():
    data = request.json
    user_text = data.get('text', '')
    if not user_text:
        return jsonify({"error": "No text provided"}), 400
    
    # Start the video generation in a separate thread
    thread = threading.Thread(target=background_video_creation, args=(user_text,))
    thread.start()
    
    # Immediately respond to the client
    return jsonify({"status": "started"})

@app.route('/video', methods=['GET'])
def get_video():
    """Serve the generated video file"""
    video_path = Path("media/videos/generated_manim_script/1080p60/Explainer.mp4")
    
    if not video_path.exists():
        return jsonify({"error": "Video not found"}), 404
    
    return send_file(
        video_path,
        mimetype='video/mp4',
        as_attachment=False,
        download_name='Explainer.mp4'
    )

def createVideo(user_text_here):
    with open("./src/assets/video_prompt.txt", "r") as file:
        content = file.read()
    model_api_key = os.getenv("MISTRAL_API_KEY")
    response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {model_api_key}",
        "Content-Type": "application/json",
    },
    data=json.dumps({
        "model": "mistralai/devstral-2512:free",
        "messages": [
        {
            "role": "user",
            "content": content + convert_to_latex(user_text_here)
        }
        ]
    })
    )
    data = response.json()

    print("API Response:", json.dumps(data, indent=2))

    if "error" in data:
        raise ValueError(f"API Error: {data['error']}")

    if "choices" not in data:
        raise ValueError(f"Unexpected API response format: {data}")

    llm_output = data["choices"][0]["message"]["content"]

    if "Manim" not in llm_output:
        raise ValueError("LLM did not return a valid script with 'Manim' marker.")

    script_text = llm_output.split("Manim", 1)[1].strip()

    # Remove code fences (``` or ```python)
    if script_text.startswith("```"):
        # Split by newline after the first ``` line
        lines = script_text.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]  # remove opening ```
        if lines[-1].startswith("```"):
            lines = lines[:-1]  # remove closing ```
        script_text = "\n".join(lines).strip()

    # -------------------------------------------------------------
    # 2. Use a fixed script name — delete if it already exists
    # -------------------------------------------------------------
    script_name = "generated_manim_script.py"
    script_path = Path(script_name)

    if script_path.exists():
        script_path.unlink()  # delete old file

    # Write new script
    with open(script_path, "w", encoding="utf-8") as f:
        f.write(script_text)

    project_root = Path(__file__).parent
    # venv_python = project_root / ".venv" / "bin" / "python"
    venv_manim  = project_root / ".venv" / "bin" / "manim"

    if not venv_manim.exists():
        raise RuntimeError("Manim is not installed inside .venv.")

    subprocess.run(
        [
            str(venv_manim),
            "-qh",
            script_name,
            "Explainer"
        ],
        cwd=project_root,
        check=True
    )
    print("==== Extracted Script Start ====")
    print(script_text[:200])  # first 200 chars
    print("==== Extracted Script End ====")

     #return llm_output


@app.route('/save-changed-notes', methods=['POST'])
def save_changed_notes():
    """Save edited notes content back to file"""
    try:
        data = request.json
        content = data.get('changedNotes')
        filename = data.get('filename', 'results.txt')
        
        if not content:
            return jsonify({'error': 'No content provided'}), 400
        
        filepath = os.path.join(RESULTS_FOLDER, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Saved content to {filepath}")
        return jsonify({'success': True, 'message': 'Content saved successfully'}), 200
    
    except Exception as e:
        print(f"Error in save-changed-notes: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)