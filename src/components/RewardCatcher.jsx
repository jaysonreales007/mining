import React from 'react';

function RewardCatcher({ position }) {
  return (
    <div 
      className="absolute bg-blue-500 w-10 h-10 rounded-full"
      style={{ left: position.x, top: position.y }}
    />
  );
}

export default RewardCatcher;
