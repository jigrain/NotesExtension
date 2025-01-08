import React from 'react';

export default function SearchBar({ value, onChange, className = '' }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search sheets..."
      className={`px-2 py-2 border rounded-full w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}

