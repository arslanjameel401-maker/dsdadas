import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const colors = [
  { id: 'original', name: 'Original', style: 'bg-transparent border-white text-white' },
  { id: 'white', name: 'White', style: 'bg-white text-black' },
  { id: 'black', name: 'Black', style: 'bg-black text-white' },
  { id: 'grey', name: 'Grey', style: 'bg-gray-500 text-white' },
  { id: 'blue', name: 'Blue', style: 'bg-blue-600 text-white' },
  { id: 'red', name: 'Red', style: 'bg-red-600 text-white' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange }) => {
  return (
    <div className="w-full bg-gray-800/60 p-3 rounded-lg flex flex-col items-center">
      <h4 className="text-sm font-semibold text-gray-300 mb-3">Background Color</h4>
      <div className="flex flex-wrap justify-center gap-2">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorChange(color.id)}
            className={`w-16 h-8 text-xs font-bold rounded-md border-2 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400
              ${color.style}
              ${selectedColor === color.id ? 'ring-2 ring-cyan-400 scale-105' : 'border-gray-600'}`}
            title={color.name}
          >
            {color.id === 'original' ? 'Original' : ''}
          </button>
        ))}
      </div>
    </div>
  );
};