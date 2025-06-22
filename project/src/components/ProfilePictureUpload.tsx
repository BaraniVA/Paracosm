import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  className?: string;
}

export function ProfilePictureUpload({ 
  currentImageUrl, 
  onImageChange, 
  className = '' 
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative w-24 h-24 mx-auto">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-600"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center border-4 border-gray-600">
            <Camera className="h-8 w-8 text-gray-400" />
          </div>
        )}
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Upload className="h-4 w-4" />
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <p className="text-center text-gray-400 text-xs mt-2">
        Click to upload profile picture
      </p>
    </div>
  );
}