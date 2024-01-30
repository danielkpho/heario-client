import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTimer, setIsRoundOver } from './gameSlice';
import { socket } from '../api/socket';

export default function Timer(){
    const initialTime = useSelector(selectTimer);
    const [time, setTime] = useState(initialTime);
    const dispatch = useDispatch();
    const isRoundOver = useSelector(state => state.game.isRoundOver);
    const roomId = useSelector(state => state.game.id);
    const hostId = useSelector(state => state.game.hostId);

    useEffect(() => { // to fix initial time
        socket.on("timer-update", (time) => {
            setTime(time);
        });
        return () => {
            socket.off("timer-update");
        };
    });
        
    useEffect(() => {
        const handleTimerEnd = () => {
          setTime(5);
          dispatch(setIsRoundOver(true));
          if (socket.id === hostId) {
            socket.emit("round-over", roomId);
          }
        };
      
        socket.on("timer-end", handleTimerEnd);
      
        return () => {
          // Clean up the event listener when the component unmounts
          socket.off("timer-end", handleTimerEnd);
        };
      }, [socket, roomId, dispatch]);

    
    return(
        <div>
                {isRoundOver && (
                    <p>Next round in {time} seconds</p>
                )}
                {!isRoundOver && (
                    <p>Time left: {time}</p>
                )}
        </div>
    )   
}