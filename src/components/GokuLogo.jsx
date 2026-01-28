import React from 'react';

const GokuLogo = ({ className, width = "40px", height = "40px" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img 
        src="https://horizons-cdn.hostinger.com/88c88564-5cfa-48c7-ba1f-f0362e877b58/e73ba4271d332027aa4a1f0237fdcd1e.jpg"
        alt="GOKU Fitness"
        className="rounded-full object-cover border-2 border-[#FF6B35]"
        style={{ width, height }}
      />
      <span className="ml-3 text-xl font-bold tracking-wide font-[Teko] uppercase text-white">
        GOKU <span className="text-[#FF6B35]">FITNESS</span>
      </span>
    </div>
  );
};

export default GokuLogo;