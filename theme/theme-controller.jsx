// src/theme/theme-controller.jsx
import React from 'react';

export default function ThemeController() {
  const handleThemeChange = (event) => {
    if (event.target.checked) {
      // Set theme to "black"
      document.documentElement.setAttribute('data-theme', 'black');
    } else {
      // Set theme to "fantasy"
      document.documentElement.setAttribute('data-theme', 'fantasy');
    }
  };

  return (
    <div className="flex-none gap-2 mr-4">
      <label className="flex cursor-pointer gap-2">
        {/* Sun icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>

        {/* Toggle checkbox */}
        <input
          type="checkbox"
          className="toggle theme-controller"
          onChange={handleThemeChange}
        />

        {/* Moon icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"></path>
        </svg>
      </label>
    </div>
  );
}
