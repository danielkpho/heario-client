import react, { useState, useEffect } from "react";

import Axios from "axios";

export default function Register(){
    const [usernameReg, setUsernameReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loginStatus, setLoginStatus] = useState('');

    const register = () => {
        console.log('Username: ', usernameReg, 'Password: ', passwordReg);
        Axios.post("http://localhost:8000/register", {
            username: usernameReg,
            password: passwordReg,
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    };

    const login = () => {
        Axios.post("http://localhost:8000/login", {
            username: username,
            password: password,
        }).then((response) => {
            console.log(response);
            if (response.data.message){
                setLoginStatus(response.data.message);
            } else {
                setLoginStatus(response.data[0].Username);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    return(
        <div>
        <div>
            <h1>Registration</h1>
            <label>Username</label>
            <input type="text" onChange={(e) => {setUsernameReg(e.target.value)}}/>
            <label>Password</label>
            <input type="text" onChange={(e) => {setPasswordReg(e.target.value)}}/>
            <button onClick={register}>Register</button>
        </div>
        <div>
            <h1>Login</h1>
            <input type="text" placeholder="Username..." onChange={(e) => {setUsername(e.target.value)}}/>
            <input type="text" placeholder="Password..." onChange={(e) => {setPassword(e.target.value)}}/>
            <button onClick={login}>Login</button>
        </div>
        <div>
            <h1>{loginStatus}</h1>
        </div>
        </div>
    )
}