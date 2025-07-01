import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadImage, validateFile } from '../lib/imageUpload';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError: (error: string) => void;
  disabled?: boolean;
  className?: string;
  acceptedTypes?: string;
  maxSizeMB?: number;
}

export function FileUpload({ 
  onUploadSuccess, 
  onUploadError, 
  disabled = false,
  className = '',
  acceptedTypes = 'image/*',
  maxSizeMB = 5
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (disabled) return;

    const validation = validateFile(file);
    if (!validation.valid) {
      onUploadError(validation.error || 'Invalid file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const result = await uploadImage(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.url) {
        setTimeout(() => {
          onUploadSuccess(result.url!);
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      } else {
        onUploadError(result.error || 'Upload failed');
        setUploading(false);
        setUploadProgress(0);
      }
    } catch (err) {
      clearInterval(progressInterval);
      console.error('Upload error:', err);
      onUploadError('Upload failed. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${dragActive 
            ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-400'
          }
          ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!disabled && !uploading ? openFileDialog : undefined}
      >
        {uploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Uploading...</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{uploadProgress}% complete</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Drop an image here, or <span className="text-indigo-600 dark:text-indigo-400">browse</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                PNG, JPG, WebP up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        )}
      </div>
      
      {dragActive && (
        <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-400 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Upload className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Drop to upload
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface ImageUploadSectionProps {
  onImageSelect: (url: string) => void;
  currentUrl?: string;
  title?: string;
  description?: string;
  showUrlInput?: boolean;
}

export function ImageUploadSection({ 
  onImageSelect, 
  currentUrl, 
  title = "Image",
  description = "Add an image from your device or enter a URL",
  showUrlInput = true
}: ImageUploadSectionProps) {
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    
    // Basic URL validation
    try {
      new URL(urlInput);
      onImageSelect(urlInput);
      setUploadError(null);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2000);
    } catch {
      setUploadError('Please enter a valid URL');
    }
  };

  const handleUploadSuccess = (url: string) => {
    onImageSelect(url);
    setUploadError(null);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2000);
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
    setUploadSuccess(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{title}</label>
        <p className="text-xs text-gray-400 mb-3">{description}</p>
        
        {showUrlInput && (
          <div className="flex space-x-2 mb-4">
            <button
              type="button"
              onClick={() => setUploadMethod('url')}
              className={`px-3 py-1 text-sm rounded ${
                uploadMethod === 'url'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              URL
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod('file')}
              className={`px-3 py-1 text-sm rounded ${
                uploadMethod === 'file'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Upload File
            </button>
          </div>
        )}
      </div>

      {uploadMethod === 'url' && showUrlInput ? (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setUploadError(null);
              }}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
            >
              Add
            </button>
          </div>
          {urlInput && (
            <div className="rounded-lg overflow-hidden border border-gray-600">
              <img 
                src={urlInput} 
                alt="Preview" 
                className="w-full h-32 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <FileUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          className="w-full"
        />
      )}

      {uploadError && (
        <div className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-700 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{uploadError}</p>
        </div>
      )}

      {uploadSuccess && (
        <div className="flex items-center space-x-2 p-3 bg-green-900/20 border border-green-700 rounded-lg">
          <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-300">Image added successfully!</p>
        </div>
      )}
    </div>
  );
}
