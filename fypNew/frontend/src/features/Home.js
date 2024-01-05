import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { socket } from "../api/socket";
import { nanoid } from "nanoid";

import { setId } from "../features/gameSlice";

import { Button, Grid, FormControl, InputLabel, Input } from "@mui/material";

export default function Home(){
    const [roomId, setRoomId] = useState('');
    const [rooms, setRooms] = useState([]);
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    useEffect(() => {
        socket.emit("getRooms");
    }, []);

    socket.on("rooms", (rooms) => {
        setRooms(rooms);
    });

    function createGame(){
        const roomId = nanoid(4);
            if (name) {
            socket.emit("createRoom", { id: roomId, roundSettings: {rounds: 3, time: 10, sharps: false, notes: true, intervals: false, scales: false, chords: false}, name })
            navigate("/lobby/" + roomId);
            dispatch(setId(roomId));
        }
    };

    const isRoomJoinable = (roomId) => {
        const targetRoom = rooms.find((room) => room.id === roomId);
        return targetRoom && !targetRoom.started;
    };

    function joinGame(){
        if (isRoomJoinable(roomId) && name) {
                socket.emit("joinRoom", { id: roomId, name });
                navigate("/lobby/" + roomId);
                dispatch(setId(roomId));
        }
        else{
            alert("Room is not joinable or has already started");
        }
    }

    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            marginTop={5}
        >
            <Grid item xs={8} justifyContent={"center"}>
                <FormControl>
                    <InputLabel style={{ color: 'white' }}>Enter Your Name</InputLabel>
                        <Input  
                            color="primary"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            inputProps={{ style: { color: 'white' }, maxLength: 15}}
                            
                            helperText={!name ? "Please enter your name" : ""}
                        />
                </FormControl>
            </Grid>
            <Grid item xs={8}>
                <br></br>
                <FormControl>
                    <InputLabel style={{ color: 'white' }}>Enter Room ID</InputLabel>
                        <Input  
                            color="primary"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            inputProps={{ style: { color: 'white' }, maxLength: 4}}
                        />
                </FormControl>
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
                        <Button type="submit" variant="contained" color="green" onClick={createGame}>
                            Create Game
                        </Button>
                    </Grid>
                    <Grid item xs={8}>
                        <br></br>
                        <Button variant="contained" color="primary" onClick={joinGame}>
                            Join Game
                        </Button>
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    marginTop={2}
                    style={{ background: "white"}}
                    width={300}
                    padding={2}
                    marginTop={4}
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
                </Grid>
        </Grid>
    );
}