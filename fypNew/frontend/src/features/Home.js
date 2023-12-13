import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { socket } from "../api/socket";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { gameId, addPlayer, setId } from "../features/gameSlice";
import { useSelector, useDispatch } from "react-redux";


export default function Home(){
    const [roomId, setRoomId] = useState('');
    const [rooms, setRooms] = useState([]);
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const players = useSelector(state => state.game.players);
    const id = useSelector(gameId);
    

    socket.on("allRoomsId", (rooms) => {
        // console.log(rooms);
        setRooms(rooms);
    });

    function createGame(){
        const roomId = nanoid(4);
            if (name) {
            socket.emit("createRoom", { id: roomId, roundSettings: {rounds: 3, time: 10}, name })
            navigate("/lobby/" + roomId);
            dispatch(setId(roomId));
        }
    }

    function joinGame(){
        if (name && roomId) {
            if (rooms.includes(roomId)){
                socket.emit("joinRoom", { id: roomId, name }) 
                navigate("/lobby/" + roomId);
            } else {
                alert("Room does not exist");
            }
        }
    }



    return (
        <div>
            <h1>Home</h1>
            <label>
                Enter Name: 
                <input type="text" value= {name} onChange={(e) => setName(e.target.value)} />
            </label>
            <button onClick={createGame}>Create Game</button>
            <br></br>
            <label>
                Enter Room ID:
                <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
            </label>
            <button onClick={joinGame}>Join Game</button>
        </div>
    );
}