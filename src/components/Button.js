import React from 'react';

export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`p-1 sm:p-2 rounded-md transition-colors duration-200 ${className}`}
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

