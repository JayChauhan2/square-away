# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import shutil

UPLOAD_FOLDER = "uploads"
RESULTS_FOLDER = "results"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app)

def process_image_with_selenium(image_path):
    # Set up Chrome options for automatic download
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")

    prefs = {
        "download.default_directory": os.path.abspath(RESULTS_FOLDER),
        "download.prompt_for_download": False,
        "safebrowsing.enabled": True
    }
    options.add_experimental_option("prefs", prefs)
    
    driver = webdriver.Chrome(options=options)

    try:
        driver.get("https://notestolatex.com/")

        # Upload file
        file_input = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.ID, "image-upload-field"))
        )
        file_input.send_keys(os.path.abspath(image_path))
        print(f"Uploaded {image_path}, waiting for processing...")

        # Wait for the download button instead of copy button
        # download_button = WebDriverWait(driver, 300).until(
        #     EC.element_to_be_clickable((By.XPATH, "//button[contains(@onclick, 'downloadResult(this)')]"))
        # )
        # download_button.click()
        # print("Clicked download button, waiting for file to save...")
        
        buttons = WebDriverWait(driver, 300).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "button--shadow"))
        )
        download_button = WebDriverWait(driver, 30).until(
            EC.element_to_be_clickable((By.XPATH, "(//button[contains(@class,'button--shadow')])[1]"))
        )
        download_button.click()
        # buttons[1].click() #click the second one

        # Wait for the file to appear in RESULTS_FOLDER
        downloaded_file = None
        timeout = 60  # seconds
        start_time = time.time()
        while time.time() - start_time < timeout:
            files = os.listdir(RESULTS_FOLDER)
            if files:
                downloaded_file = os.path.join(RESULTS_FOLDER, files[0])
                # Check if download is complete (not .crdownload)
                if not downloaded_file.endswith(".crdownload"):
                    break
            time.sleep(1)
        
        if not downloaded_file:
            print("Download timed out!")
            return ""

        print(f"File downloaded: {downloaded_file}")
        # Optionally, rename the file to match the input image
        new_filename = os.path.splitext(os.path.basename(image_path))[0] + ".txt"
        final_path = os.path.join(RESULTS_FOLDER, new_filename)
        shutil.move(downloaded_file, final_path)
        print(f"Saved result as: {final_path}")

        return final_path

    finally:
        driver.quit()


@app.route('/upload', methods=['POST'])
def upload_files():
    if 'images' not in request.files:
        return jsonify({"error": "No files part"}), 400

    files = request.files.getlist('images')
    results = []

    for file in files:
        filename = file.filename
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)
        print(f"Saved {filename} at {save_path}")

        # Process the uploaded file with Selenium
        result_file_path = process_image_with_selenium(save_path)
        results.append({"file": filename, "result_file": result_file_path})

    return jsonify({"message": "Files processed successfully", "results": results})

@app.route('/save-latex', methods=['POST'])
def save_latex():
    data = request.json
    filename = data.get('filename')
    latex = data.get('latex')
    
    if not filename or not latex:
        return jsonify({'error': 'Missing filename or latex content'}), 400
    
    # Save to results folder
    filepath = os.path.join('results', filename)
    
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(latex)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
