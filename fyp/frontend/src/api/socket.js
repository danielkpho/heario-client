// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://localhost:8000";
// export const socket = socketIOClient(ENDPOINT);

const io = require('socket.io-client');
export const socket = io('http://localhost:8000', {
    withCredentials: true,
    extraHeaders: {
        "my-custom-header": "abcd"
    }
}); // connect to server socket on port 8000
