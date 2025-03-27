
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center animate-fade-in">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="28" rx="7" fill="black" />
        <path d="M9.2 14L12.8 17.6L18.8 9.6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="ml-2 font-display text-xl font-semibold tracking-tight">Digitalio</span>
    </div>
  );
};

export default Logo;
