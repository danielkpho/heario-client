import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { socket } from '../../api/socket';
import { fetchGameId, gameId, addPlayer } from "./gameSlice";
import Settings from './Settings';

export default function CreateGame(){
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

    return(
        <div>
            <h1>Game ID: {id}</h1>
            <h2>Players: ({ players.length }) </h2>
            <ul>
            {players.map(({ id, name }) => (
                <li key={id}>{name}</li>
            ))}   
            </ul>
            <h1>Game Settings</h1>
            <Settings />
        </div>
    )
}