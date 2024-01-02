import React , { useState, useEffect}  from "react";
import { useParams } from "react-router-dom";
import { socket } from "../api/socket";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { allPlayers, isStarted, setIsStarted, scores, setPlayerScore } from "../features/gameSlice";
import { Grid, Paper, Typography } from '@mui/material';

export default function Leaderboard(){
    const { id } = useParams();
    const dispatch = useDispatch();
    const players = useSelector(state => state.game.players);
    const playersArray = Object.values(players);
    const sortedPlayers = playersArray.sort((a, b) => b.score - a.score);
    const top3Players = sortedPlayers.slice(0, 3);

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