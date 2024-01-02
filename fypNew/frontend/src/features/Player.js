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
    
    return(
    <div>
        <div>
            <Grid item xs = {"auto"}>
                <TonesAnswerButton />
            </Grid>
        </div>
    </div>
    )
}