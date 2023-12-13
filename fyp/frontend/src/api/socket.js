// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://localhost:8000";
// export const socket = socketIOClient(ENDPOINT);

// const io = require('socket.io-client');
// export const socket = io('http://localhost:8000', {
//     withCredentials: true,
//     extraHeaders: {
//         "my-custom-header": "abcd"
//     }
// }); // connect to server socket on port 8000

const io = require('socket.io-client');
console.log("Attempting to connect to server");
export const socket = io('http://localhost:8080', {
    withCredentials: true,
});

socket.on('connect', () => {
    console.log('connected to server');
});

// connect to server socket on port 8000

