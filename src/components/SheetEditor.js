import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Tag } from 'lucide-react';
import Button from './Button';
import TagSelectorModal from './TagSelectorModal';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function SheetEditor({ sheet, updateSheet, closeEditor, allTags }) {
  const [name, setName] = useState(sheet.name);
  const [isEditing, setIsEditing] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const nameRef = useRef(null);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [content, setContent] = useState(sheet.content);

  const [initialContainerHeight, setInitialContainerHeight] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (nameRef.current && !nameRef.current.contains(event.target)) {
        setIsEditing(false);
        updateSheet({ ...sheet, name });
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [nameRef, updateSheet, sheet, name]);


  const handleNameClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      updateSheet({ ...sheet, name });
    }
  };

  const handleTagSelect = (selectedTags) => {
    updateSheet({ ...sheet, tags: selectedTags });
    setIsTagModalOpen(false);
  };

  const handleCloseEditor = () => {
    updateSheet({ ...sheet, content }); // Збереження останніх змін
    closeEditor(); // Закриття редактора
  };

  const handleSelectionChange = (range) => {
    const element = document.getElementById('input-text-container');
    const container = document.querySelector('.ql-container');
  
    if (range && range.length > 0) {
      setIsTextSelected(true);
  
      const elementHeight = element.offsetHeight;
      const toolbarHeight = 43; // Висота тулбара (статична або динамічна)
      const containerHeight = container.offsetHeight;
      setInitialContainerHeight(container.offsetHeight);
  
      const totalHeight = containerHeight + toolbarHeight;
  
      if (totalHeight > elementHeight) {
        const difference = totalHeight - elementHeight;
        const newContainerHeight = containerHeight - difference;
        container.style.height = `${newContainerHeight}px`;
      }
    } else {
      setIsTextSelected(false);
      // Відновлюємо початкову висоту при знятті виділення
      container.style.removeProperty('height');
    }
  };

const handleContentChange = (newContent) => {
  setContent(newContent); // Оновлюємо локальний стан
  updateSheet({ ...sheet, content: newContent }); // Зберігаємо в батьківському компоненті
};

  return (
    <div className="w-full h-full bg-white shadow-lg flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <Button onClick={handleCloseEditor} className="p-2 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-black" />
        </Button>
        <div ref={nameRef} className="flex-grow text-center">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              className="text-xl font-bold border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 w-full text-center"
              autoFocus
            />
          ) : (
            <h1 className="text-xl font-bold cursor-pointer" onClick={handleNameClick}>
              {name}
            </h1>
          )}
        </div>
        <Button
          onClick={() => setIsTagModalOpen(true)}
          className="p-2 hover:bg-gray-100"
        >
          <Tag className="h-5 w-5 text-black" />
        </Button>
      </div>
      <div id="input-text-container" className={`toolbar-container flex flex-col flex-grow overflow-hidden ${isTextSelected ? "visible" : ""}`}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleContentChange}
          onChangeSelection={handleSelectionChange}
          className="flex-grow overflow-y-auto h-full"
          scrollingContainer='html, body'
          modules={{
            toolbar: [
              ["bold", "italic", "underline", "strike"], // Basic formatting
              [{ list: "ordered" }, { list: "bullet" }], // Lists
              [{ color: [] }, { background: [] }],       // Dropdowns for color and background color
              ["clean"]
            ],
          }}
          placeholder="Write something amazing..."
        />
      </div>
      {isTagModalOpen && (
        <TagSelectorModal
          existingTags={allTags}
          selectedTags={sheet.tags}
          onClose={() => setIsTagModalOpen(false)}
          onSave={handleTagSelect}
        />
      )}
    </div>
  );
}

