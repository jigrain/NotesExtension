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
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nameRef.current && !nameRef.current.contains(event.target)) {
        setIsEditing(false);
        updateSheet({ ...sheet, name });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [nameRef, updateSheet, sheet, name]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { height } = entry.contentRect;
        if (isTextSelected) {
          const toolbarHeight = 43; // Висота тулбара
          const newHeight = height - toolbarHeight;
          container.style.height = `${newHeight}px`;
        } else {
          container.style.height = `${height}px`;
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.unobserve(container);
    };
  }, [isTextSelected]);

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
    updateSheet({ ...sheet, content });
    closeEditor();
  };

  const handleSelectionChange = (range) => {
    const container = containerRef.current;
    if (!container) return;

    if (range && range.length > 0) {
      setIsTextSelected(true);
      const toolbarHeight = 43; // Висота тулбара
      const newHeight = container.offsetHeight - toolbarHeight;
      container.style.height = `${newHeight}px`;
    } else {
      setIsTextSelected(false);
      container.style.height = `${initialContainerHeight}px`;
    }
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    updateSheet({ ...sheet, content: newContent });
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
      <div id="input-text-container" ref={containerRef} className={`toolbar-container flex flex-col flex-grow overflow-hidden ${isTextSelected ? "visible" : ""}`}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleContentChange}
          onChangeSelection={handleSelectionChange}
          className="flex-grow overflow-y-auto h-full"
          scrollingContainer='html, body'
          modules={{
            toolbar: [
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ color: [] }, { background: [] }],
              ["clean"]
            ],
          }}
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