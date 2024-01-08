import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../api/socket";
import { nanoid } from "nanoid";

import { setHostId, setId, setJoinedLobby } from "../features/gameSlice";

import { Button, Grid, FormControl, InputLabel, Input, Alert, Snackbar } from "@mui/material";

import Lobby from "./Lobby";

export default function Home(){
    const [roomId, setRoomId] = useState('');
    const [rooms, setRooms] = useState([]);
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [SnackbarOpen, setSnackbarOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const joinedLobby = useSelector(state => state.game.joinedLobby);
    
    
    useEffect(() => {
        socket.emit("getRooms");
    }, []);

    socket.on("rooms", (rooms) => {
        setRooms(rooms);
    });

    

    function createGame(){
        const roomId = nanoid(4);
            if (name) {
                socket.emit("createRoom", { id: roomId, roundSettings: {rounds: 3, time: 10, notes: true, sharps: false, intervals: false, scales: false, chords: false}, name })
                // navigate("/lobby/" + roomId);
                dispatch(setId(roomId));
                dispatch(setHostId(socket.id));
                dispatch(setJoinedLobby(true));
            } 
            else {
                setAlertMessage("Please enter a name");
                setSnackbarOpen(true);
            }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
      };

    const isRoomJoinable = (roomId) => {
        const targetRoom = rooms.find((room) => room.id === roomId);
        return targetRoom && !targetRoom.started;
    };

    const doesRoomExist = (roomId) => {
        return rooms.some((room) => room.id === roomId);
    };

    const hasRoomStarted = (roomId) => {
        const targetRoom = rooms.find((room) => room.id === roomId);
        return targetRoom && targetRoom.started;
    };

    function joinGame(){
        if (isRoomJoinable(roomId) && name) {
                socket.emit("joinRoom", { id: roomId, name });
                dispatch(setId(roomId));
                dispatch(setJoinedLobby(true));
        }
        if (!name) {
            setAlertMessage("Please enter a name");
            setSnackbarOpen(true);
        }
        if (!doesRoomExist(roomId)) {
            setAlertMessage("Enter a valid room Id");
            setSnackbarOpen(true);
        }
        if (hasRoomStarted(roomId)) {
            setAlertMessage("Room has already started");
            setSnackbarOpen(true);
        }
    }

    function register(){
        navigate("/register");
    }

    return (
        (!joinedLobby) ? (
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            marginTop={5}
        >

            <Grid item xs={8} justifyContent={"center"}>
                <FormControl>
                    <InputLabel style={{ color: 'grey' }}>Enter Your Name</InputLabel>
                        <Input  
                            color="primary"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            inputProps={{ style: { color: 'grey' }, maxLength: 15}}
                        />
                </FormControl>
            </Grid>
            <Grid item xs={8}>
                
            </Grid>
                <Grid
                    container
                    spacing={2}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    marginTop={2}
                >
                    <Grid item xs={8}>
                        <Button type="submit" variant="contained" color="primary" onClick={createGame} style={{ width: 200 }}>
                            Create Game
                        </Button>
                    </Grid>
                    <br></br>
                    <Grid item xs={8}>
                        <FormControl>
                            <InputLabel style={{ color: 'grey' }}>Enter Room ID</InputLabel>
                                <Input  
                                    color="primary"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    inputProps={{ style: { color: 'grey' }, maxLength: 4}}
                                />
                        </FormControl>
                    </Grid>
                    <Grid item xs={8}>
                        <br></br>
                        <Button variant="contained" color="green" onClick={joinGame} style={{ width: 200 }}>
                            Join using code
                        </Button>
                    </Grid>
                    <Grid item xs={8}>
                        <br></br>
                        <Button variant="contained" color="primary" onClick={register}>
                            Register
                        </Button>
                    </Grid>
                </Grid>
                <Snackbar open={SnackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert severity="error" onClose={handleSnackbarClose}>
                    {alertMessage}
                    </Alert>
                </Snackbar>
                {/* <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    marginTop={4}
                    style={{ background: "white"}}
                    width={300}
                    padding={2}
                >
                    <Grid item xs={8}>
                        About
                    </Grid>
                    <Grid item xs={8} style={{ textAlign: "justify" }}>
                    Hear.io is a free online multiplayer ear training game.

                    A normal game consists of a few rounds, where every player has to pick the correct note, chord or interval being played to gain points

                    The person with the most points at the end of the game, will then be crowned the winner!
                    Have fun!
                    </Grid>
                </Grid> */}
        </Grid>
        ) : (
            <Lobby />
        )
    );
}