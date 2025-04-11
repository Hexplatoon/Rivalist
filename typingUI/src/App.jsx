import React, { useState, useEffect } from 'react';
import TypingTest from './components/TypingTest';
import TypingResult from './components/TypingResult';
import { initWebSocket, connectToBattleEnd, BATTLE_END_ENDPOINT, APP_PREFIX } from './utils/websocket';

const App = () => {
  const [typedText, setTypedText] = useState('');
  const [duration, setDuration] = useState(30);
  const [testStarted, setTestStarted] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsError, setWsError] = useState(null);
  const [resultsSent, setResultsSent] = useState(false);

  const handleFinish = (text, success, error) => {
    setTypedText(text);
    
    // If success is explicitly provided (not undefined or null), update the result status
    if (success !== undefined && success !== null) {
      setResultsSent(success);
      
      if (error) {
        setWsError(error);
      } else if (success) {
        setWsError(null);
      }
    } else {
      // Initial call without confirmed status - just set based on connection
      setResultsSent(wsConnected);
      
      if (!wsConnected) {
        setWsError('WebSocket not connected. Results could not be sent.');
      }
    }
  };

  const handleRestart = () => {
    setTypedText('');
    setTestStarted(false);
    setResultsSent(false);
  };
  
  // Initialize and monitor WebSocket connection
  useEffect(() => {
    // Initialize the WebSocket connection with the battle end endpoint
    // Using connectToBattleEnd which is a convenience function for the battle end endpoint
    const socket = connectToBattleEnd((data) => {
      // Handle any messages received from server
      console.log('Received WebSocket message:', data);
    });
    
    // Check if socket was successfully created
    if (!socket) {
      // If no socket was created
      setWsConnected(false);
      setWsError('Failed to create WebSocket connection');
      return; // Exit early
    }
    
    // Set up event listeners for connection status
    const handleOpen = () => {
      setWsConnected(true);
      setWsError(null);
      console.log('WebSocket connected to battle end endpoint');
    };
    
    const handleClose = (event) => {
      setWsConnected(false);
      console.log('WebSocket disconnected:', event.code, event.reason);
      
      if (event.code !== 1000) {
        // Not a normal closure
        setWsError(`Connection closed (${event.code}). Results may not be sent.`);
      }
    };
    
    const handleError = (error) => {
      setWsConnected(false);
      setWsError('Connection error. Results may not be sent.');
      console.error('WebSocket error:', error);
    };
    
    // Add event listeners
    socket.addEventListener('open', handleOpen);
    socket.addEventListener('close', handleClose);
    socket.addEventListener('error', handleError);
    
    // Check initial connection state
    setWsConnected(socket.readyState === WebSocket.OPEN);
    
    // Clean up event listeners when component unmounts
    return () => {
      socket.removeEventListener('open', handleOpen);
      socket.removeEventListener('close', handleClose);
      socket.removeEventListener('error', handleError);
      
      // Don't close the socket here, let the utility handle reconnects
      // Only close if we're navigating away from the app
      if (socket.readyState === WebSocket.OPEN && window.isUnloading) {
        socket.close(1000, 'Component unmounted');
      }
    };
  }, []);

  // Add window unload event handler to detect page close
  useEffect(() => {
    const handleUnload = () => {
      window.isUnloading = true;
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('WebSocket Connection Status:', wsConnected ? 'Connected' : 'Disconnected');
    console.log('Results Sent Status:', resultsSent ? 'Success' : 'Not sent');
    if (wsError) {
      console.warn('WebSocket Error:', wsError);
    }
  }, [wsConnected, resultsSent, wsError]);

  return (
    <div className="min-h-screen bg-black text-white p-4 relative">
      {/* WebSocket connection status indicator */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <div className={`flex items-center px-3 py-1 rounded ${
          wsConnected ? 'bg-green-900/40' : 'bg-red-900/40'
        }`}>
          <div className={`w-3 h-3 rounded-full mr-2 ${
            wsConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <span className="text-xs text-gray-200">
            {wsConnected ? `Connected to ${BATTLE_END_ENDPOINT}` : 'Disconnected'}
          </span>
        </div>
        {wsError && (
          <div className="px-3 py-1 bg-red-900/30 rounded text-xs text-red-400 max-w-xs">{wsError}</div>
        )}
      </div>

      {/* Main content */}
      <div className="pt-8">
        {!typedText ? (
          <>
            {!testStarted && (
              <div className="mb-4">
                <select
                  id="duration"
                  className="text-black px-2 py-1 rounded"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                >
                  <option value={15}>15s</option>
                  <option value={30}>30s</option>
                  <option value={60}>60s</option>
                  <option value={120}>120s</option>
                </select>
              </div>
            )}
            <TypingTest
              onFinish={handleFinish}
              duration={duration}
              onStart={() => setTestStarted(true)}
            />
          </>
        ) : (
          <TypingResult 
            typedText={typedText} 
            onRestart={handleRestart} 
            resultsSent={resultsSent}
          />
        )}
      </div>

      {/* Debug Information (visible in development mode) */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-2 left-2 p-2 bg-gray-900/80 rounded max-w-md text-xs text-gray-400 overflow-auto max-h-64 z-50">
          <div className="font-bold mb-1 text-white">Debug Info:</div>
          <div className="grid grid-cols-2 gap-1">
            <div>WS Connected:</div>
            <div className={wsConnected ? 'text-green-400' : 'text-red-400'}>
              {wsConnected ? '✅ Connected' : '❌ Disconnected'}
            </div>
            
            <div>Results Sent:</div>
            <div className={resultsSent ? 'text-green-400' : 'text-yellow-400'}>
              {resultsSent ? '✅ Success' : '⚠️ Not sent'}
            </div>
          </div>
          
          {wsError && (
            <div className="mt-2 p-1 bg-red-900/50 rounded">
              <div className="font-bold text-red-400">Error:</div>
              <div className="text-red-300">{wsError}</div>
            </div>
          )}
          
          <div className="mt-2 text-gray-500 text-[10px]">
            Endpoint: {APP_PREFIX}{BATTLE_END_ENDPOINT}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
