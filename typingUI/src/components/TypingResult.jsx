import React from 'react';

const TypingResult = ({ typedText, onRestart, resultsSent = false }) => {
  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Test Complete</h2>
      
      {/* Result sending status indicator */}
      <div className={`mb-4 p-3 rounded-lg flex items-center justify-center ${
        resultsSent ? 'bg-green-900/30' : 'bg-red-900/30'
      }`}>
        <div className={`w-3 h-3 rounded-full mr-2 ${
          resultsSent ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <span className={`text-sm ${
          resultsSent ? 'text-green-400' : 'text-red-400'
        }`}>
          {resultsSent 
            ? 'Results successfully sent to the server' 
            : 'Could not send results to the server'}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="mt-4 p-4 bg-gray-800 rounded-lg text-left overflow-auto max-h-60">
          <h3 className="text-md font-semibold mb-2 text-gray-300">Your Typed Text:</h3>
          <p className="text-white whitespace-pre-wrap break-words">{typedText}</p>
        </div>
      </div>
      
      <button
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        onClick={onRestart}
      >
        Restart
      </button>
    </div>
  );
};

export default TypingResult;
