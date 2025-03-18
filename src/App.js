import "./App.css";
import React from "react";
import { useEffect, useState } from "react";

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(25 * 60);
  const [displayTime, setDisplayTime] = useState("25:00");
  const [timerLabel, setTimerLabel] = useState("Session");
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      if (isBreak) {
        if (totalSecondsLeft > 0) {
          setTimerLabel("Break");
          intervalId = setInterval(() => {
            setTotalSecondsLeft((prevTime) => prevTime - 1);
          }, 1000);
          setDisplayTime(formatTime(totalSecondsLeft));
        } else if (totalSecondsLeft === 0) {
          clickHandler({ target: { id: "reset" } });
          setTimerLabel("Session");
          setIsBreak(false);
          setTotalSecondsLeft(sessionLength * 60);
          setDisplayTime(formatTime(totalSecondsLeft));
        }
      } else {
        if (totalSecondsLeft > 0) {
          setTimerLabel("Session");
          intervalId = setInterval(() => {
            setTotalSecondsLeft((prevTime) => prevTime - 1);
          }, 1000);
          setDisplayTime(formatTime(totalSecondsLeft));
        } else if (totalSecondsLeft === 0) {
          setTimerLabel("Break");
          setIsBreak(true);
          setTotalSecondsLeft(breakLength * 60);
          setDisplayTime(formatTime(totalSecondsLeft));
          document.getElementById("beep").play();
        }
      }
    }
    return () => clearInterval(intervalId); // Cleanup on unmount or when isRunning becomes false
  }, [isRunning, totalSecondsLeft, isBreak]);

  //Update the totalSecondsLeft and displayTime when sessionLength changes
  useEffect(() => {
    const totalSeconds = sessionLength * 60;
    setTotalSecondsLeft(totalSeconds);
    const formattedTime = formatTime(sessionLength * 60);
    setDisplayTime(formattedTime);
  }, [sessionLength]);

  useEffect(() => {}, [isRunning]);

  //hanldle when session, break, start_stop, reset buttons are clicked
  const clickHandler = (e) => {
    const id = e.target.id;
    switch (id) {
      case "break-decrement":
        if (breakLength > 1) {
          setBreakLength(breakLength - 1);
        }
        break;
      case "break-increment":
        if (breakLength < 60) {
          setBreakLength(breakLength + 1);
        }
        break;
      case "session-decrement":
        if (sessionLength > 1) {
          setSessionLength(sessionLength - 1);
        }
        break;
      case "session-increment":
        if (sessionLength < 60) {
          setSessionLength(sessionLength + 1);
        }
        break;
      case "start_stop":
        setIsRunning(!isRunning);
        break;
      case "reset":
        setIsRunning(false);
        setIsBreak(false);
        setBreakLength(5);
        setSessionLength(25);
        setTotalSecondsLeft(25 * 60);
        setDisplayTime("25:00");
        setTimerLabel("Session");
        document.getElementById("beep").pause();
        document.getElementById("beep").currentTime = 0;
        break;
      default:
        break;
    }
  };

  return (
    <div className="App">
      <header className="App-header">Timer Clock</header>
      <div id="sections">
        <div id="break-section">
          <div id="break-label">Break Length</div>
          <button id="break-decrement" onClick={clickHandler}>
            Break Decrement
          </button>
          <div id="break-length">{breakLength}</div>
          <button id="break-increment" onClick={clickHandler}>
            Break Increment
          </button>
        </div>
        <div id="session-section">
          <div id="session-label">Session Length</div>
          <button id="session-decrement" onClick={clickHandler}>
            Session Decrement
          </button>
          <div id="session-length">{sessionLength}</div>
          <button id="session-increment" onClick={clickHandler}>
            Session Increment
          </button>
        </div>
        <div id="timer-section">
          <div id="timer-label">{timerLabel}</div>
          <div id="time-left">{displayTime}</div>
          <button id="start_stop" onClick={clickHandler}>
            Start/Stop
          </button>
          <button id="reset" onClick={clickHandler}>
            Reset
          </button>
          <audio
            id="beep"
            src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
          ></audio>
        </div>
      </div>
      <footer>
        <p>
          Designed and Coded by: <strong>Sina Kiamehr</strong>
        </p>
      </footer>
    </div>
  );
}

export default App;
