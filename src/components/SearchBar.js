import React from 'react';

export default function SearchBar({ value, onChange, className = '' }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search sheets..."
      className={`px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}

