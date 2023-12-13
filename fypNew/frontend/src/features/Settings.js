import React , {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { socket } from "../api/socket";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setHostId, setIsStarted, updateRoundSettings, setId } from "./gameSlice";

export default function Settings(){
    const [roundSettings, setRoundSettings] = useState({
        rounds: 3, 
        time: 10
    }); 
    const hostId = useSelector(state => state.game.hostId);
    const dispatch = useDispatch();
    const roomId = useParams();
    const navigate = useNavigate();
    const isStarted = useSelector(state => state.game.isStarted);

    const allowedRounds = [3, 5, 7, 10];
    const allowedTime = [10, 15, 20, 30];

    useEffect(() => {
        socket.emit("getHostId", { roomId: roomId.id });
        // Listen for the hostId from the server
        socket.on("hostId", (hostId) => {
            dispatch(setHostId(hostId));
        });

        socket.emit("getSettings", { roomId: roomId.id }); // init the settings from the server
        socket.on("settings", (settings) => {
            setRoundSettings(settings);
            dispatch(updateRoundSettings(settings));
        });

        // Listen for the updated settings from the server
        socket.on("updatedSettings", (updatedSettings) => {
            setRoundSettings(updatedSettings);
            dispatch(updateRoundSettings(updatedSettings));
        });
        
        return () => {
            // Clean up the socket event listener when the component unmounts
            socket.off("hostId");
            socket.off("updatedSettings");
        };
    },[]); // play with this dependancy array TODO because it is rerendering too much

    
    const handleChange = (event) => {
        const{ id, value } = event.target;
        const updatedValue = parseInt(value);

        if (socket.id === hostId){
            setRoundSettings((prevRoundSettings) => ({
                ...prevRoundSettings,
                [id]: updatedValue,
            }));
            socket.emit("updateSettings", { id: roomId.id, roundSettings:{
                ...roundSettings,
                [id]: updatedValue,
            }});
            console.log(roomId.id,{
                ...roundSettings,
                [id]: updatedValue,
            });
        }
    };

    function handleSubmit(event){
        event.preventDefault();
        socket.emit("startGame", { roomId: roomId.id, roundSettings });
        dispatch(setIsStarted(true));
    }

    return (
        <div>
            <p>Only the host can change settings</p>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="rounds">
                    <Form.Label>Number of Rounds: </Form.Label>
                    <Form.Control
                        as="select"
                        name="rounds"
                        value={roundSettings.rounds}
                        onChange={handleChange}
                        >                 
                        {allowedRounds.map((round, index) => (
                            <option key={index} value={round}>
                            {round} Rounds
                            </option>
                        ))}
                    </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="time">
                        <Form.Label>Enter Time:</Form.Label>
                        <Form.Control
                            as="select"
                            name="time"
                            value={roundSettings.time}
                            onChange={handleChange}
                            >
                             {allowedTime.map((time, index) => (
                                <option key={index} value={time}>
                                {time} Seconds
                                </option>
                            ))}
                    </Form.Control>
                    </Form.Group>
                <Button variant="primary" type="submit">
                    Start Game
                </Button>
            </Form>
        </div>
    );
}