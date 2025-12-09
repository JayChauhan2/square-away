
import { useState, useRef } from 'react';
import '../index.css';

export default function SquareAwayLanding() {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFiles = (selectedFiles) => {
    // Filter images only
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
    files.forEach(file => formData.append('images', file)); // sending first file only

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });
      console.log('Success');
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen flex flex-col items-center justify-center">
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
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Convert to LaTeX
          </button>
        </>
      )}
    </div>
  );
}