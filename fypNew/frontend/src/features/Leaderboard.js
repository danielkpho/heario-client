import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { Grid, Paper, Typography } from '@mui/material';
import Axios from "axios";

export default function Leaderboard(){
    const players = useSelector(state => state.game.players);
    const playersArray = Object.values(players);
    const sortedPlayers = playersArray.sort((a, b) => b.score - a.score);
    const top3Players = sortedPlayers.slice(0, 3);

    const firstPlace = top3Players[0];
    const username = localStorage.getItem("username");

    useEffect(() => {
        if (username === firstPlace.name) {
            Axios.post("http://localhost:8000/incrementGamesWon", {
                username: username,
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    });
    

    return(
        <Grid container spacing={2} alignItems="flex-end" justifyContent="center">
            {top3Players.map((player, index) => ( 
                <Grid key={index} item xs={4} style={{ order: index === 0 ? 1 : index === 1 ? 0 : 2 }} >
                <Paper elevation={3} style={{ padding: '20px', textAlign: 'center', height: `${5 - index}0vh` }}>
                    <Typography variant="h6">#{index + 1}</Typography>
                    <Typography variant="h5">{player.name}</Typography>
                    <Typography variant="subtitle1">Score: {player.score}</Typography>
                </Paper>
                </Grid>
            ))}
        </Grid>
    )
}