import React from 'react';

function Reward({ position }) {
  return (
    <div 
      className="absolute bg-yellow-400 w-5 h-5 rounded-full"
      style={{ left: position.x, top: position.y }}
    />
  );
}

export default Reward;
