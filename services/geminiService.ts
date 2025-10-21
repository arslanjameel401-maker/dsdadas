import { GoogleGenAI, Modality } from '@google/genai';
import { fileToBase64 } from '../utils/fileUtils';

// Initialize GoogleGenAI with apiKey from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generateImageWithPrompt = async (imageFile: File, prompt: string): Promise<string> => {
    const base64Data = await fileToBase64(imageFile);
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: imageFile.type,
      },
    };
  
    const textPart = { text: prompt };
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [imagePart, textPart],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          // The result should be a PNG to support transparency and quality
          return `data:image/png;base64,${base64ImageBytes}`;
        }
      }
  
      throw new Error('No image data found in the response.');
  
    } catch (e) {
      console.error('Error processing image with Gemini API:', e);
      if (e instanceof Error) {
          throw new Error(`Failed to process image: ${e.message}`);
      }
      throw new Error('An unknown error occurred while processing the image.');
    }
}

export const removeBackground = (imageFile: File): Promise<string> => {
    const prompt = 'Please remove the background from this image, making it transparent. The main subject should be preserved with clean, high-quality edges.';
    return generateImageWithPrompt(imageFile, prompt);
};

export const enhancePhoto = (imageFile: File): Promise<string> => {
    const prompt = 'Enhance this photo to the highest possible quality, targeting an 8K resolution look. Improve lighting, color balance, sharpness, and clarity. Make it look professional, clean, and ultra-detailed. Do not crop or change the aspect ratio. Preserve the original subject and composition.';
    return generateImageWithPrompt(imageFile, prompt);
};

export const createPassportPhoto = (imageFile: File, backgroundColor: string): Promise<string> => {
    let prompt = "Create a professional passport-style photo of the person in this image. Change the clothing to a formal dark-colored suit with a collared shirt and tie. The new outfit should look realistic and natural. Do not change the person's face, hair, or any of their features. The expression should be neutral. The subject should be centered and looking directly at the camera.";

    if (backgroundColor === 'original') {
        prompt += " Keep the original background completely unchanged.";
    } else {
        prompt += ` Replace the background with a solid ${backgroundColor} color background. The subject should be well-lit with no harsh shadows.`;
    }

    return generateImageWithPrompt(imageFile, prompt);
};