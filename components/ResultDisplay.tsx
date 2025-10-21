import React from 'react';
import { Spinner } from './Spinner';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultDisplayProps {
  isLoading: boolean;
  resultUrl: string | null;
  error: string | null;
  loadingText: string;
  downloadBasename: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, resultUrl, error, loadingText, downloadBasename }) => {
  const handleSdDownload = () => {
    if (!resultUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = resultUrl;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const MAX_SIZE = 720;
        let { width, height } = img;

        if (width > height) {
            if (width > MAX_SIZE) {
                height = Math.round((height * MAX_SIZE) / width);
                width = MAX_SIZE;
            }
        } else {
            if (height > MAX_SIZE) {
                width = Math.round((width * MAX_SIZE) / height);
                height = MAX_SIZE;
            }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        
        link.download = `${downloadBasename}_720p.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    img.onerror = () => {
        alert("Failed to load image for resizing. Please try downloading the HD version.");
    };
  };

  const hdFilename = `${downloadBasename}_8K_HD.png`;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full aspect-square bg-gray-900/50 rounded-lg flex justify-center items-center p-2 border border-gray-700 overflow-hidden">
        {isLoading && <Spinner loadingText={loadingText} />}
        {!isLoading && error && (
          <div className="text-center text-red-400 px-4">
            <p className="font-semibold">An Error Occurred</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!isLoading && !error && resultUrl && (
          <>
            <img src={resultUrl} alt="Processed Result" className="w-full h-full object-contain" />
            <div className="absolute bottom-4 right-4 flex flex-col gap-3">
              <a
                href={resultUrl}
                download={hdFilename}
                className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-cyan-600 transition-transform transform hover:scale-105 shadow-lg"
                title="Download High Quality (8K)"
              >
                <DownloadIcon className="w-5 h-5" />
                Download 8K
              </a>
              <button
                onClick={handleSdDownload}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-teal-600 transition-transform transform hover:scale-105 shadow-lg"
                title="Download Standard Quality (720p)"
              >
                  <DownloadIcon className="w-5 h-5" />
                Download 720p
              </button>
            </div>
          </>
        )}
        {!isLoading && !resultUrl && !error && (
            <div className="text-center text-gray-500 p-4">
              <p>Your processed image will appear here.</p>
            </div>
        )}
      </div>
      <h3 className="text-lg font-semibold mt-4 text-gray-300">Result</h3>
    </div>
  );
};