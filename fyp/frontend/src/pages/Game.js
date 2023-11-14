import React, { useEffect } from 'react';
import { SplendidGrandPiano } from 'smplr';

const Game = () => {
  useEffect(() => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const piano = new SplendidGrandPiano(context);

    piano.load.then(() => {
    const handleButtonClick = () => {
      context.resume(); // enable audio context after a user interaction
      piano.start({ note: 60, velocity: 80 });
    };

    document.getElementById("btn").addEventListener("click", handleButtonClick);

    return () => {
      // Cleanup: remove the event listener and close the audio context
      document.getElementById("btn").removeEventListener("click", handleButtonClick);
      context.close();
    };
  }, []); 
});// The empty dependency array ensures the effect runs once when the component mounts

  return (
    <div>
      <button id="btn">Play</button>
    </div>
  );
};

export default Game;