import React , { useState, useEffect}  from "react";
import { useParams } from "react-router-dom";
import { socket } from "../api/socket";
import Settings from "./Settings";
import { useSelector, useDispatch } from "react-redux";
import { allPlayers, isStarted, setIsStarted } from "../features/gameSlice";
import { instrument as soundfontInstrument } from "soundfont-player";

import Game from "./Game";
import Player from "./Player";


export default function Lobby(){
    const { id } = useParams();
    const dispatch = useDispatch();
    const players = useSelector(state => state.game.players);
    const isStarted = useSelector(state => state.game.isStarted);

    useEffect(() => {
        socket.on("allPlayers", (players) => {
            dispatch(allPlayers(players));
        });
        return () => {
            socket.off("allPlayers");
        };
    }, [dispatch]);


    useEffect(() => {
        socket.on("gameEnded", () => {
            dispatch(setIsStarted(false));
            console.log("gameEnded")
        });
        return () => {
            socket.off("gameEnded");
        };
    });

    return (
        <div>
            {!isStarted && (
            <div>
                <h1>Lobby with ID: {id}</h1>
                <h2>Players: </h2>
                <ul>
                    {Object.values(players).map((player) => (
                    <li key={player.id}>
                        ID: {player.id}, Name: {player.name}, Score: {player.score}
                    </li>
                    ))}
                </ul>
                <h1>Game Settings</h1>
                <Settings />
            </ div>
            )}
            {isStarted && (
            <div>
                <div>
                <Game />
                </div>
            </div>
            )}
        </div>
    );
}