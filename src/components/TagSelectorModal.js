import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function TagSelectorModal({ existingTags, selectedTags, onClose, onSave }) {
  const [selected, setSelected] = useState(selectedTags);

  const toggleTag = (tagName) => {
    if (selected.includes(tagName)) {
      setSelected(selected.filter(t => t !== tagName));
    } else {
      setSelected([...selected, tagName]);
    }
  };

  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">Select Tags</h2>
        <div className="mb-4 max-h-60 overflow-y-auto">
          {existingTags.map(tag => (
            <button
              key={tag.name}
              onClick={() => toggleTag(tag.name)}
              className={`mr-2 mb-2 px-2 py-1 rounded-full text-sm ${
                selected.includes(tag.name) ? 'border-2 border-blue-500' : ''
              }`}
              style={{ 
                backgroundColor: tag.color,
                color: getContrastColor(tag.color)
              }}
            >
              {tag.name}
            </button>
          ))}
        </div>
        <Button onClick={() => onSave(selected)} className="w-full">Save</Button>
      </div>
    </div>
  );
}

