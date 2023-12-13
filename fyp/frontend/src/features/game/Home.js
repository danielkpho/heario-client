import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { socket } from '../../api/socket';
import { fetchGameId, gameId, addPlayer } from "./gameSlice";
import Settings from './Settings';
import CreateGame from './CreateGame';
import Answer from '../questions/Answers';
import { Form } from 'react-bootstrap';

export default function Home(){
    const [name, setName] = useState("");
    const [joinedRoom, setJoinedRoom] = useState(false);
    const dispatch = useDispatch();

    const idStatus = useSelector(state => state.game.status);
    const id = useSelector(gameId);
    const players = useSelector(state => state.game.players);

    useEffect(() => {
        if(idStatus === 'idle' && socket.connected){
            dispatch(fetchGameId(socket.id.slice(-12)));
        }
    }, [idStatus, dispatch, socket.connected]);

    useEffect(() => {  
        if (id) {
            socket.emit("createRoom", { id, roundSettings:[] });
        } else {
            socket.connect();
        }
    }, [id]);

    useEffect(() => {
        socket.on("newPlayer", data => {
            dispatch(addPlayer(data));
        });
    }, []);

    function createGame(){
        window.location.href = "/";
    }
    
    function joinRoom(){
        socket.emit("joinRoom", { id, name })
        setJoinedRoom(true);
        window.location.href = `/game/question/${id}`;
    }

    return(
        <div>
            <button onClick={createGame}>Create Game</button>
            <input type="text" placeholder="Enter your name" onChange={e => setName(e.target.value)} />
            <input type="text" placeholder="Enter Game ID" onChange={e => setJoinedRoom(e.target.value)} />
            <button onClick={joinRoom}>Join Game</button>
        </div>
    )
}