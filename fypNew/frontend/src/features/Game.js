import React from "react";
import { socket } from "../api/socket";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setIsStarted, setScores, incrementRound, incrementQuestion, resetGame, setIsRoundOver, setIsGameOver, selectTimer, setStatus } from "./gameSlice";
import { setAnswers } from "./questionsSlice";
import { instrument as soundfontInstrument } from "soundfont-player";
import { question, setNote, setTone, allAnswers, setSelectedAns, setCorrectAnswer, correctAns, currentTone } from "./questionsSlice";
import Player from "./Player";
import Timer from "./Timer";
import Leaderboard from "./Leaderboard";

import { Grid, Button, Typography } from "@mui/material";
import { VolumeUp } from "@mui/icons-material";


export default function Game(){
    const { id } = useParams();
    const dispatch = useDispatch();
    const hostId = useSelector(state => state.game.hostId);
    const isHost = socket.id === hostId;
    const roundOver = useSelector(state => state.game.isRoundOver);
    const [isPianoReady, setIsPianoReady] = useState(false);
    const [piano, setPiano] = useState(null);
    const roundSettings = useSelector(state => state.game.roundSettings);
    const duration = useSelector(selectTimer);
    const roundCount = useSelector(state => state.game.roundCount);
    const correctAnswer = useSelector(correctAns);
    const isGameOver = useSelector(state => state.game.isGameOver);
    const isSharps = useSelector(state => state.game.roundSettings.sharps);
    const navigate = useNavigate();

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
        if(isPianoReady){
            if (socket.id === hostId){ // emit the question to the server if the user is the host
                socket.emit("getQuestion", { roomId: id , round: 1, sharps: isSharps});
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
            socket.emit("getTone", { roomId: id });
            socket.on("tone", (tone) => {
                dispatch(setTone(tone));
                console.log("question: " + tone);
                handlePlayNote(tone);
                console.log("tried playing note " + tone);
            });
            socket.emit("getAnswers", { roomId: id });
            socket.on("answers", (answers) => {
                dispatch(setAnswers(answers));
            });
            return () => {
                socket.off("correctAnswer");
            };
        }
    }, [isPianoReady]);

    const tone = useSelector(currentTone);

    async function handlePlayNote(note = tone){
        if (piano){
                await
                piano.play(note);
                console.log("played note " + tone)
        } else {
            console.log("piano not ready");
        }
    }

    function restartGame(){
        socket.emit("resetGame", { roomId: id });
        dispatch(resetGame());
    };


    function nextRound(){
        socket.emit("nextRound", { roomId: id });
    }

    useEffect(() => {
        socket.on("nextRound", () => {
            console.log("roundCount: " + roundCount);
            if(roundCount < roundSettings.rounds){
                socket.emit("getQuestion", { roomId: id, sharps: isSharps });
                socket.emit("startTimer", { roomId: id, duration })
                dispatch(incrementRound());
                dispatch(incrementQuestion());
                dispatch(setIsRoundOver(false));
            } else {
                dispatch(setIsGameOver(true));
                dispatch(setStatus("Leaderboard"));
            }
        });
        return () => {
            socket.off("nextRound");
        };
    });

    useEffect(( ) => {
        socket.on("scores", ({ scores }) => {
            dispatch(setScores(scores));
        });
        return () => {
            socket.off("scores");
        };
    });

    function handleLeave(){
        socket.emit("leaveRoom", { roomId: id });
        dispatch(setIsStarted(false));
        dispatch(setIsGameOver(false));
        dispatch(resetGame());
        dispatch(setStatus("idle"));
        navigate("/");
    }

    

    return (
        <div>
            {!isGameOver && (
                <div>
                {!isPianoReady && (
                    <p>loading piano...</p>
                )}
                {isPianoReady && (
                <div>
                    <div>
                    <button onClick={() => restartGame()}>End Game</button>
                    <button onClick={() => nextRound()}>Next Round</button>
                    </div>
                    <Grid container justifyContent="center" alignItems="center" spacing={2}>
                        <Grid item>
                            <Button 
                                variant="contained"
                                color="secondary"
                                startIcon={<VolumeUp />}
                                onClick={() => handlePlayNote()}
                                style={{ width: 200 }}
                            > 
                                Play Note
                                </Button>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center" alignItems="center" spacing={2} padding={2}>
                        <Grid item>
                            {!roundOver && (
                            <div>
                                <Player />
                            </div>           
                            )}
                        </Grid>
                    </Grid>
                    <div>
                        {roundOver && (
                            <div>
                                <p>The correct answer was {correctAnswer}</p>
                            </div>
                        )}
                        <div>
                            <Timer />
                        </div>
                    </div>
                </div>
                )}
            </div>
            )}
            {isGameOver && (
                <Grid 
                    container
                    direction={"column"}
                >
                    <Grid item>
                        <Leaderboard />
                    </Grid>
                    <Grid 
                    container 
                    direction={"row"} 
                    justifyContent={"center"} 
                    alignItems={"center"} 
                    spacing={2}
                    padding={3}
                    >
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleLeave()}
                            >
                                Leave Lobby
                            </Button>
                        </Grid>
                    {isHost && (
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => restartGame()}
                            >
                                Reset Game
                            </Button>
                        </Grid>
                    )}
                    
                    </Grid>
                </Grid>
            )}
        </div>
            );
}
