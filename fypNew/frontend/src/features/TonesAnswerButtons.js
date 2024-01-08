import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";

import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { allAnswers, correctAns } from "./questionsSlice";
import { incrementTries } from "./statSlice";
import { socket } from "../api/socket";

function TonesAnswerButton(){
    const id = useSelector(state => state.game.id);
    const [clickedButtons, setClickedButtons] = useState([]);
    const [attempts, setAttempts] = useState(0);
    const dispatch = useDispatch();

    const handleButtonClick = (note) => {
        setClickedButtons((prevClickedButtons) => [...prevClickedButtons, note]);
        handleGameAnswer(note);
    };
    const answers = useSelector(allAnswers);
    const correctAnswer = useSelector(correctAns);

    const answerButtons = answers.map((r, index) => (
        <Grid key = {index} item xs = {"6"}>
            <Button
                variant="contained" 
                color = "inherit"
                className = "answer-button"
                style={{
                    textTransform: "none",
                    backgroundColor: clickedButtons.includes(r)
                      ? r === correctAnswer
                        ? "green" // Set the background color to green if it's the correct answer
                        : "primary.dark"   // Set a different color for incorrect answers, adjust as needed
                      : "white", // Default background color for unclicked buttons
                  }}
                disabled = {clickedButtons.includes(r)}
                onClick = {() => handleButtonClick(r)}
                fullWidth
                size = "large"
            >
                {r}
            </Button>
        </Grid>
    ));

    function handleGameAnswer(note){
        dispatch(incrementTries(correctAnswer));
        if (note === correctAnswer){
            socket.emit("setScore", {
                roomId: id,
                userId: socket.id,
                score: answers.length - attempts,
            });
            setClickedButtons(answers);

            } else {
            setAttempts(attempts + 1);

        }
    }

    function reset(){
        setClickedButtons([]);
        setAttempts(0);
    }

    useEffect(() => {
        socket.on("nextRound", () => {
            reset();
        });
    });
    

    return (

        <div>
            <Grid
            container
            spacing = {2}
            direction = "row"
            alignItems = "center"
            >
            {answerButtons}
            </Grid>
        </div>

    );
    }


export { TonesAnswerButton };