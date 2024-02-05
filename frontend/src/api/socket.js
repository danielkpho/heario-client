const io = require('socket.io-client');
console.log("Attempting to connect to server");
// export const socket = io('http://localhost:8000', {
//     withCredentials: true,
// });
export const socket = io('https://heario-13b5b094cc85.herokuapp.com/', {
    withCredentials: true,
});

socket.on('connect', () => { 
    console.log('connected to server');
});
