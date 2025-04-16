import React, { useState, useEffect } from 'react';
import { Lock, Upload, Download, Eye, Clock, Shield, AlertTriangle } from 'lucide-react';

const SecureFileSharing = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [accessLink, setAccessLink] = useState('');
  const [countdown, setCountdown] = useState(47);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [accessPassword, setAccessPassword] = useState('');
  const [accessedFile, setAccessedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let timer;
    if (isCountdownActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isCountdownActive && countdown === 0) {
      setIsCountdownActive(false);
      setSuccessMessage('');
      setErrorMessage('File has been automatically deleted after 47 seconds.');
      setFile(null);
      setAccessLink('');
    }
    return () => clearTimeout(timer);
  }, [isCountdownActive, countdown]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrorMessage('');
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    
    if (!file) {
      setErrorMessage('Please select a file first.');
      return;
    }
    
    if (password.length < 8) {
      setErrorMessage('Please enter a strong password (at least 8 characters).');
      return;
    }
    
    const randomToken = Math.random().toString(36).substring(2, 15);
    setAccessLink(`https://secureshare.example/access/${randomToken}`);
    setSuccessMessage('File uploaded successfully! The access link is valid for only 47 seconds.');
    setCountdown(47);
    setIsCountdownActive(true);
    setErrorMessage('');
  };

  const handleAccess = (e) => {
    e.preventDefault();
    
    if (accessPassword.length < 1) {
      setErrorMessage('Please enter the file password.');
      return;
    }
    
    setAccessedFile({
      name: "Example-secured-file.pdf",
      type: "application/pdf",
      size: "2.4 MB"
    });
    setSuccessMessage('File accessed successfully!');
    setErrorMessage('');
    setIsCountdownActive(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accessLink);
    setSuccessMessage('Link copied to clipboard! Remember to share the password separately.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-6 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock size={28} />
            <h1 className="text-2xl font-bold">SecureShare</h1>
          </div>
          <p className="text-sm">Privacy-First File Sharing</p>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <div className="flex mb-6 border-b">
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => {
                setActiveTab('upload');
                setErrorMessage('');
                setSuccessMessage('');
                setIsCountdownActive(false);
              }}
            >
              <div className="flex items-center gap-2">
                <Upload size={18} />
                Upload
              </div>
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'access' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => {
                setActiveTab('access');
                setErrorMessage('');
                setSuccessMessage('');
                setIsCountdownActive(false);
              }}
            >
              <div className="flex items-center gap-2">
                <Download size={18} />
                Access
              </div>
            </button>
          </div>

          {activeTab === 'upload' && (
            <div>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {file ? (
                    <div className="flex flex-col items-center">
                      <p className="text-green-600 font-medium">File selected:</p>
                      <p>{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload size={48} className="text-gray-400 mb-2" />
                      <p className="mb-2">Drag & drop your file here or</p>
                      <label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700">
                        Browse Files
                        <input type="file" className="hidden" onChange={handleFileChange} />
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secure Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter a strong, unique password"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This password will be required to access your file.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Lock size={18} />
                  Encrypt & Generate Link
                </button>
              </form>

              {accessLink && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="font-medium mb-2">Share this link:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={accessLink}
                      readOnly
                      className="w-full p-2 bg-white border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                    >
                      Copy
                    </button>
                  </div>
                  {isCountdownActive && (
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-red-600">
                        <Clock size={20} />
                        <span>Auto-delete in {countdown} seconds</span>
                      </div>
                      <div className="w-24 h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${(countdown / 47) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'access' && (
            <div>
              {!accessedFile ? (
                <form onSubmit={handleAccess} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      File Access Link
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Paste the access link here"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={accessPassword}
                      onChange={(e) => setAccessPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter the file password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Eye size={18} />
                    Access File
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">{accessedFile.name}</h3>
                    <span className="text-sm text-gray-500">{accessedFile.size}</span>
                  </div>
                  <div className="flex justify-center">
                    <img src="/api/placeholder/400/320" alt="placeholder" className="rounded-md shadow-md mb-4" />
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
                      <Eye size={18} />
                      View File
                    </button>
                    <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 flex items-center justify-center gap-2">
                      <Download size={18} />
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
              <AlertTriangle size={18} />
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}

          <div className="mt-8 border-t pt-6">
            <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
              <Shield size={20} className="text-blue-600" />
              Security Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <div className="p-1 rounded-full bg-blue-100 text-blue-600 mt-1">
                  <Lock size={16} />
                </div>
                <div>
                  <p className="font-medium">End-to-End Encryption</p>
                  <p className="text-sm text-gray-600">Files encrypted using AES</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-1 rounded-full bg-blue-100 text-blue-600 mt-1">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="font-medium">47-Second Auto-Delete</p>
                  <p className="text-sm text-gray-600">Files expire if not accessed</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-1 rounded-full bg-blue-100 text-blue-600 mt-1">
                  <Shield size={16} />
                </div>
                <div>
                  <p className="font-medium">No Account Required</p>
                  <p className="text-sm text-gray-600">Anonymous, no tracking</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-1 rounded-full bg-blue-100 text-blue-600 mt-1">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <p className="font-medium">Brute-Force Protection</p>
                  <p className="text-sm text-gray-600">Rate limiting on access attempts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Lock size={20} />
              <p className="font-medium">SecureShare</p>
            </div>
            <div className="text-sm text-gray-400">
              Privacy-first file sharing. No tracking. No logs. No nonsense.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SecureFileSharing;
