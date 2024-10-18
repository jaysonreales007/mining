import React from 'react';

function Obstacle({ position }) {
  return (
    <div 
      className="absolute bg-red-500 w-10 h-10"
      style={{ left: position.x, top: position.y }}
    />
  );
}

export default Obstacle;
