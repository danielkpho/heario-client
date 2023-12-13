import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { gameId, allPlayers } from "../features/gameSlice";
import { setAnswers, allAnswers } from "../features/questionsSlice";
import { socket } from "../api/socket";
import Option from "./Option";
import { Container } from "react-bootstrap";
import "./answers.css";

import Grid from '@mui/material/Grid';
import { TonesAnswerButton } from "./TonesAnswerButtons";



export default function Player(){
    const { id } = useParams();
    const dispatch = useDispatch();
    const answers = useSelector(allAnswers);
    const [selectedAns, setSelectedAns] = useState(null);
    const [finalAnswer, setFinalAnswer] = useState(false);

    useEffect(() => {
        socket.on("answers", (answers) => { // listen for the answers from the server
            dispatch(setAnswers(answers));
            console.log(answers);
        });
        return () => {
            socket.off("answers");
        };
    }, [dispatch]);


    function submitAnswer(){
        setFinalAnswer(true);
        socket.emit("submitAnswer", {
            roomId: id,
            userId: socket.id,
            ans: answers[selectedAns],
        });
    }

    
    return(
    <div>
        <h1>Player</h1>
        <div>
            {/* <Container className="answers-container">
            {answers.length > 0 &&
                answers.map((answer, idx) => (
                <Option
                    key={idx}
                    active={selectedAns === idx}
                    disabled={finalAnswer && selectedAns !== idx}
                    onClick={() => setSelectedAns(idx)}
                >
                    {answer}
                </Option>
                ))}
            {answers.length > 0 && !finalAnswer && (
                <button className="action-button" onClick={() => submitAnswer()}>
                    Final Answer
                </button>
            )}
            </Container> */}
            <Grid item xs = {"auto"}>
                <TonesAnswerButton />
            </Grid>
        </div>
    </div>
    )
}