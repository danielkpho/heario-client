import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { socket } from "../api/socket";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { gameId, addPlayer, setId } from "../features/gameSlice";
import { useSelector, useDispatch } from "react-redux";

import { spacing } from '@mui/system';
import { Button, Grid, TextField, Container, FormControl, InputLabel, Input } from "@mui/material";



export default function Home(){
    const [roomId, setRoomId] = useState('');
    const [rooms, setRooms] = useState([]);
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const players = useSelector(state => state.game.players);
    const id = useSelector(gameId);
    const isStarted = useSelector(state => state.game.isStarted);
    

    useEffect(() => {
        socket.emit("getRooms");
    }, []);

    socket.on("rooms", (rooms) => {
        setRooms(rooms);
    });

    function createGame(){
        const roomId = nanoid(4);
            if (name) {
            socket.emit("createRoom", { id: roomId, roundSettings: {rounds: 3, time: 10, sharps: false}, name })
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
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            marginTop={10}
        >
            <Grid item xs={8} justifyContent={"center"}>
                <FormControl>
                    <InputLabel style={{ color: 'white' }}>Enter Your Name</InputLabel>
                        <Input  
                            color="primary"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            inputProps={{ style: { color: 'white' }, maxLength: 10}} 
                        />
                </FormControl>
            </Grid>
            <Grid item xs={8} justifyContent={"center"}>
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
                    
                    <Grid item xs={8} justifyContent={"center"}>
                        <Button type="submit" variant="contained" color="secondary" onClick={createGame}>
                            Create Game
                        </Button>
                    </Grid>
                    <Grid item xs={8} justifyContent={"center"}>
                        <br></br>
                        <Button variant="contained" color="primary" onClick={joinGame}>
                            Join Game
                        </Button>
                    </Grid>
                </Grid>
        </Grid>
    );
}