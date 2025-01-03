import React, { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import Button from './Button';

export default function TagManagerModal({ existingTags, onClose, onSave }) {
  const [tags, setTags] = useState(existingTags);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#000000');
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const colorPickerRef = useRef(null);

  const addTag = (e) => {
    e.preventDefault();
    if (newTagName && !tags.some(tag => tag.name === newTagName)) {
      const newTag = { name: newTagName, color: newTagColor };
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      onSave(updatedTags);
      setNewTagName('');
      setNewTagColor('#000000');
    }
  };

  const removeTag = (tagName) => {
    const updatedTags = tags.filter(tag => tag.name !== tagName);
    setTags(updatedTags);
    onSave(updatedTags);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
      ) {
        setColorPickerVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">Manage Tags</h2>
        <form onSubmit={addTag} className="mb-4 flex items-center">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Додати новий тег"
            className="flex-grow p-2 border rounded mr-2"
          />
          {/* Квадрат з кольором */}
          <div className="relative" ref={colorPickerRef}>
            <div
              className="w-10 h-10 border rounded cursor-pointer"
              style={{ backgroundColor: newTagColor }}
              onClick={() => setColorPickerVisible(!colorPickerVisible)}
            ></div>
            {/* Випадаючий колірний пікра */}
            {colorPickerVisible && (
              <div
                className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10 rounded p-2"
                style={{ padding: '0px' }}
              >
                <HexColorPicker
                  color={newTagColor}
                  onChange={setNewTagColor}
                  style={{ width: '150px', height: '150px' }}
                />
              </div>
            )}
          </div>
          <Button type="submit" className="bg-blue-500 text-white ml-2">
            Add tag
          </Button>
        </form>
        <div className="mb-4 max-h-60 overflow-y-auto">
          <div className="flex flex-wrap">
            {tags.map(tag => (
              <div key={tag.name} className="flex items-center mr-2 mb-2 bg-gray-100 rounded-full px-3 py-1">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: tag.color }}></span>
                <span>{tag.name}</span>
                <button onClick={() => removeTag(tag.name)} className="ml-2 text-red-500 hover:text-red-700">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

