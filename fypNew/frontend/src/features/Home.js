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
    console.log(rooms);
    
    const username = localStorage.getItem("username");

    useEffect(() => {
        console.log("username mounted");
        if (username) {
            setName(username);
        }
    }
    , [username]);
    
    useEffect(() => {
        console.log("getrooms mounted");
        socket.emit("getRooms");
    }, []);

    useEffect(() => {
        console.log("rooms mounted");
        socket.on("rooms", (rooms) => {
          setRooms(rooms);
        });
      
        return () => {
          // Cleanup logic if needed
          socket.off("rooms");
        };
      }, []);

    

    function createGame(){
        const roomId = nanoid(4);
            if (name) {
                socket.emit("createRoom", { id: roomId, roundSettings: {rounds: 3, time: 10, notes: true, sharps: false, intervals: false, scales: false, chords: false}, name })
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
        return targetRoom && !targetRoom.started && targetRoom.players.length < 4;
    };
    
    const isRoomFull = (roomId) => {
        const targetRoom = rooms.find((room) => room.id === roomId);
        return targetRoom && targetRoom.players.length >= 4;
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
        if (isRoomFull(roomId)) {
            setAlertMessage("Room is full");
            setSnackbarOpen(true);
        }
    }

    function joinRandomGame(){
        const availableRooms = rooms.filter((room) => !room.started && room.players.length < 4);
        if (!name) {
            setAlertMessage("Please enter a name");
            setSnackbarOpen(true);
        }
        if (availableRooms.length === 0) {
            setAlertMessage("No available rooms");
            setSnackbarOpen(true);
            return;
        }
        const randomRoomId = availableRooms[Math.floor(Math.random() * availableRooms.length)].id;
        if(name){
            socket.emit("joinRoom", { id: randomRoomId, name });
            dispatch(setId(randomRoomId));
            dispatch(setJoinedLobby(true));
        }
    }

    function register(){
        if (username) {
            setAlertMessage("You are already logged in");
            setSnackbarOpen(true);
        } else {
        navigate("/register");
        }
    }

    function profile(){
        if (username) {
            navigate("/profile");
        } else {
            navigate("/register");
        }
    }

    function piano(){
        navigate("/piano");
    }

    console.log("Home rendered")
    
    return (
        (!joinedLobby) ? (
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            marginTop={5}
            padding={2}
            spacing={2}
        >
            <Grid item justifyContent={"center"}>
                <FormControl>
                    <InputLabel style={{ color: 'grey' }}>Enter Your Name</InputLabel>
                        <Input  
                            color="primary"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={username}
                            inputProps={{ maxLength: 15}}
                        />
                </FormControl>
            </Grid>
                    <Grid item>
                        <Button type="submit" variant="contained" color="primary" onClick={createGame} style={{ width: 200 }}>
                            Create Game
                        </Button>
                    </Grid>
                    <Grid item>
                        <FormControl>
                            <InputLabel style={{ color: 'grey' }}>Enter Room ID</InputLabel>
                                <Input  
                                    color="primary"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    inputProps={{ maxLength: 4 }}
                                />
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="success" onClick={joinGame} style={{ width: 200 }}>
                            Join using code
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="success" onClick={joinRandomGame} style={{ width: 200 }}>
                            Join Random Game
                        </Button>
                    </Grid>
                    <Grid item>
                        <Grid 
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={2}
                        >
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={register}>
                                    Register/Login
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={profile}>
                                    Profile
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="success" onClick={piano} style={{ width: 200 }}>
                            Practice Piano
                        </Button>
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