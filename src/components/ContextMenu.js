import React, { useEffect, useRef } from 'react';

export default function ContextMenu({ x, y, onClose, options }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute bg-white border rounded shadow-lg"
      style={{ top: y, left: x }}
    >
      {options.map((option, index) => (
        <button
          key={index}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          onClick={() => {
            option.action();
            onClose();
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

