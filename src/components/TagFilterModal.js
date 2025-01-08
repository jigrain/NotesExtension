import React, { useState } from 'react';
import Button from './Button';
import { X } from 'lucide-react';

export default function TagFilterModal({ tags, selectedTags, onClose, onApply }) {
  const [selected, setSelected] = useState(new Set(selectedTags));

  const toggleTag = (tag) => {
    const updated = new Set(selected);
    if (updated.has(tag)) {
      updated.delete(tag);
    } else {
      updated.add(tag);
    }
    setSelected(updated);
  };

  const handleApply = () => {
    onApply(Array.from(selected));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-full max-w-md">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">Filter by Tags</h2>
        <div className="mb-4 max-h-60 overflow-y-auto">
          {tags.map(tag => (
            <div key={tag.name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selected.has(tag.name)}
                onChange={() => toggleTag(tag.name)}
              />
              <span>{tag.name}</span>
            </div>
          ))}
        </div>
        <Button onClick={handleApply} className="bg-blue-500 text-white">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
