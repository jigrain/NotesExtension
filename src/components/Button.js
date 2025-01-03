import React from 'react';

export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
      {...props}
    >
      {React.Children.map(children, child =>
        React.isValidElement(child) && child.type.name === 'LucideIcon'
          ? React.cloneElement(child, { className: `${child.props.className || ''} text-black` })
          : child
      )}
    </button>
  );
}

