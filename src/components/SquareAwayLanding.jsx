import '../index.css';
import MathJaxWrapper from "./MathJaxWrapper";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'katex/dist/katex.min.css'; // Make sure this is imported for the math to look right!

function NotesDisplay({ content, onContentChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  useEffect(() => {
    setEditContent(content);
  }, [content]);

  const handleSave = async () => {
    await onContentChange(editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  return (
    // Added h-full to ensure it takes available space if needed, 
    // though the parent controls the height sync.
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Your Converted Notes
        </h2>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full h-96 p-4 border rounded font-mono text-sm"
        />
      ) : (
        <div className="prose prose-lg prose-blue max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

function LoadingSpinner({ message }) {
  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 absolute top-0 left-0"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </div>
  );
}

function VideoPlayer({ videoUrl }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Video Explanation</h2>
      <div className="bg-black rounded-lg overflow-hidden">
        <video 
          controls 
          className="w-full"
          src={videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default function SquareAwayLanding() {
  const [files, setFiles] = useState([]);
  const [notesContent, setNotesContent] = useState('');
  const [notesTitle, setNotesTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  // REFS FOR LAYOUT SYNC
  const notesRef = useRef(null);
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null); // To auto-scroll to bottom of chat

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);


  // 1. HEIGHT SYNCHRONIZATION
  // This effect runs whenever the notes content changes.
  // It grabs the height of the notes column and forces the chat column to match it.
  useEffect(() => {
    if (notesRef.current && chatContainerRef.current) {
      // Get height of the notes wrapper
      const height = notesRef.current.clientHeight;
      // Apply it to the chat wrapper
      chatContainerRef.current.style.height = `${height}px`;
    }
  }, [notesContent]); 

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput.trim();
    const newMessage = { role: "user", content: userMsg };
    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          notes: notesContent, 
          user_message: userMsg,
          chat_history: chatMessages 
        })
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: "assistant", content: data.answer }]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const practiceMessages = [
    "Ready to test your understanding?",
    "Let's see how well you know this!",
    "Time to check your knowledge!",
    "Think you've got this? Let's find out!",
    "Up for a challenge?",
    "Can you handle this question?",
    "Let's test what you've learned!",
    "Are you prepared to answer?",
    "Time for a quick knowledge check!",
    "Ready for a brain workout?",
    "How sharp is your mind today?",
    "Let's see your skills in action!",
    "Are you up for a quiz?",
    "Put your knowledge to the test!",
    "Think fast! Here's your challenge!"
  ]

  const handleFiles = (selectedFiles) => {
    const imageFiles = Array.from(selectedFiles).filter(file =>
      file.type.startsWith('image/')
    );
    setFiles(imageFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    setIsProcessing(true);
    setLoadingMessage('Uploading images and extracting text...');
    setNotesContent('');
    setVideoUrl('');

    try {
      const response = await fetch('http://127.0.0.1:5000/extract-text', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        setNotesContent(result.extracted_text);
        setNotesTitle(result.notes_title);
        setIsProcessing(false);
        setLoadingMessage('');
        generateVideo(result.extracted_text);
        
      } else {
        alert('Error uploading file');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
      setIsProcessing(false);
    }
  };

  const pollVideo = async () => {
    const timestamp = new Date().getTime();
    const videoCheckUrl = `http://127.0.0.1:5000/video?t=${timestamp}`;
    
    try {
      const response = await fetch(videoCheckUrl, { method: 'HEAD' });
      if (response.ok) {
        setVideoUrl(videoCheckUrl);
        setIsGeneratingVideo(false);
      } else {
        setTimeout(pollVideo, 3000);
      }
    } catch (err) {
      setTimeout(pollVideo, 3000);
    }
  };

  const generateVideo = async (text) => {
    setIsGeneratingVideo(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === 'started') {
          pollVideo(); 
        }
      } else {
        alert('Error starting video generation');
        setIsGeneratingVideo(false);
      }
    } catch (err) {
      console.error(err);
      setIsGeneratingVideo(false);
    }
  };

  const handleNotesSave = async (newContent) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/save-changed-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          changedNotes: newContent,
          filename: 'results.txt'
        }),
      });
      
      if (response.ok) {
        setNotesContent(newContent);
      } else {
        alert('Error saving notes');
      }
    } catch (err) {
      console.error('Error saving notes:', err);
      alert('Error saving notes');
    }
  };

  const handlePractice = () => {
    if (!notesTitle) return;
    const sanitizedTitle = encodeURIComponent("Rolle's Theorem and Mean Value Theorem");
    navigate(`/questions/${sanitizedTitle}`);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen flex flex-col items-center justify-center p-8">

      <h1 className="text-4xl font-bold text-gray-800 mb-8">Upload your Notes to Begin</h1>
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
        className="w-96 h-64 border-4 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
      >
        <p className="text-gray-500 mb-2">Drag & Drop your images here</p>
        <p className="text-gray-400 text-sm">or click to select files</p>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {files.length > 0 && !isProcessing && !notesContent && (
        <>
          <div className="mt-6 w-96 grid grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-24 object-cover rounded"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleUpload}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            Convert to Text
          </button>
        </>
      )}

      {isProcessing && <LoadingSpinner message={loadingMessage} />}
      
      {notesContent && !isProcessing && (
        <div className="mt-8 w-full max-w-6xl">
          
          {/* NOTES + CHAT ROW */}
          <div className="flex gap-6 items-stretch">
            
            {/* LEFT: MATH NOTES */}
            {/* Added ref={notesRef} to measure this side */}
            <div className="flex-1" ref={notesRef}>
              <MathJaxWrapper>
                <NotesDisplay
                  content={notesContent}
                  onContentChange={handleNotesSave}
                />
              </MathJaxWrapper>
            </div>

            {/* RIGHT: CHATBOT UI */}
            {/* Added ref={chatContainerRef} to set the height of this side */}
            <div
              ref={chatContainerRef}
              className="w-[400px] bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg p-6 flex flex-col
                        border border-blue-100 relative overflow-hidden"
              // No inline style for height here, it's handled by useEffect
            >
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br from-blue-300/30 to-purple-300/30 rounded-full blur-3xl" />

              <h3 className="text-xl font-semibold text-gray-800 mb-4 relative z-10 flex-none">
                Chat
              </h3>

              {/* CHAT MESSAGES AREA */}
              {/* Added flex-1 and overflow-y-auto so the scrollbar appears HERE, not on the whole page */}
              <div className="flex-1 overflow-y-auto relative z-10 space-y-4 pr-2 custom-scrollbar">
                {chatMessages.length === 0 && <p className="italic text-gray-500">Ask questions about your notes here.</p>}
                
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-2xl p-4 max-w-[90%] text-sm shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border border-gray-100 text-gray-800'
                      }`}>
                      
                      {/* 2. TEXT & MATH FORMATTING */}
                      {/* ReactMarkdown handles bold, headers, lists. 
                          remarkMath/rehypeKatex handle the LaTeX ($...$) */}
                      <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : ''}`}>
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl p-4 text-sm text-gray-500 italic">
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT AREA */}
              <div className="mt-4 relative z-10 flex gap-2 flex-none pt-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your question…"
                  className="flex-1 px-4 py-3 rounded-full bg-white border border-blue-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button 
                  onClick={sendMessage}
                  disabled={chatLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
                >
                  Send
                </button>
              </div>

            </div>
          </div>

          {/* VIDEO GENERATION LOADING */}
          {isGeneratingVideo && (
            <div className="mt-8">
              <LoadingSpinner message="Generating your video explanation... This may take a few minutes." />
            </div>
          )}

          {/* VIDEO PLAYER */}
          {videoUrl && !isGeneratingVideo && (
            <VideoPlayer videoUrl={videoUrl} />
          )}

          {/* QUESTIONS BUTTON CARD */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Practice Questions
            </h2>
            <p className="text-gray-700 mb-4 text-center">
              {
                practiceMessages[
                  Math.floor(Math.random() * practiceMessages.length)
                ]
              }{" "}
              Go to the questions page for this topic.
            </p>
            <button
              onClick={handlePractice}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              Go to Questions
            </button>
          </div>
        </div>
      )}

    </div>
  );
}