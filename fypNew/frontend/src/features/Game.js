import React from "react";
import { socket } from "../api/socket";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Option } from "./Option";
import { Container } from "react-bootstrap";
import { setIsStarted } from "./gameSlice";
import { instrument as soundfontInstrument } from "soundfont-player";
import { question, setNote, setTone, allAnswers, setSelectedAns, setCorrectAnswer, correctAns, currentTone } from "./questionsSlice";
import Player from "./Player";


export default function Game(){
    const { id } = useParams();
    const dispatch = useDispatch();
    const hostId = useSelector(state => state.game.hostId);
    const answers = useSelector(allAnswers);
    const isStarted = useSelector(state => state.game.isStarted);
    const [isPianoReady, setIsPianoReady] = useState(false);
    const [piano, setPiano] = useState(null);

    let somePiano;
    useEffect(() => { // fix loading 
        const ac = new AudioContext();
        soundfontInstrument(ac, 'acoustic_grand_piano', { soundfont: 'MusyngKite' })
          .then((acoustic_grand_piano) => {
            somePiano = acoustic_grand_piano;
            setPiano(acoustic_grand_piano);
            console.log("piano set from game");
            setIsPianoReady(true);
          });
    
        return () => {
          ac.close();
        };
      }, []);

    useEffect(() => {
            socket.on("gameStarted", () => {
            dispatch(setIsStarted(true));
            console.log("gameStarted");
        });
        return () => {
            socket.off("gameStarted");
        };
    }, []);

    useEffect(() => {
        if(isPianoReady){
            if (socket.id === hostId){ // emit the question to the server if the user is the host
                socket.emit("getQuestion", { roomId: id , round: 1});
                socket.on("tone", (tone) => {
                    dispatch(setTone(tone));
                    console.log("question: " + tone);
                    handlePlayNote(tone);
                    console.log("tried playing note " + tone);
                })
            };
            return () => {
                socket.off("gameStarted");
                socket.off("question");
            };
        }
    }, [isPianoReady]);

    useEffect(() => {
        if (isPianoReady){
            socket.emit("getCorrectAnswer", { roomId: id });
            socket.on("correctAnswer", (correctAnswer) => {
                dispatch(setCorrectAnswer(correctAnswer));
                console.log("correctAnswer: " + correctAnswer);
            });
            return () => {
                socket.off("correctAnswer");
            };
        }
    }, [isPianoReady]);

    const tone = useSelector(currentTone);

    console.log("question before playnote: " + tone);
    async function handlePlayNote(note = tone){
        if (piano){
                await
                piano.play(note);
                console.log("played note " + tone)
        } else {
            console.log("piano not ready");
        }
    }


    useEffect(() => {
        socket.on("gameEnded", () => {
            dispatch(setIsStarted(false));
        });
        return () => {
            socket.off("gameEnded");
        };
    });

    function endGame(){
        socket.emit("endGame", { roomId: id });
        dispatch(setIsStarted(false));
    }

    

    return (
        <div>
            <h1>Game ID: {id}</h1>
            <p>What note is this ? </p>
            {!isPianoReady && (
                <p>loading piano...</p>
            )}
            {isPianoReady && (
            <div>
                <div>
                <button onClick={() => endGame()}>End Game</button>
                <button onClick={() => handlePlayNote()}>Play Note</button>
                </div>
                <div>
                    <div>
                        <Player />
                    </div>
                </div>
            </div>
            )}
        </div>
            );
}
