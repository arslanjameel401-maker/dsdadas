import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageUrl }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLLabelElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload, handleDragEvents]);

  return (
    <div className="w-full flex flex-col items-center">
      <label
        htmlFor="image-upload"
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDrop={handleDrop}
        className={`relative w-full aspect-square border-2 border-dashed rounded-lg flex flex-col justify-center items-center text-gray-400 cursor-pointer transition-colors duration-300 ${
          isDragging ? 'border-cyan-400 bg-gray-700/50' : 'border-gray-600 hover:border-cyan-500'
        }`}
      >
        <input
          id="image-upload"
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
        {imageUrl ? (
          <img src={imageUrl} alt="Original Upload" className="w-full h-full object-contain rounded-lg p-2" />
        ) : (
          <div className="text-center p-4">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
            <p className="mt-2 font-semibold text-cyan-400">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
          </div>
        )}
      </label>
      <h3 className="text-lg font-semibold mt-4 text-gray-300">Original Image</h3>
    </div>
  );
};