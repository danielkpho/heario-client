import React, { useEffect, useState, lazy, Suspense } from "react";
import { lazyWithPreload} from "react-lazy-with-preload"
import { socket } from "../api/socket";
import { useDispatch, useSelector } from "react-redux";

import { instrument as soundfontInstrument } from "soundfont-player";
import SoundfontProvider from "./Piano/SoundfontProvider.js";

import { resetState, setScores, incrementRound, incrementQuestion, resetGame, setIsRoundOver, setIsGameOver, selectTimer, setStatus } from "./gameSlice";
import { newQuestion, resetStats } from "./statSlice.js"
import { setAnswers, setQuestionType, setTone, setCorrectAnswer, correctAns, currentTone } from "./questionsSlice";


import Timer from "./Timer";
import Leaderboard from "./Leaderboard";
import Statistics from "./Statistics";
import { TonesAnswerButton } from "./TonesAnswerButtons";
import Leaderboard2 from "./Leaderboard2";

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
    const username = localStorage.getItem("username");
    const winner = useSelector(state => state.stats.winner);
    const token = localStorage.getItem("token");

    const LazyReactPiano = lazyWithPreload(() => import("./Piano/Piano.js"));
    const [pianoLoaded, setPianoLoaded] = useState(false);

    useEffect(() => {
        const loadReactPiano = async () => {
            // Assuming ReactPiano has an asynchronous initialization method
            await LazyReactPiano.preload();
            setPianoLoaded(true);
          };
      
          if (!pianoLoaded) {
            loadReactPiano();
          }
        }, [pianoLoaded]);

    let somePiano;
    useEffect(() => {
        const ac = new AudioContext();
        soundfontInstrument(ac, 'acoustic_grand_piano', { soundfont: 'MusyngKite' })
          .then((acoustic_grand_piano) => {
            somePiano = acoustic_grand_piano;
            setPiano(acoustic_grand_piano);
            console.log("piano is ready");
            setIsPianoReady(true);
            // console.log("ac state: " + ac.state);
          });
    
        return () => {
            if (ac.state === 'running') {
                ac.close();
              }
        };
      }, []);

    useEffect(() => {
        if(isPianoReady){
            if (socket.id === hostId){ // emit the question to the server if the user is the host
                // console.log("emitted get question");
                socket.emit("getQuestion", id);
            };
            return () => {
                socket.off("gameStarted");
                socket.off("question");
            };
        }
    }, [isPianoReady]);

    useEffect(() => {
            // socket.emit("getCorrectAnswer", { roomId: id });
            socket.on("correctAnswer", (correctAnswer) => {
                dispatch(setCorrectAnswer(correctAnswer));
                dispatch(newQuestion(correctAnswer));
            });
            // socket.emit("getTone", { roomId: id });
            socket.on("tone", (tone) => {
                dispatch(setTone(tone));
                // console.log("received tone: "+ tone);
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
    }, [dispatch]);

    async function handlePlayNote() {
        // console.log("isPianoReady: " + isPianoReady)
        // console.log("piano: " + JSON.stringify(piano))
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
                        // console.log("Played notes: " + tone.join(', '));
                    } else {
                        await Promise.all(tone.map(note => piano.play(note)));
                        // console.log("Played notes: " + tone.join(', '));
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

    function nextRound(){
        socket.emit("nextRound", { roomId: id });
    }
        

    useEffect(() => { // rendering twice
        socket.on("nextRound", () => {
            // console.log("roundCount: " + roundCount);
            if(roundCount < roundSettings.rounds){
                if(socket.id === hostId){
                    socket.emit("getQuestion", id);
                    socket.emit("startTimer", { roomId: id, duration })
                }
                dispatch(incrementRound());
                dispatch(incrementQuestion());
                dispatch(setIsRoundOver(false));
            } else {
                dispatch(setIsGameOver(true));
                dispatch(setStatus("Leaderboard"));
                if (socket.id === hostId){
                    socket.emit("gameEnded", { roomId: id })
                }
            }
        });
        return () => {
            socket.off("nextRound");
        };
    }, [roundCount, roundSettings.rounds, duration, dispatch]);

    useEffect(( ) => {
        socket.on("scores", ({ scores }) => {
            dispatch(setScores(scores));
        });
        return () => {
            socket.off("scores");
        };
    }, [dispatch]);

    function handleOpen(){
        setShowBackdrop(true);
    }
    function handleClose(){
        setShowBackdrop(false);
    }

    function handleLeave(){ // problem with rendering twice so it is here
        if (username === winner){ 
            Axios.post("https://heario-13b5b094cc85.herokuapp.com/incrementGamesWon", {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error);
            });
        }
        Axios.post("https://heario-13b5b094cc85.herokuapp.com/getRank", {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
                localStorage.setItem("rank", response.data.rank);
            }).catch((error) => {
                console.log(error);
        });
        socket.emit("leaveRoom", { roomId: id });
        dispatch(resetState());
        dispatch(resetStats())
    }

    function restartGame() {    
        if (username === winner) {
            // Include the token in the Authorization header for the /incrementGamesWon request
            Axios.post("https://heario-13b5b094cc85.herokuapp.com/incrementGamesWon", {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error);
            });
        }
    
        // Include the token in the Authorization header for the /getRank request
        Axios.post("https://heario-13b5b094cc85.herokuapp.com/getRank", {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            localStorage.setItem("rank", response.data.rank);
        }).catch((error) => {
            console.log(error);
        });
    
        socket.emit("resetGame", { roomId: id });
        dispatch(resetGame());
        dispatch(resetStats());
    }
    
    function isPiano(){
        if (roundSettings.piano === 0){
            return false;
        } else {
            return true;
        }
    }

    

    return (
        <div>
                <div>
                    {!isGameOver && (
                        <div>
                        {!isPianoReady && (
                            <p>loading piano...</p>
                        )}
                        {isPianoReady && (
                        <div>
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
                                        <div>
                                        {isPiano() && (
                                            <Suspense fallback={<div>Loading...</div>}>
                                            {/* Use LazyReactPiano instead of ReactPiano */}
                                            <LazyReactPiano />
                                            </Suspense>
                                        )}
                                        </div>
                                        <div>
                                            <TonesAnswerButton />
                                        </div>
                                    </div>           
                                    )}
                                </Grid>
                            </Grid>
                            <div>
                                {roundOver && (
                                    <div>
                                        <div>
                                            <Leaderboard />
                                            <Leaderboard2 />
                                        </div>
                                        <div>
                                            <p>The correct answer was {correctAnswer}</p>
                                        </div>
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
                                        color="error"
                                        onClick={() => handleLeave()}
                                    >
                                        Leave Lobby
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="info"
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
                                        color="info"
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
        </div>
    );
}
