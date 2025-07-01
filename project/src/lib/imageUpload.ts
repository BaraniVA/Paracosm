import axios from 'axios';

// Cloudinary configuration - Free tier allows 25 GB storage and 25 GB bandwidth
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset';

// Alternative: ImgBB (Free tier - 32MB file size limit, unlimited storage)
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY; // Get from https://api.imgbb.com/
const IMGBB_URL = 'https://api.imgbb.com/1/upload';

// File size limits (in bytes)
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const GALLERY_IMAGE_LIMIT = 10;

// Supported file types
export const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Validate file before upload
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Please select a valid image file (JPEG, PNG, or WebP)'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`
    };
  }

  return { valid: true };
};

// Resize image if needed (optional - for better performance)
export const resizeImage = (file: File, maxWidth: number = 1920, maxHeight: number = 1080, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(resizedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// Upload to ImgBB (recommended for free usage)
export const uploadToImgBB = async (file: File): Promise<UploadResult> => {
  try {
    if (!IMGBB_API_KEY) {
      return { 
        success: false, 
        error: 'ImgBB API key not configured. Please add VITE_IMGBB_API_KEY to your .env file.' 
      };
    }

    // Validate file first
    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Resize image if too large
    const processedFile = await resizeImage(file);

    // Convert to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/...;base64, prefix
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(processedFile);
    });

    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', base64);

    const response = await axios.post(IMGBB_URL, formData, {
      timeout: 30000 // 30 second timeout
    });

    if (response.data.success) {
      return {
        success: true,
        url: response.data.data.url
      };
    } else {
      return {
        success: false,
        error: 'Upload failed'
      };
    }
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: 'Failed to upload image. Please try again.'
    };
  }
};

// Upload to Cloudinary (alternative)
export const uploadToCloudinary = async (file: File): Promise<UploadResult> => {
  try {
    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const processedFile = await resizeImage(file);

    const formData = new FormData();
    formData.append('file', processedFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await axios.post(CLOUDINARY_URL, formData, {
      timeout: 30000
    });

    return {
      success: true,
      url: response.data.secure_url
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: 'Failed to upload image. Please try again.'
    };
  }
};

// Main upload function (uses ImgBB by default)
export const uploadImage = async (file: File): Promise<UploadResult> => {
  // Use actual ImgBB upload
  return uploadToImgBB(file);
  
  // For demo purposes, we'll use a mock upload that returns a placeholder
  // In production, replace this with actual ImgBB or Cloudinary upload
  
  /*
  const validation = validateFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // For demo, return a placeholder image URL
  const placeholderUrls = [
    'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  const randomUrl = placeholderUrls[Math.floor(Math.random() * placeholderUrls.length)];

  return {
    success: true,
    url: randomUrl
  };
  */
};

// Delete image function
export interface DeleteResult {
  success: boolean;
  error?: string;
}

// Image service detection
export const detectImageService = (imageUrl: string): 'imgbb' | 'cloudinary' | 'unknown' => {
  if (imageUrl.includes('i.ibb.co') || imageUrl.includes('ibb.co')) {
    return 'imgbb';
  }
  if (imageUrl.includes('res.cloudinary.com')) {
    return 'cloudinary';
  }
  return 'unknown';
};

// Delete image from hosting service
export const deleteImage = async (imageUrl: string): Promise<DeleteResult> => {
  try {
    const service = detectImageService(imageUrl);
    
    switch (service) {
      case 'imgbb':
        return {
          success: false,
          error: 'ImgBB does not support image deletion. The image will remain hosted but won\'t appear in your gallery.'
        };
      
      case 'cloudinary':
        return await deleteFromCloudinary(imageUrl);
      
      default:
        return {
          success: false,
          error: 'Cannot delete image from unknown hosting service'
        };
    }
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: 'Failed to delete image'
    };
  }
};

// Delete from Cloudinary (requires backend implementation for security)
const deleteFromCloudinary = async (imageUrl: string): Promise<DeleteResult> => {
  // Note: For security, deletion should be handled by your backend
  // This is a client-side example and requires API secret which should NOT be exposed
  
  console.warn('Cloudinary deletion should be implemented on the backend for security');
  
  try {
    // Extract public_id from URL
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL format');
    }
    
    // Get the public_id (everything after version number, without extension)
    const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ''); // Remove extension
    
    // In a real implementation, you would call your backend endpoint here
    // Example: await fetch('/api/delete-image', { method: 'POST', body: JSON.stringify({ publicId }) })
    
    return {
      success: false,
      error: 'Cloudinary deletion must be implemented on the backend for security reasons'
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: 'Failed to delete from Cloudinary'
    };
  }
};
