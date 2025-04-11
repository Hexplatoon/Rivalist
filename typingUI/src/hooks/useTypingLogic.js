import { useState, useEffect } from 'react';
import sampleText from '../utils/sampleText';

const useTypingLogic = (onFinish) => {
  const [text, setText] = useState(sampleText);
  const [inputValue, setInputValue] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [lastKey, setLastKey] = useState(null);

  const handleInput = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const key = value.charAt(value.length - 1);
    if (key === ' ') {
      setLastKey('SPACE');
    } else {
      setLastKey(key.toUpperCase());
    }

    // Check if user has typed enough text to finish the test
    // Using a simple length comparison instead of word counting
    if (value.length >= text.length) {
      stopTest();
    }
  };

  const stopTest = () => {
    setIsRunning(false);
    
    // Only send the complete typed text to the backend
    onFinish(inputValue);
  };

  return {
    text,
    inputValue,
    handleInput,
    isRunning,
    startTest,
    stopTest,
    lastKey
  };
};

export default useTypingLogic;
