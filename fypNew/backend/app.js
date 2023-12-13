const Room = require('./Room.js');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const PORT = 8000; // port to run server on

const app = express();
const expressServer = app.listen(PORT, () => // start server on port 8080
    console.log("Server has started on port " + PORT)
);

app.use(cors());

const io = socketio(expressServer, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:8000'],
        credentials: true,
    },
});

const rooms = {};

io.on('connection', socket => { 
    console.log('user with socket id ' + socket.id + ' connected');

    io.to(socket.id).emit("allRoomsId", Object.keys(rooms));

    socket.on("createRoom", ({ id, roundSettings, name }) => { // host creates room
        if (!rooms[id]) {
            rooms[id] = new Room(id, socket.id, roundSettings); // create new room with id and host id
        }
        const room = rooms[id];
        socket.join(id);
        room.addPlayer(socket.id, name);
        if (room.getPlayer(socket.id)){ 
            io.to(id).emit("allPlayers", room.getAllPlayers()); // send all players in room to new player
        }
        console.log('user with socket id ' + socket.id + ' created and joined room ' + id);
        io.to(socket.id).emit("allRoomsId", Object.keys(rooms));
        console.log(rooms[id]);

        // io.to(id).emit("newPlayer", room.getPlayer(socket.id)); 
    });

    socket.on("allRoomsId", () => { // player requests all rooms id")    
        // console.log(Object.keys(rooms));
    });
    

    socket.on("joinRoom", ({id, name}) => { // player joins room
        // console.log(name);
        const room = rooms[id];
        if (!room) return; 
        socket.join(id);
        room.addPlayer(socket.id, name);
        // io.to(id).emit("newPlayer", room.getPlayer(socket.id)); 
        if (room.getPlayer(socket.id)){ // if player was added successfully
            io.to(id).emit("allPlayers", room.getAllPlayers()); // send all players in room to new player
        }
        console.log('user with socket id ' + socket.id + ' joined room ' + id);
        console.log(rooms[id]);

    })

    socket.on("updateSettings", ({ id, roundSettings }) => { // host updates settings
        const room = rooms[id];
        if (room) {
            room.setRoundSettings(roundSettings, () => {
                console.log(room);
                io.to(id).emit("updatedSettings", room.roundSettings); // send updated settings to all players in room
            });
        }
    });

    socket.on("getHostId", ({ roomId }) => { // player requests host id
        const room = rooms[roomId];
        if (room){
             io.to(socket.id).emit("hostId", room.hostId);
             console.log(room.hostId);
        }
       
    });

    socket.on("getSettings", ({ roomId }) => { // player requests settings
        const room = rooms[roomId];
        if (room) {
            io.to(socket.id).emit("settings", room.getRoundSettings());
        }
    });

    socket.on("startGame", ({ roomId, roundSettings }) => { // host starts game
        const room = rooms[roomId];
        if (room) {
            room.setRoundSettings(roundSettings);
            // console.log(room.getQuestion());
            io.to(roomId).emit("gameStarted");
            console.log('game started in room ' + roomId);
        }
    });

    socket.on("getQuestion", async ({ roomId, round }) => { // player requests question
        const room = rooms[roomId];
        if (room) {
            await room.newQuestion();
            note = room.getNote();
            tone = room.getTone();
            io.to(socket.id).emit("note", room.getNote())
            io.to(socket.id).emit("tone", tone);
            io.emit("answers", room.getQuestionAnswers());
            console.log('user with socket id ' + socket.id + ' requested question from room ' + roomId);
        }
    });

    socket.on("getCorrectAnswer", ({ roomId }) => { // player requests correct answer
        const room = rooms[roomId];
        console.log(room.getCorrectAnswer());
        if (room) io.to(socket.id).emit("correctAnswer", room.getCorrectAnswer());
    });

    // socket.on("submitAnswer", ({ roomId, userId, ans }) => { // player submits answer
    //     const room = rooms[roomId];
    //     if (room) room.answerQuestion(userId, ans);
    // });

    socket.on("setScore", ({ roomId, userId, score }) => { // player submits answer
        const room = rooms[roomId];
        if (room) room.setPlayerScore(userId, score);
        console.log(roomId, userId, score);
    });
    
    socket.on("getScores", ({ roomId }) => { // player requests scores
        const room = rooms[roomId];
        if (room) {
            io.to(socket.id).emit("scores", { scores: room.getScores() });
        }
    });

    socket.on("endGame", ({ roomId }) => { // host ends game
        const room = rooms[roomId];
        if (room) {
            io.to(roomId).emit("gameEnded");
        }
    });

    socket.on("deleteLobby", ({ roomId }) => { // host ends game
        const room = rooms[roomId];
        if (room[roomId]) delete room[roomId];
    });

    socket.on("disconnect", () => { // player disconnects
        console.log('user with socket id ' + socket.id + ' disconnected');
    });
});