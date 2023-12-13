import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";
import { allAnswers, correctAns } from "./questionsSlice";
import { socket } from "../api/socket";

function TonesAnswerButton(){
    const { id } = useParams();
    const [clickedButtons, setClickedButtons] = useState([]);
    const [attempts, setAttempts] = useState(0);
    const [score, setScore] = useState(0);
    const dispatch = useDispatch();

    const handleButtonClick = (note) => {
        setClickedButtons((prevClickedButtons) => [...prevClickedButtons, note]);
        handleGameAnswer(note);
    };
    const answers = useSelector(allAnswers);
    const correctAnswer = useSelector(correctAns);
    const answerButtons = answers.map((r, index) => (
        <Grid key = {index} item xs = {"auto"}>
            <Button
                color = "inherit"
                className = "answer-button"
                style = {{ textTransform: "none" }}
                disabled = {clickedButtons.includes(r)}
                onClick = {() => handleButtonClick(r)}
            >
                {r}
            </Button>
        </Grid>
    ));

    function handleGameAnswer(note){
        console.log("handleGameAnswer")
        if (note === correctAnswer){
            setScore(answers.length - attempts);
            console.log("Correct! Score: " + (answers.length - attempts));
            socket.emit("setScore", {
                roomId: id,
                userId: socket.id,
                score: answers.length - attempts,
            });
            console.log(id, socket.id, answers.length - attempts);
            } else {
            setAttempts(attempts + 1);
            console.log("Incorrect. Attempts: " + (attempts + 1));
        }
    }
    

    return (
        <Grid
            container
            spacing = {8}
            direction = "row"
            alignItems = "center"
        >
            {answerButtons}
        </Grid>
    );
    }

    TonesAnswerButton.propTypes = {
        // answers: PropTypes.array.isRequired,
        // handleGameAnswer: PropTypes.func.isRequired,
    };

export { TonesAnswerButton };