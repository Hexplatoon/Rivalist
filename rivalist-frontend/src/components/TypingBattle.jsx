import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Keyboard from './Keyboard';
import { useBattle, useStomp } from '@/utils/StompContext';

const TypingBattle = () => {
  const { battleData } = useBattle();
  const { send } = useStomp();
  const [text] = useState(battleData.config.text);
  const [duration] = useState(battleData.config.duration);
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [pressedKey, setPressedKey] = useState('');
  const [errors, setErrors] = useState([]);
  const inputRef = useRef(null);
  const textContainerRef = useRef(null);
  const currentCharRef = useRef(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    console.log(input);
    if (timeLeft === 0) {
      const payload = {
        battleId: battleData.battleId,
        text: input,
      };
      send('/app/battle/end', payload);
    }
  }, [timeLeft, input, battleData.battleId]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (currentCharRef.current && textContainerRef.current) {
      const container = textContainerRef.current;
      const currentChar = currentCharRef.current;
      const containerRect = container.getBoundingClientRect();
      const charRect = currentChar.getBoundingClientRect();
      if (charRect.top > containerRect.bottom - 50) {
        container.scrollTop += charRect.height * 2;
      }
    }
  }, [input]);

  // Function to find the start index of the next word
  const findNextWordStart = (currentPosition) => {
    // Find the end of the current word (next space)
    let nextSpaceIndex = text.indexOf(' ', currentPosition);
    
    // If there's no space after the current position, we're on the last word
    if (nextSpaceIndex === -1) return text.length;
    
    // Skip the space to get to the start of the next word
    return nextSpaceIndex + 1;
  };

  const handleKeyDown = (e) => {
    // Check if space key is pressed and we're not at the end of text
    if (e.key === ' ' && input.length < text.length) {
      // Only skip if we're not already at a space
      if (text[input.length] !== ' ') {
        e.preventDefault(); // Prevent default space behavior
        
        // Find where the next word starts
        const nextWordStart = findNextWordStart(input.length);
        
        // Extract the text content up to the next word
        const extractedContent = text.substring(0, nextWordStart);
        
        // Process each character that will be "typed"
        let newInput = '';
        for (let i = 0; i < nextWordStart; i++) {
          // For characters already typed, keep the user's input
          if (i < input.length) {
            newInput += input[i];
          } else {
            // For characters being skipped, add the actual text character
            newInput += text[i];
          }
        }
        
        // Update input to include skipped content
        setInput(newInput);
        setPressedKey(' ');
        
        // Update errors list for skipped characters
        const newErrors = [...errors]; // Keep existing errors
        for (let i = input.length; i < nextWordStart; i++) {
          // Add skipped positions to errors if they're not spaces
          // (we're marking auto-completed text as errors)
          if (text[i] !== ' ') {
            newErrors.push(i);
          }
        }
        setErrors(newErrors);
      }
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setPressedKey(value.slice(-1));

    const newErrors = [];
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        newErrors.push(i);
      }
    }
    setErrors(newErrors);
  };

  const renderText = () =>
    text.split('').map((char, i) => {
      const typedChar = input[i];
      const isCorrect = typedChar === char;
      const isTyped = typedChar !== undefined;
      const isCurrent = input.length === i;

      let className = 'text-muted-foreground';
      if (isTyped) className = isCorrect ? 'text-green-500' : 'text-red-500';
      if (isCurrent) className += ' border-l-2 border-blue-500 animate-pulse';

      return (
        <span
          key={i}
          className={className}
          ref={isCurrent ? currentCharRef : null}
        >
          {char}
        </span>
      );
    });

  return (
    <div className="w-full max-w-6xl mt-16 mx-auto p-6 space-y-4">
      <Card className="p-6 shadow-lg w-full">
        <CardContent
          ref={textContainerRef}
          className="font-mono text-xl md:text-2xl leading-relaxed whitespace-pre-wrap px-8 py-6 max-h-60 overflow-y-auto scrollbar-hide"
          onClick={() => inputRef.current?.focus()}
        >
          {renderText()}
        </CardContent>
      </Card>

      <div className="flex justify-end items-center">
        <div className="text-lg font-semibold text-white">
          Time left: {timeLeft}s
        </div>
      </div>

      <Progress value={(100 * timeLeft) / duration} className="h-2 mb-15" />

      <input
        ref={inputRef}
        className="absolute opacity-0 w-0 h-0"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={timeLeft === 0}
        autoFocus
      />

      <Keyboard pressedKey={pressedKey} />
    </div>
  );
};

// 👇 Inject style to hide scrollbars but allow scrolling
const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(style);

export default TypingBattle;