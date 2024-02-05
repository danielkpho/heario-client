import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { socket } from "../api/socket";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


export default function Leaderboard2(){
    const id = useSelector(state => state.game.id);
    const [data, setData] = useState([]);

    useEffect(() => {
        socket.emit("getData", {roomId: id});      
            socket.on("data", newData => { 
                console.log(newData);
                setData(newData);
            })
        return () => {
            socket.off("data");
        }
    }
    , []);



    return (
        <TableContainer componenet={Paper}>
            <Table sx={{ minWidth: 650 }} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align='center'>Question</TableCell>
                        <TableCell align='center'>Username</TableCell>
                        <TableCell align='center'>Tries</TableCell>
                        <TableCell align='center'>Accuracy</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {Array.isArray(data.data) && data.data.map((player, index) => (
          player.playerdata.map((playerData, dataIndex) => (
            <TableRow key={`${index}-${dataIndex}`}>
              <TableCell align='center'>{playerData.question}</TableCell>
              <TableCell align='center'>{player.name}</TableCell>
              <TableCell align='center'>{playerData.tries}</TableCell>
              <TableCell align='center'>{playerData.accuracy}</TableCell>
            </TableRow>
          ))
        ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}