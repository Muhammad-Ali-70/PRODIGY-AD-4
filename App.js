// App.js

import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

const App = () => {
  const [running, setRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (running) return;

    setRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 10);
    }, 10);
  };

  const pauseTimer = () => {
    if (!running) return;

    setRunning(false);
    clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    setRunning(false);
    setElapsedTime(0);
    clearInterval(intervalRef.current);
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}:${String(milliseconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.time}>{formatTime(elapsedTime)}</Text>
      <View style={styles.buttonContainer}>
        {!running ? (
          <TouchableOpacity style={styles.buttonStart} onPress={startTimer}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.buttonPause} onPress={pauseTimer}>
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.buttonReset} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E', // Dark background for modern look
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF', // White color for contrast
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  buttonStart: {
    backgroundColor: '#4CAF50', // Green color for Start
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 10,
    elevation: 4, // Shadow effect
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonPause: {
    backgroundColor: '#FFC107', // Yellow color for Pause
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonReset: {
    backgroundColor: '#F44336', // Red color for Reset
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF', // White text
    fontSize: 18,
    fontWeight: '600',
  },
});

export default App;
