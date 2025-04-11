import React from 'react';

const keys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ['SPACE']
];

const Keyboard = ({ pressedKey }) => {
  const getKeyClass = (key) => {
    if (key === 'SPACE' && (pressedKey === ' ' || pressedKey === 'Space')) return 'bg-green-600';
    return pressedKey && pressedKey.toUpperCase() === key ? 'bg-green-600' : 'bg-gray-800';
  };

  return (
    <div className="mt-6 flex flex-col items-center space-y-2">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex space-x-2">
          {row.map((key) => (
            <div
              key={key}
              className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg text-white text-sm font-medium transition-colors duration-100 ${getKeyClass(key)}`}
            >
              {key === 'SPACE' ? <span className="text-xs">SPACE</span> : key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;