import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, ChevronDown, Tag } from 'lucide-react';
import SearchBar from './SearchBar';
import Button from './Button';
import TagManagerModal from './TagManagerModal';
import ContextMenu from './ContextMenu';

export default function SheetList({ sheets, addNewSheet, selectSheet, searchTerm, setSearchTerm, sortBy, setSortBy, allTags, updateTags, deleteSheet, downloadSheet, exportAllSheets,
  importSheets, fileInputRef, handleFileUpload }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [isNewSheetDropdownOpen, setIsNewSheetDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const newSheetDropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        newSheetDropdownRef.current && !newSheetDropdownRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
        setIsNewSheetDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleTagSave = (newTags) => {
    updateTags(newTags);
  };

  const handleContextMenu = (e, sheet) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      sheet: sheet
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  return (
    <div className="w-full h-full bg-white shadow-lg flex flex-col" onClick={closeContextMenu}>
      <div className="p-4 flex items-center justify-between bg-gray-200">
        <div className="flex items-center space-x-2">
          <div className="relative" ref={newSheetDropdownRef}>
            <Button onClick={() => setIsNewSheetDropdownOpen(!isNewSheetDropdownOpen)} className="p-2 hover:bg-gray-100">
              <Plus className="h-5 w-5 text-black" />
            </Button>
            {isNewSheetDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => { addNewSheet(); setIsNewSheetDropdownOpen(false); }}>
                  Create new sheet
                </button>
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => { importSheets(); setIsNewSheetDropdownOpen(false); }}>
                  Import new sheet
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept=".txt"
                  onChange={(e) => handleFileUpload(e)} // Обробка завантаження
                />
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => { exportAllSheets(); setIsNewSheetDropdownOpen(false); }}>
                  Export all sheets
                </button>
              </div>
            )}
          </div>
          <Button onClick={() => setIsTagModalOpen(true)} className="p-2 hover:bg-gray-100">
            <Tag className="h-5 w-5 text-black" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <Button onClick={() => setSearchTerm('')} className="p-2 hover:bg-gray-100">
            <Search className="h-5 w-5 text-black" />
          </Button>
        </div>
        <div className="relative" ref={dropdownRef}>
          <Button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 hover:bg-gray-100"
          >
            <ChevronDown className="h-5 w-5 text-black" />
          </Button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    setSortBy('date');
                    setIsDropdownOpen(false);
                  }}
                >
                  Sort by Date
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    setSortBy('name');
                    setIsDropdownOpen(false);
                  }}
                >
                  Sort by Name
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-y-auto flex-grow">
        {sheets.map(sheet => (
          <div
            key={sheet.id}
            className="border cursor-pointer hover:bg-gray-100 rounded-lg p-4 shadow-sm"
            onClick={() => selectSheet(sheet)}
            onContextMenu={(e) => handleContextMenu(e, sheet)}
          >
            <div className="flex justify-between items-center">
              <div className="flex-grow overflow-hidden mr-4">
                <h3 className="font-bold text-lg mb-2 truncate">{sheet.name}</h3>
                <div className="flex flex-wrap items-center overflow-hidden">
                  {sheet.tags.map(tag => {
                    const tagInfo = allTags.find(t => t.name === tag);
                    return tagInfo ? (
                      <span
                        key={tagInfo.name}
                        className="mr-2 mb-1 px-3 py-1 rounded-full text-sm"
                        style={{
                          backgroundColor: tagInfo.color,
                          color: getContrastColor(tagInfo.color)
                        }}
                      >
                        {tagInfo.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              <div className="flex-shrink-0 text-right text-sm text-gray-600 flex flex-col justify-center">
                <p>Created: {new Date(sheet.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(sheet.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isTagModalOpen && (
        <TagManagerModal
          existingTags={allTags}
          onClose={() => setIsTagModalOpen(false)}
          onSave={handleTagSave}
        />
      )}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          options={[
            { label: 'Download', action: () => downloadSheet(contextMenu.sheet) },
            { label: 'Delete', action: () => deleteSheet(contextMenu.sheet.id) }
          ]}
        />
      )}
    </div>
  );
}

