import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { SupportButton } from './components/SupportButton';
import { ToolSelector } from './components/ToolSelector';
import { ColorPicker } from './components/ColorPicker';
import { removeBackground, enhancePhoto, createPassportPhoto } from './services/geminiService';

type Tool = 'removeBackground' | 'photoEnhance' | 'passportPhoto';

const toolConfig = {
  removeBackground: {
    title: 'Bg Remove',
    description: 'Upload an image and our AI will automatically remove the background for you.',
    processingFunction: removeBackground,
    loadingText: 'Removing background...',
  },
  photoEnhance: {
    title: 'Photo Enhancer',
    description: 'Instantly improve your image quality to an 8K look. Enhance colors, lighting, and sharpness.',
    processingFunction: enhancePhoto,
    loadingText: 'Enhancing photo...',
  },
  passportPhoto: {
    title: 'AI Passport Photo Creator',
    description: 'Turn any photo into a professional passport picture. Our AI adjusts clothing and background to meet requirements.',
    processingFunction: createPassportPhoto,
    loadingText: 'Creating passport photo...',
  },
};

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>('removeBackground');
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState<string>('Processing...');
  const [passportBackgroundColor, setPassportBackgroundColor] = useState<string>('white');

  const currentTool = toolConfig[activeTool];

  const handleToolSelect = useCallback((tool: Tool) => {
    setActiveTool(tool);
    setOriginalImage(null);
    setOriginalImageUrl(null);
    setResultImageUrl(null);
    setError(null);
    setIsLoading(false);
    setPassportBackgroundColor('white');
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    setOriginalImage(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    setResultImageUrl(null);
    setError(null);
    setIsLoading(true);
    setLoadingText(currentTool.loadingText);

    try {
      let resultUrl;
      if (activeTool === 'passportPhoto') {
        resultUrl = await createPassportPhoto(file, passportBackgroundColor);
      } else {
        resultUrl = await toolConfig[activeTool].processingFunction(file);
      }
      setResultImageUrl(resultUrl);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTool, currentTool, passportBackgroundColor]);
  
  const getDownloadBasename = () => {
    if (!originalImage) return 'result';
    return originalImage.name.split('.').slice(0, -1).join('.');
  }


  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto text-center">
          <ToolSelector activeTool={activeTool} onSelectTool={handleToolSelect} />
          <h2 className="mt-8 text-3xl sm:text-4xl font-extrabold tracking-tight text-cyan-300">
            {currentTool.title}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            {currentTool.description}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="flex flex-col items-center gap-6">
            <ImageUploader onImageUpload={handleImageUpload} imageUrl={originalImageUrl} key={activeTool} />
             {activeTool === 'passportPhoto' && (
              <ColorPicker 
                selectedColor={passportBackgroundColor}
                onColorChange={setPassportBackgroundColor}
              />
            )}
          </div>
          <ResultDisplay
            isLoading={isLoading}
            resultUrl={resultImageUrl}
            error={error}
            loadingText={loadingText}
            downloadBasename={getDownloadBasename()}
          />
        </div>
      </main>
      <Footer />
      <SupportButton />
    </div>
  );
};

export default App;