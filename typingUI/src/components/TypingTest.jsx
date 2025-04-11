import React, { useState, useEffect, useRef } from 'react';
import Keyboard from './Keyboard';
import { sendBattleEnd, isConnected, initWebSocket, connectToBattleEnd, closeWebSocket } from '../utils/websocket';

const TypingTest = ({ onFinish, duration, onStart }) => {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for typing practice. Try to type it as accurately and quickly as possible without making mistakes. Good luck and enjoy your practice!');
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [pressedKey, setPressedKey] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [errors, setErrors] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(duration);
  const [started, setStarted] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  // Combined send status state: 'idle', 'sending', 'success', 'error'
  const [sendStatus, setSendStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState(null);
  const [sendAttempts, setSendAttempts] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);
  const inputRef = useRef(null);
  const maxSendAttempts = 3;

  // Initialize WebSocket connection when component mounts
  useEffect(() => {
    // Connect to the battle end endpoint
    const socket = connectToBattleEnd((data) => {
      console.log('Received data from battle end endpoint:', data);
      
      // Handle successful message receipt
      if (data && data.type === 'BATTLE_END_RECEIVED') {
        setSendStatus('success');
        setStatusMessage('Results received by server');
      }
    });
    
    // Initial connection status
    updateConnectionStatus();
    
    // Check connection status periodically
    const checkConnection = setInterval(updateConnectionStatus, 5000);
    
    // Helper function to update connection status
    function updateConnectionStatus() {
      const connected = isConnected();
      setWsConnected(connected);
      if (connected && sendStatus === 'error' && statusMessage === 'Connection lost') {
        // If connection was restored and we had a connection error
        setStatusMessage('Connection restored');
      }
    }
    
    // Clean up WebSocket connection when component unmounts
    return () => {
      clearInterval(checkConnection);
      closeWebSocket();
    };
  }, []);

  useEffect(() => {
    setTimeLeft(selectedDuration);
  }, [selectedDuration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isRunning) {
      finishTest();
    }
  }, [isRunning, timeLeft]);
  const finishTest = () => {
    // Stop the timer
    setIsRunning(false);
    
    // Save the final input in a local variable before clearing the input field
    // This ensures we use the correct value for sending and display
    const finalInput = input;
    
    // Reset and update state for sending process
    setSendStatus('sending');
    setStatusMessage('Sending results...');
    setSendAttempts(1);
    
    // Call sendResults with the saved input
    sendResults(finalInput);
    
    // Clear input field after saving the value
    setInput('');
  };
  
  // Separate function to handle sending results with retry logic
  const sendResults = (textToSend) => {
    // Make sure we have text to send (use parameter or current input)
    const finalText = textToSend || input;
    
    console.log(`Sending attempt ${sendAttempts}: typed text (${finalText.length} chars) and duration (${selectedDuration - timeLeft}s)`);
    
    // Check WebSocket connection before attempting to send
    const connected = isConnected();
    console.log('WebSocket connection status:', connected ? 'Connected' : 'Disconnected');
    
    if (!connected) {
      console.log('WebSocket not connected, attempting to reconnect...');
      setSendStatus('error');
      setStatusMessage('Connection lost. Attempting to reconnect...');
      
      // Try to reconnect first, then continue with sending
      connectToBattleEnd((data) => {
        console.log('Reconnected to battle end endpoint:', data);
        setSendStatus('sending');
        setStatusMessage('Connection restored. Sending data...');
        // After reconnection, continue with sending
        continueWithSending(finalText);
      });
    } else {
      // Connection is already established, proceed with sending
      continueWithSending(finalText);
    }
    
    // Reset UI state
    setErrors([]);
    setStarted(false);
    setHasStartedTyping(false);
  };
  
  // Helper function to continue with sending after connection check
  const continueWithSending = (textToSend) => {
    // Prepare typing data
    const typingData = {
      text: textToSend,
      duration: selectedDuration - timeLeft,
      timestamp: new Date().toISOString(),
      errors: errors.length,
      accuracy: textToSend.length > 0 
        ? ((textToSend.length - errors.length) / textToSend.length * 100).toFixed(2) 
        : "0.00",
      wpm: calculateWPM(textToSend, selectedDuration - timeLeft)
    };
    
    // Log the data being sent for debugging
    console.log('Sending typing data:', JSON.stringify(typingData));
    
    try {
      // Send data with status callback to handle async results
      sendBattleEnd(typingData, (success, error) => {
        console.log(`WebSocket callback received: success=${success}, error=${error || 'none'}`);
        
        if (success) {
          // Success - update status and notify parent
          setSendStatus('success');
          setStatusMessage('Results sent successfully!');
          console.log('Results sent successfully!');
          
          // Notify parent component of success
          onFinish(textToSend, true, null);
        } else {
          // Handle failure - check if we can retry
          if (sendAttempts < maxSendAttempts) {
            // Failed but can retry
            const currentAttempt = sendAttempts + 1;
            setSendAttempts(currentAttempt);
            
            const errorMsg = `Sending failed: ${error || 'Unknown error'}. Retrying... (${currentAttempt}/${maxSendAttempts})`;
            setSendStatus('error');
            setStatusMessage(errorMsg);
            console.warn(errorMsg);
            
            // Try again after a delay
            setTimeout(() => {
              console.log(`Retry attempt ${currentAttempt} starting...`);
              setSendStatus('sending');
              setStatusMessage(`Sending attempt ${currentAttempt}/${maxSendAttempts}...`);
              sendResults(textToSend);
            }, 2000);
          } else {
            // Max retries reached
            const errorMsg = `Failed to send results: ${error || 'Unknown error'}`;
            setSendStatus('error');
            setStatusMessage(errorMsg);
            console.error('Failed to send results after maximum retry attempts:', error);
            
            // Notify parent component of failure
            onFinish(textToSend, false, 'Failed to send results after multiple attempts');
          }
        }
      });
    } catch (error) {
      console.error('Exception in sendBattleEnd:', error);
      setSendStatus('error');
      setStatusMessage(`Error: ${error.message || 'Unknown error'}`);
      
      // Notify parent of failure
      onFinish(textToSend, false, `Error: ${error.message || 'Unknown error'}`);
    }
  };

  // Calculate words per minute
  const calculateWPM = (text, durationInSeconds) => {
    if (!text || text.length === 0 || !durationInSeconds || durationInSeconds === 0) {
      return 0;
    }
    // Average word length is considered to be 5 characters
    const words = text.length / 5;
    // Convert seconds to minutes
    const minutes = durationInSeconds / 60;
    // Calculate WPM
    return Math.round(words / minutes);
  };

  // Handle duration change
  const handleDurationChange = (newDuration) => {
    setSelectedDuration(newDuration);
    setTimeLeft(newDuration);
    setInput('');
    setIsRunning(false);
    setErrors([]);
    setStarted(false);
    setHasStartedTyping(false);
  };

  // Handle input changes
  const handleChange = (e) => {
    const value = e.target.value;
    
    // Start the timer when user starts typing
    if (!isRunning && value.length > 0 && !hasStartedTyping) {
      setIsRunning(true);
      setHasStartedTyping(true);
      onStart && onStart();
    }
    
    setInput(value);
    setPressedKey(value.slice(-1));

    // Keep error tracking for visual feedback only
    const newErrors = [];
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        newErrors.push(i);
      }
    }
    setErrors(newErrors);
  };

  const renderText = () => {
    return text.split('').map((char, i) => {
      const typedChar = input[i];
      const isCorrect = typedChar === char;
      const isTyped = typedChar !== undefined;
      const isCurrent = input.length === i;

      let className = 'text-gray-400';
      if (isTyped) {
        className = isCorrect ? 'text-green-400' : 'text-red-500';
      }
      if (isCurrent) {
        className += ' border-l-2 border-blue-500 animate-pulse';
      }

      return (
        <span key={i} className={`${className} whitespace-pre-wrap`}>{char}</span>
      );
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!started && e.code === 'Space') {
        setStarted(true);
        e.preventDefault();
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [started]);


  return (
    <div className={`p-6 transition-opacity duration-300 relative`}>
      {/* WebSocket & Connection status/error messaging */}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-[100] max-w-xs w-full shadow-lg backdrop-blur-sm bg-gray-900/80 rounded-lg border border-gray-700 overflow-hidden">
        {/* WebSocket connection indicator */}
        <div className={`px-4 py-2 text-sm font-medium flex items-center border-b border-gray-700 ${
          wsConnected ? 'bg-green-900/80 text-white' : 'bg-red-900/80 text-white'
        }`}>
          <div className={`w-4 h-4 mr-3 rounded-full ${
            wsConnected ? 'bg-green-400' : 'bg-red-400'
          } ${wsConnected ? 'animate-pulse' : ''}`}></div>
          <span className="font-bold">
            {wsConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <div className="px-4 py-3">
          {/* Status messages based on sendStatus */}
          {sendStatus === 'sending' && (
            <div className="flex items-center p-2 rounded-md bg-blue-900/60 text-white font-medium border border-blue-700">
              <div className="animate-spin w-4 h-4 mr-3 border-2 border-blue-400 border-r-transparent rounded-full"></div>
              <span>{statusMessage || `Sending results... (${sendAttempts}/${maxSendAttempts})`}</span>
            </div>
          )}
          
          {/* Error message */}
          {sendStatus === 'error' && (
            <div className="flex items-center p-2 rounded-md bg-red-900/60 text-white font-medium border border-red-700">
              <svg className="w-4 h-4 mr-2 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{statusMessage || 'Error sending results'}</span>
            </div>
          )}
          
          {/* Success message */}
          {sendStatus === 'success' && (
            <div className="flex items-center p-2 rounded-md bg-green-900/60 text-white font-medium border border-green-700">
              <svg className="w-4 h-4 mr-2 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{statusMessage || 'Results sent successfully!'}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className={`mb-4 text-xl font-semibold break-words p-4 rounded-lg shadow-md transition-all ${!started ? 'opacity-40 blur-sm' : 'opacity-100 blur-0'}`}>        
        <p className="flex flex-wrap gap-[0.05rem] leading-relaxed font-mono text-base">
          {renderText()}
        </p>
      </div>

      {!started && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="text-yellow-400 font-bold text-3xl animate-pulse text-center mb-6">
            Press <span className="text-white">Spacebar</span> to prepare, then start typing to begin the test
          </div>
          <div className="flex gap-4">
            {[15, 30, 60, 120].map((sec) => (
              <button
                key={sec}
                onClick={() => handleDurationChange(sec)}
                disabled={isRunning}
                className={`px-4 py-2 rounded text-sm font-medium border transition duration-150 ${
                  selectedDuration === sec
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`flex items-center justify-between mb-4 ${!started ? 'opacity-30' : 'opacity-100'} transition-opacity`}> 
        <div className="flex gap-4">
          {[15, 30, 60, 120].map((sec) => (
            <button
              key={sec}
              onClick={() => handleDurationChange(sec)}
              disabled={isRunning}
              className={`px-4 py-2 rounded text-sm font-medium border transition duration-150 ${
                selectedDuration === sec
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
        <div className="text-lg text-white font-semibold">Time left: {timeLeft}s</div>
      </div>

      <input
        ref={inputRef}
        className="absolute opacity-0 w-0 h-0"
        value={input}
        onChange={handleChange}
        disabled={timeLeft === 0}
        autoFocus
      />

      <Keyboard pressedKey={pressedKey} />
    </div>
  );
};

export default TypingTest;