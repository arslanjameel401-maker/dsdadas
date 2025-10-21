import React from 'react';

type Tool = 'removeBackground' | 'photoEnhance' | 'passportPhoto';

interface ToolSelectorProps {
  activeTool: Tool;
  onSelectTool: (tool: Tool) => void;
}

const tools: { id: Tool; name: string }[] = [
  { id: 'removeBackground', name: 'Bg Remove' },
  { id: 'photoEnhance', name: 'Photo Enhance' },
  { id: 'passportPhoto', name: 'Passport Photo' },
];

export const ToolSelector: React.FC<ToolSelectorProps> = ({ activeTool, onSelectTool }) => {
  return (
    <div className="flex justify-center space-x-2 sm:space-x-4 bg-gray-800/60 p-2 rounded-full">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onSelectTool(tool.id)}
          className={`px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400 ${
            activeTool === tool.id
              ? 'bg-cyan-500 text-white shadow-md'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {tool.name}
        </button>
      ))}
    </div>
  );
};