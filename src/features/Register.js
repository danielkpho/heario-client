import React, { useState } from "react";

import Axios from "axios";

import { TextField, Button, Grid, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Register(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [SnackbarOpen, setSnackbarOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const navigate = useNavigate();
    const storedUsername = localStorage.getItem("username");

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
                navigate("/heario-client/")
            }
        }).catch((error) => {
            console.log(error);
        });
    }

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
                    <Grid item>
                        <TextField
                        id="outlined-basic"
                        label="Username"
                        variant="outlined"
                        onChange={(e) => {setUsername(e.target.value)}}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        onChange={(e) => {setPassword(e.target.value)}}
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