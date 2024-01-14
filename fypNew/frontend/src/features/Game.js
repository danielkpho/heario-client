import React, { useEffect, useState } from "react";
import { socket } from "../api/socket";
import { useDispatch, useSelector } from "react-redux";

import { instrument as soundfontInstrument } from "soundfont-player";

import { setIsStarted, resetState, setScores, incrementRound, incrementQuestion, resetGame, setIsRoundOver, setIsGameOver, selectTimer, setStatus } from "./gameSlice";
import { newQuestion, resetStats } from "./statSlice.js"
import { setAnswers, setQuestionType, setTone, setCorrectAnswer, correctAns, currentTone } from "./questionsSlice";


import Timer from "./Timer";
import Leaderboard from "./Leaderboard";
import Statistics from "./Statistics";
import { TonesAnswerButton } from "./TonesAnswerButtons";

import { Grid, Button, Backdrop } from "@mui/material";
import { VolumeUp } from "@mui/icons-material";

import Axios from "axios";


export default function Game(){
    const id = useSelector(state => state.game.id);
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
    const questionType = useSelector(state => state.questions.questionType);
    const tone = useSelector(currentTone);
    const [showBackdrop, setShowBackdrop] = useState(false);

    let somePiano;
    useEffect(() => { // fix loading 
        const ac = new AudioContext();
        soundfontInstrument(ac, 'acoustic_grand_piano', { soundfont: 'MusyngKite' })
          .then((acoustic_grand_piano) => {
            somePiano = acoustic_grand_piano;
            setPiano(acoustic_grand_piano);
            console.log("piano is ready");
            setIsPianoReady(true);
          });
    
        return () => {
          ac.close();
        };
      }, []);

    useEffect(() => {
        if(isPianoReady){
            if (socket.id === hostId){ // emit the question to the server if the user is the host
                console.log("emitted get question");
                socket.emit("getQuestion", id);
            };
            return () => {
                socket.off("gameStarted");
                socket.off("question");
            };
        }
    }, [isPianoReady]);

    useEffect(() => {
        if (isPianoReady){
            // socket.emit("getCorrectAnswer", { roomId: id });
            socket.on("correctAnswer", (correctAnswer) => {
                dispatch(setCorrectAnswer(correctAnswer));
                dispatch(newQuestion(correctAnswer));
            });
            // socket.emit("getTone", { roomId: id });
            socket.on("tone", (tone) => {
                dispatch(setTone(tone));
                console.log("received tone: "+ tone);
                handlePlayNote(tone);
            });
            // socket.emit("getAnswers", { roomId: id });
            socket.on("answers", (answers) => {
                dispatch(setAnswers(answers));
            });
            socket.on("questionType", (questionType) => {
                dispatch(setQuestionType(questionType));
            });
            return () => {
                socket.off("correctAnswer");
                socket.off("tone");
                socket.off("answers");
                
            };
        }
    }, [isPianoReady]);

    async function handlePlayNote() {
        if (piano) {
            try { 
                if (Array.isArray(tone)) {
                    if (questionType === 'scales'){
                    // Play notes sequentially with a delay
                        for (const note of tone) { 
                            await piano.play(note);
                            // Introduce a delay between notes
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                        console.log("Played notes: " + tone.join(', '));
                    } else {
                        await Promise.all(tone.map(note => piano.play(note)));
                        console.log("Played notes: " + tone.join(', '));
                    }
                } else {
                    console.error("Invalid tone format:", tone);
                }
                
            } catch (error) {
                console.error("Error playing notes:", error);
            }
        } else {
            console.log("Piano not ready");
        }
    }

    function restartGame(){
        socket.emit("resetGame", { roomId: id });
        dispatch(resetGame());
        dispatch(resetStats());
    };


    function nextRound(){
        socket.emit("nextRound", { roomId: id });
    }

    useEffect(() => {
        socket.on("nextRound", () => {
            console.log("roundCount: " + roundCount);
            if(roundCount < roundSettings.rounds){
                socket.emit("getQuestion", id);
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

    function handleOpen(){
        setShowBackdrop(true);
    }
    function handleClose(){
        setShowBackdrop(false);
    }

    function handleLeave(){
        socket.emit("leaveRoom", { roomId: id });
        dispatch(resetState());
        dispatch(resetStats())
    }

    useEffect(() => {
            
    }, []);

    

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
                                <TonesAnswerButton />
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
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleOpen()}
                            >
                                Statistics
                            </Button>
                            <Backdrop
                                sx= {{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open={showBackdrop}
                                onClick={handleClose}
                            >
                                <Statistics />
                            </Backdrop>
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
