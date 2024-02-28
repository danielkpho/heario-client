import React, { useState } from "react";

import Axios from "axios";

import { TextField, Button, Grid, Snackbar, Alert, IconButton, InputAdornment, Input } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router-dom";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Register(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility

    const [SnackbarOpen, setSnackbarOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const navigate = useNavigate();

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
      };

    const register = () => {
        if(!username || !password){
            setAlertMessage("Please enter a username and password");
            setSnackbarOpen(true);
            return;
        }
        Axios.post("https://heario-13b5b094cc85.herokuapp.com/register", {
            username: username,
            password: password,
        }).then((response) => {
            if (response.data.message === "User already exists!"){
                setAlertMessage("User already exists");
                setSnackbarOpen(true);
            } else {
                localStorage.setItem("username", response.data.username);
                localStorage.setItem("rank", response.data.rank);
                localStorage.setItem("token", response.data.token);
                navigate("/profile")
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    const login = () => {
        if(!username || !password){
            setAlertMessage("Please enter a username and password");
            setSnackbarOpen(true);
            return;
        }
        Axios.post("https://heario-13b5b094cc85.herokuapp.com/login", {
            username: username,
            password: password,
        }).then((response) => {
            console.log(response);
            if (response.data.message){
                setAlertMessage(response.data.message);
                setSnackbarOpen(true);
            } else {
                localStorage.setItem("username", response.data.username);
                localStorage.setItem("rank", response.data.rank);
                localStorage.setItem("token", response.data.token);
                navigate("/heario-client/")
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return(

            <div>
                <Grid 
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                padding= {2}
                spacing={2}
                >
                    <Grid item xs={12}>
                        <TextField
                        id="outlined-basic"
                        label="Username"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => {setUsername(e.target.value)}}
                        InputProps={{endAdornment: <InputAdornment position="end"><AccountCircleIcon/></InputAdornment>}}
                        />
                    </Grid>
                    <Grid item>
                            <TextField
                                id="outlined-basic"
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                variant="outlined"
                                fullWidth // Ensures the TextField takes up the full width of its container
                                onChange={(e) => { setPassword(e.target.value) }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />                    
                    </Grid>
                    <Grid item
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                        padding={2}
                    >
                        <Grid item>
                            <Button variant="contained" onClick={register}>Register</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={login}>Login</Button>
                        </Grid>
                        <Snackbar open= {SnackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                            <Alert severity="error" onClose={handleSnackbarClose}>
                                {alertMessage}
                            </Alert>
                        </Snackbar>
                    </Grid>
                </Grid>
            </div>
        
        
    )
}