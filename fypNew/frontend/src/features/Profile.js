import React, { useState, useEffect } from "react";

import Axios from "axios";

import { TextField, Button, Grid, TableContainer, TableSortLabel, Table, TableBody, TableHead, TableCell, TableRow, Paper } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { setGamesPlayed } from "./playerSlice";

export default function Profile(){
    const username = localStorage.getItem("username");
    const navigate = useNavigate();

    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [gamesWon, setGamesWon] = useState(0);

    const [data, setData] = useState([
        { question_type: 'Type A', question: 'Question 1', correct_attempts: 5, total_attempts: 0.8 },
        // { question_type: 'Type B', question: 'Question 2', Attempts: 3, Total Attempts: 0.6 },
      ]);
    
    const [sortConfig, setSortConfig] = useState({key: null, direction: "ascending"})
    
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
          direction = 'descending';
        }
        setSortConfig({ key, direction });
        // Sort the data array based on the selected key and direction
        const sortedData = [...data].sort((a, b) => {
          if (direction === 'ascending') {
            return a[key] > b[key] ? 1 : -1;
          } else {
            return a[key] < b[key] ? 1 : -1;
          }
        });
        setData(sortedData);
      };

    useEffect(() => {
        Axios.post("http://localhost:8000/getGamesPlayed", {
            username: username,
        }).then((response) => {
            setGamesPlayed(response.data.gamesPlayed);
            setGamesWon(response.data.gamesWon)
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        Axios.post("http://localhost:8000/getAttempts", {
            username: username
        }).then((response) => {
            console.log(response.data.result);
            setData(response.data.result);
        }).catch((error) => {
            console.log(error);
        });
    }, []);
    
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/");
    };

    return (
        <Grid 
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            padding={5}
        >
            <Grid item
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
            >
                <Grid item>
                    <h2>Username: {username}</h2>
                </Grid>
                <Grid item>
                    <h2>Games played: {gamesPlayed}</h2>
                </Grid>
                <Grid item>
                    <h2>Games Won: {gamesWon} </h2>
                </Grid>
            </Grid>
            <Grid 
                container
                direction="column"
                justifyContent={"center"}
                alignItems={"center"}
                padding={2}
                spacing={2}
            >
                <Grid item>
                    <TableContainer sx= {{ maxWidth: 500 }} component={Paper}>
                        <Table sx= {{ minWidth: 500 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" onClick={() => requestSort('question_type')}>
                                    <TableSortLabel active={sortConfig.key === 'question_type'} direction={sortConfig.direction}>
                                        Question Type
                                    </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center" onClick={() => requestSort('question')}>
                                    <TableSortLabel active={sortConfig.key === 'question'} direction={sortConfig.direction}>
                                        Question
                                    </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center" onClick={() => requestSort('Correct Attempts')}>
                                    <TableSortLabel active={sortConfig.key === 'Correct Attempts'} direction={sortConfig.direction}>
                                        Correct Attempts
                                    </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center" onClick={() => requestSort('Total Attempts')}>
                                    <TableSortLabel active={sortConfig.key === 'Total Attempts'} direction={sortConfig.direction}>
                                        Total Attempts
                                    </TableSortLabel>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            {data.map((row, index) => (
                                <TableRow key={index}>
                                <TableCell align="center">{row.question_type}</TableCell>
                                <TableCell align="center">{row.question}</TableCell>
                                <TableCell align="center">{row.correct_attempts}</TableCell>
                                <TableCell align="center">{row.total_attempts}</TableCell>
                                </TableRow>
                            ))}
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item
                container
                direction="row"
                padding={2}
                spacing={2}
                justifyContent={"center"}
                alignItems={"center"}
                >
                    <Grid item>
                        <Button variant="contained" onClick={() => navigate("/")}>Back</Button>
                    </Grid>
                    <Grid item>
                        <Button color="secondary" variant="contained" onClick={logout}>Logout</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}