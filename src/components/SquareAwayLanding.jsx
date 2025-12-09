import { useState, useRef, useEffect } from 'react';
import LaTeXToHTML from './LaTeXToHTML';

export default function SquareAwayLanding() {
  const [files, setFiles] = useState([]);
  const [latexContent, setLatexContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

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
    setLatexContent('');

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        console.log('Success');
        alert('Upload successful! Click "Load LaTeX" to see the result.');
      } else {
        alert('Error uploading file');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadLatex = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('./results/image.txt');
      if (response.ok) {
        let text = await response.text();
        setLatexContent(text);
      } else {
        alert('Could not load LaTeX file. Make sure the file exists in results/');
      }
    } catch (err) {
      console.error(err);
      alert('Error loading LaTeX file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLatexSave = async (newLatex) => {
    try {
      await fetch('http://127.0.0.1:5000/save-latex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          latex: newLatex,
          filename: 'image.txt'
        }),
      });
    } catch (err) {
      console.error('Error saving LaTeX:', err);
    }
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

      {files.length > 0 && (
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
            disabled={isProcessing}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {isProcessing ? 'Processing...' : 'Convert to LaTeX'}
          </button>
        </>
      )}

      {/* TEST BUTTON - Load LaTeX from results/image.txt */}
      <div className="mt-8">
        <button
          onClick={handleLoadLatex}
          disabled={isProcessing}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {isProcessing ? 'Loading...' : 'Load LaTeX from results/image.txt'}
        </button>
      </div>

      {isProcessing && (
        <div className="mt-8 text-gray-600">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      )}

      {latexContent && !isProcessing && (
        <div className="mt-8 w-full max-w-4xl">
          <LaTeXToHTML 
            latex={latexContent} 
            onLatexChange={handleLatexSave}
          />
        </div>
      )}
    </div>
  );
}
