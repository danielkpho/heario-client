import React , {useState, useEffect} from "react";
import { Form, useNavigate } from "react-router-dom";
// import { Form, Button } from "react-bootstrap";
import { socket } from "../api/socket";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setHostId, setIsStarted, updateRoundSettings, setIsRoundOver, setStatus, selectTimer } from "./gameSlice";
import { FormControlLabel, FormGroup, Checkbox, Grid, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';



export default function Settings(){
    const [roundSettings, setRoundSettings] = useState({
        rounds: 3, 
        time: 10,
        sharps: false,
    }); 
    const hostId = useSelector(state => state.game.hostId);
    const dispatch = useDispatch();
    const roomId = useParams();
    const navigate = useNavigate();
    const isStarted = useSelector(state => state.game.isStarted);
    const duration = useSelector(selectTimer);
    
    const [selectedOptions, setSelectedOptions] = useState({
        notes: true,
        intervals: false,
        scales: false,
        chords: false,
    });

    const handleCheckboxChange = (event) => {
        setSelectedOptions({ ...selectedOptions, [event.target.name]: event.target.checked });
    };


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
        const { name, value } = event.target;
        // const updatedValue = parseInt(value);
      
        if (socket.id === hostId) {
          setRoundSettings((prevRoundSettings) => {
            const updatedSettings = {
              ...prevRoundSettings,
              [name]: value,
            };
      
            socket.emit("updateSettings", { id: roomId.id, roundSettings: updatedSettings });
            console.log(roomId.id, updatedSettings);
      
            return updatedSettings;
          });
        }
      };
    
    function handleLeave(){
        if (socket.id === hostId){
            socket.emit("deleteLobby", { roomId: roomId.id });
        }
        socket.emit("leaveRoom", { roomId: roomId.id });
        navigate("/");
        dispatch(setStatus("idle"));
    }

    function handleSubmit(event){
        event.preventDefault();
        socket.emit("startGame", { roomId: roomId.id, roundSettings });
        socket.emit("startTimer", { roomId: roomId.id, duration })
        dispatch(setIsStarted(true));
        dispatch(setIsRoundOver(false));
        dispatch(setStatus("playing"));
    }

    return (
        <div>
            <p>Only the host can change settings</p>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} alignItems="center" justifyContent={"space-between"}>
                    <Grid xs={6} item justifyContent={"center"}>
                        Rounds:
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth> 
                            <InputLabel>Rounds</InputLabel>
                                <Select
                                    label="Rounds"
                                    name="rounds"
                                    value={roundSettings.rounds}
                                    onChange={handleChange}
                                    variant="outlined"
                                >
                                <MenuItem value={3}>3 Rounds</MenuItem>
                                <MenuItem value={5} >5 Rounds</MenuItem>
                                <MenuItem value={8} >8 Rounds</MenuItem>
                                <MenuItem value={10} >10 Rounds</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid xs={6} item justifyContent={"center"}>
                        Time:
                    </Grid>
                    <Grid item xs={6}>
                    <FormControl fullWidth>
                    <InputLabel>Time</InputLabel>
                        <Select
                            label="Time"
                            name="time"
                            value={roundSettings.time}
                            onChange={handleChange}
                            variant="outlined"
                        >
                            <MenuItem value={10} >10 Seconds</MenuItem>
                            <MenuItem value={15} >15 Seconds</MenuItem>
                            <MenuItem value={20} >20 Seconds</MenuItem>
                            <MenuItem value={30} >30 Seconds</MenuItem>
                        </Select>
                    </FormControl>
                    </Grid>
                    <Grid xs={6} item justifyContent={"flex-start"}>
                        Sharps: 
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Sharps</InputLabel>
                                <Select
                                    label="Sharps"
                                    name="sharps"
                                    value={roundSettings.sharps}
                                    onChange={handleChange}
                                    variant="outlined"
                                >
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false} >No</MenuItem>
                                </Select>
                        </FormControl>
                    </Grid>
                    <Grid
                        container
                        justifyContent={"center"}
                        alignItems={"center"}
                        padding={2}
                    >
                        <Grid fullWidth justifyContent={"center"} padding={2}>
                            <Grid item xs={12}>
                                Type
                            </Grid>
                        </Grid>
                        <Grid container direction={"row"} justifyContent={"space-around"}>
                            <FormGroup>
                                <Grid item>
                                    <FormControlLabel control={<Checkbox defaultChecked color="cream"  />} label="Notes" />
                                </Grid>
                                <Grid item>
                                    <FormControlLabel control={<Checkbox color="cream" />} label="Intervals" />
                                </Grid>
                                <Grid item>
                                    <FormControlLabel control={<Checkbox color="cream" />} label="Scales" />
                                </Grid>
                                <Grid item>
                                    <FormControlLabel control={<Checkbox color="cream" />} label="Chords" />
                                </Grid>
                            </FormGroup>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="secondary" type="button" onClick={handleLeave} fullWidth >
                            Leave Lobby
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="green" type="submit" fullWidth>
                            Start Game
                        </Button>
                    </Grid>
                </Grid>
    </form>
        </div>
    );
}