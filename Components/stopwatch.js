import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

const Stopwatch = ({ start, pause,clear }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (start && !isRunning) {
      startStopwatch();
    }
    if (pause && isRunning) {
      pauseStopwatch();
    }
    if(!start)
    {
        pauseStopwatch()
    }
   
  }, [start, pause]);

  useEffect(()=>{
    resetStopwatch()
  },[clear])

  const startStopwatch = () => {
    const startTime = Date.now() - elapsedTime;
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const updatedElapsedTime = now - startTime;
      setElapsedTime(updatedElapsedTime);
    }, 10);
    setIsRunning(true);
  };

  const pauseStopwatch = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setElapsedTime(0);
    setIsRunning(false);
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const millisecondsFormatted = Math.floor((milliseconds % 1000) / 10)
      .toString()
      .padStart(2, '0');

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}:${millisecondsFormatted}`;
  };

  return (
    <View>
      <Text
        style={{
          fontSize: 70,
          paddingTop:0
        }}
      >
        {formatTime(elapsedTime)}
      </Text>
    </View>
  );
};

export default Stopwatch;
