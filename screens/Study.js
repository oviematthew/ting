import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";

const Study = () => {
  const [name, setName] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        if (seconds === 0 && minutes === 0 && hours === 0) {
          handleCompleteTimer();
        } else {
          if (seconds === 0) {
            if (minutes === 0) {
              if (hours === 0) {
                clearInterval(interval);
                handleCompleteTimer();
              } else {
                setHours((hours) => hours - 1);
                setMinutes(59);
              }
            } else {
              setMinutes((minutes) => minutes - 1);
            }
            setSeconds(59);
          } else {
            setSeconds((seconds) => seconds - 1);
          }
        }
      }, 1000);
    } else if (!isActive && (seconds !== 0 || minutes !== 0 || hours !== 0)) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, seconds, minutes, hours]);

  const handleStart = () => {
    if (!name) {
      Alert.alert(
        "Oh Boy! 🥹 ",
        `Apparently, you need to enter the name of the session 🤔`,
        [
          {
            text: "OK",
          },
        ]
      );
    } else {
      setIsActive(true);
      setTimerStarted(true);
      hoursInputRef.current.blur();
      minutesInputRef.current.blur();
      secondsInputRef.current.blur();
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const handleCompleteTimer = () => {
    setTimeout(() => {
      Alert.alert("Whoops 🥳 ", `Study session "${name}" completed`, [
        {
          text: "OK",
        },
      ]);
      handleReset();
      setName("");
      setTimerStarted(false);
    }, 100);
  };

  const formatTime = (time) => {
    return time < 10 ? "0" + time : time;
  };

  // Refs for text inputs
  const hoursInputRef = useRef(null);
  const minutesInputRef = useRef(null);
  const secondsInputRef = useRef(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study Timer</Text>
      {!timerStarted && (
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter name of study session"
        />
      )}

      {timerStarted && (
        <Text style={styles.smalltitle}>Study Session: {name} ongoing...</Text>
      )}

      <View style={styles.timeInput}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.timeInputField}
            value={formatTime(hours).toString()}
            ref={hoursInputRef}
            keyboardType="numeric"
            onChangeText={(text) => setHours(parseInt(text) || 0)}
          />
          <Text style={styles.timeInputLabel}>Hours</Text>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.timeInputField}
            value={formatTime(minutes).toString()}
            ref={minutesInputRef}
            keyboardType="numeric"
            onChangeText={(text) => setMinutes(parseInt(text) || 0)}
          />
          <Text style={styles.timeInputLabel}>Minutes</Text>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.timeInputField}
            value={formatTime(seconds).toString()}
            ref={secondsInputRef}
            keyboardType="numeric"
            onChangeText={(text) => setSeconds(parseInt(text) || 0)}
          />
          <Text style={styles.timeInputLabel}>Seconds</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        {!isActive &&
          !isPaused && ( // Render Start button if timer hasn't started
            <Button mode="contained" onPress={handleStart}>
              Start
            </Button>
          )}
        {isActive &&
          !isPaused && ( // Render Pause button if timer is active and not paused
            <Button mode="contained" onPress={handlePause}>
              Pause
            </Button>
          )}
        {isActive &&
          isPaused && ( // Render Resume button if timer is active and paused
            <Button mode="contained" onPress={handleResume}>
              Resume
            </Button>
          )}
        <Button mode="contained" onPress={handleReset}>
          Reset
        </Button>
        <Button mode="contained" onPress={handleCompleteTimer}>
          Done
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  smalltitle: {
    fontSize: 15,
    marginBottom: 20,
  },
  inputView: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "100%",
    marginBottom: 10,
  },
  timeInput: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 30,
  },
  timeInputField: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: 80,
    textAlign: "center",
    marginBottom: 10,
  },
  timeInputLabel: {
    alignSelf: "center",
    marginRight: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
});

export default Study;