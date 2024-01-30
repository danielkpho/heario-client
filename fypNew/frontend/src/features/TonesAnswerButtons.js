import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";

import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { allAnswers, correctAns } from "./questionsSlice";
import { incrementTries } from "./statSlice";
import { socket } from "../api/socket";
import Axios from "axios";
import { allQuestions, allTries, allAccuracy } from "../features/statSlice";

function TonesAnswerButton(){
    const id = useSelector(state => state.game.id);
    const [clickedButtons, setClickedButtons] = useState([]);
    const [attempts, setAttempts] = useState(0);
    const dispatch = useDispatch();
    const username = localStorage.getItem("username");

    const handleButtonClick = (note) => {
        setClickedButtons((prevClickedButtons) => [...prevClickedButtons, note]);
        handleGameAnswer(note);
    };
    const answers = useSelector(allAnswers);
    const correctAnswer = useSelector(correctAns);
    const questionType = useSelector(state => state.questions.questionType);

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

    const questions = useSelector(allQuestions);
    const tries = useSelector(allTries);
    const accuracy = useSelector(allAccuracy);

    const data = questions.map((question, index) => {
        return {
            question,
            tries: tries[index],
            accuracy: accuracy[index],
        }
    });

    useEffect(() => {
        socket.emit("data", {
            roomId: id,
            userId: socket.id,
            data: data,
        })
    }, [data]);


    function handleGameAnswer(note){
        dispatch(incrementTries(correctAnswer));
        
        if (note === correctAnswer){
            socket.emit("setScore", {
                roomId: id,
                userId: socket.id,
                score: answers.length - attempts,
            });
            setClickedButtons(answers);
            if (username){
                updateAttempts(1);
            }
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

    function updateAttempts(correct){
        Axios.post("http://localhost:8000/updateAttempts", {
            username: username,
            questionType: questionType,
            question: correctAnswer,
            correctAttempts: correct,
            totalAttempts: attempts + 1,
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        }
        );
    }
    

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