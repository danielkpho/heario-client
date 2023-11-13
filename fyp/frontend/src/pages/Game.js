import { React } from 'react';
import { SplendidGrandPiano } from 'smplr';


const Game = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const piano = new SplendidGrandPiano(context);
    piano.start({ note: "C4", velocity: 80, time: 5, duration: 1 });
    return (
        <div>
            
        </div>
    );
}

export default Game;