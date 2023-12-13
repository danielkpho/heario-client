const Room = require('./Room.js');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const PORT = 8080; // port to run server on

const app = express();
const expressServer = app.listen(PORT, () => // start server on port 8080
    console.log("Server has started on port " + PORT)
);

app.use(cors());

const io = socketio(expressServer, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:8080'],
        credentials: true,
    },
});

const rooms = {};

io.on('connection', socket => { 
    console.log('user with socket id ' + socket.id + ' connected');

    socket.on("createRoom", ({ id, roundSettings }) => { // host creates room
        if (!rooms[id]) {
            rooms[id] = new Room(id, socket.id, roundSettings);
            console.log(rooms[id]);
        }
        socket.join(id);
        console.log('user with socket id ' + socket.id + ' created and joined room ' + id);
    });
    
    socket.on("joinRoom", ({id, name}) => { // player joins room
        console.log(name);
        const room = rooms[id];
        if (!room) return; 
        socket.join(id);
        room.addPlayer(socket.id, name);
        if (room.getPlayer(socket.id)){
            io.to(rooms[id].hostId).emit("newPlayer", { id: socket.id, name});
        }
        console.log('user with socket id ' + socket.id + ' joined room ' + id);
    })

    socket.on("startGame", ({ roomId, roundSettings }) => { // host starts game
        const room = rooms[roomId];
        if (room) {
            room.setRoundSettings(roundSettings);
            io.to(roomId).emit("gameStarted");
        }
    });

    socket.on("getQuestion", ({ roomId, round }) => { // player requests question
        const room = rooms[roomId];
        if (room) {
            room.newQuestion();
            io.to(socket.id).emit("question", room.getQuestion());
            socket.to(roomId).emit("answers", room.getQuestionAnswers());
            console.log('user with socket id ' + socket.id + ' requested question from room ' + roomId);
        }
    });

    socket.on("getCorrectAnswer", ({ roomId }) => { // player requests correct answer
        const room = rooms[roomId];
        console.log(room.getCorrectAnswer());
        if (room) io.to(socket.id).emit("correctAnswer", room.getCorrectAnswer());
    });

    socket.on("submitAnswer", ({ roomId, userId, ans }) => { // player submits answer
        const room = rooms[roomId];
        if (room) room.answerQuestion(userId, ans);
    });

    socket.on("getScores", ({ roomId }) => { // player requests scores
        const room = rooms[roomId];
        if (room) {
            io.to(socket.id).emit("scores", { scores: room.getScores() });
        }
    });

    socket.on("endGame", ({ roomId }) => { // host ends game
        const room = rooms[roomId];
        if (room[roomId]) delete room[roomId];
    });

    socket.on("disconnect", () => { // player disconnects
        console.log('user with socket id ' + socket.id + ' disconnected');
    });
});