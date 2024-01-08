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
app.use(express.json());

const io = socketio(expressServer, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:8000'],
        credentials: true,
    },
});

const rooms = {};

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "heariodb"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.post('/register', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);

    con.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err, result) => { console.log(err);})
    console.log("User registered");
});

app.post('/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    con.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, result) => {
        if (err){
            res.send({ err: err });
            console.log(err);
        } 
        if (result.length > 0) {
            res.send(result);
        } else {
            res.send({ message: "Wrong username/password combination!" })
        }    
    })
});


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
            console.log("sending all players");
            io.to(id).emit("allPlayers", room.getAllPlayers()); // send all players in room to new player
        }
        console.log('user with socket id ' + socket.id + ' created and joined room ' + id);
        io.emit("rooms", Object.keys(rooms).map((id) => ({ id, started: rooms[id].started })));
        io.emit("message", { name: "Console", message: name + " created a room!" });
        console.log(rooms);

    });

    socket.on("getRooms", () => { // player requests rooms
        io.to(socket.id).emit("rooms", Object.keys(rooms).map((id) => ({ id, started: rooms[id].started })));
    });
    

    socket.on("joinRoom", ({id, name}) => { // player joins room
        const room = rooms[id];
        if (!room) return; 
        socket.join(id);
        room.addPlayer(socket.id, name);
        if (room.getPlayer(socket.id)){ // if player was added successfully
            io.to(id).emit("allPlayers", room.getAllPlayers()); // send all players in room to new player
        }
        console.log('user with socket id ' + socket.id + ' joined room ' + id);
        console.log(rooms[id]);
        io.to(id).emit("message", { name: "Console", message: name + " joined the room!" });
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
            room.started = true;
            // console.log(room.getQuestion());
            io.to(roomId).emit("gameStarted");
            io.to(roomId).emit("message", { name: "Console", message: "Game started!" });
            console.log('game started in room ' + roomId);
        }
    });

    socket.on("getQuestion", async ({ roomId }) => { // player requests question
        const room = rooms[roomId];
        if (room) {
            await room.newQuestion();
            note = room.getNote();
            tone = room.getTone();
            io.to(roomId).emit("note", note);
            io.to(roomId).emit("tone", tone);
            io.to(roomId).emit("answers", room.getQuestionAnswers());
            io.to(roomId).emit("correctAnswer", room.getCorrectAnswer());
            io.to(roomId).emit("questionType", room.getQuestionType());
            console.log("roundCount " + room.roundCount)
            console.log('user with socket id ' + socket.id + ' requested question from room ' + roomId);
        }
    });
    socket.on("getTone", ({ roomId }) => { // player requests tone
        const room = rooms[roomId];
        if (room) {
            io.to(socket.id).emit("tone", room.getTone());
        }
    });

    socket.on("getAnswers", ({ roomId }) => { // player requests answers
        const room = rooms[roomId];
        if (room) {
            io.to(socket.id).emit("answers", room.getQuestionAnswers());
        }
    });

    socket.on("getCorrectAnswer", ({ roomId }) => { // player requests correct answer
        const room = rooms[roomId];
        console.log(room.getCorrectAnswer());
        if (room) {
            io.to(socket.id).emit("correctAnswer", room.getCorrectAnswer());
        }
    });

    socket.on("nextRound", ({ roomId }) => { // host starts next round
        const room = rooms[roomId];
        if (room) {
            room.roundCount++;
            io.to(roomId).emit("nextRound");
        }
    });

    socket.on("setScore", ({ roomId, userId, score }) => { // player submits answer
        const room = rooms[roomId];
        if (room) room.setPlayerScore(userId, score);
            io.to(roomId).emit("allPlayers", room.getAllPlayers());
            socket.emit("message", { name: "Console", message: "Correct! You scored " + score + " point(s)!" });
    });
    
    socket.on("getScores", ({ roomId }) => { // player requests scores
        const room = rooms[roomId];
        if (room) {
            io.to(socket.id).emit("scores", { scores: room.getScores() });
        }
    });

    socket.on("sendMessage", ({ roomId, message }) => { // player sends message
        const room = rooms[roomId];
        console.log(message);
        if (room) {
            const senderName = room.getPlayer(socket.id).name;
            socket.broadcast.to(roomId).emit("message", { name: senderName, message });        }
    });

    socket.on("resetGame", ({ roomId }) => { // host resets game
        console.log('user with socket id ' + socket.id + ' resetted game in room ' + roomId);
        const room = rooms[roomId];
        if (room) {
            room.resetGame();
            room.started = false;
            console.log(room);
            io.to(roomId).emit("allPlayers", room.getAllPlayers());
            io.to(roomId).emit("gameReset");
            io.to(roomId).emit("message", { name: "Console", message: "Game reset!" });
        }
    });

    socket.on("leaveRoom", ({ roomId }) => { // player leaves room
        const room = rooms[roomId];
        if (room) {
            playerName = room.getPlayer(socket.id).name;
            socket.leave(roomId);
            room.removePlayer(socket.id);
            io.to(roomId).emit("allPlayers", room.getAllPlayers());
            io.to(roomId).emit("message", { name: "Console", message: playerName + " left the room!"});
            console.log('user with socket id ' + socket.id + ' left room ' + roomId);
        }
    });

    socket.on("deleteLobby", ({ roomId }) => { // host ends game
        const room = rooms[roomId];
        if (room){
            delete rooms[roomId];
            io.to(roomId).emit("hostLeft");
            console.log('user with socket id ' + socket.id + ' deleted room ' + roomId);
        } else {
            console.log('user with socket id ' + socket.id + ' tried to delete room ' + roomId + ' but it does not exist');
        }
    });

    socket.on("disconnect", () => { // player disconnects
        for (let room in rooms){
            if (rooms[room].getPlayer(socket.id)){
                rooms[room].removePlayer(socket.id);
                io.to(room).emit("allPlayers", rooms[room].getAllPlayers());
            }
        }
        console.log('user with socket id ' + socket.id + ' disconnected');
    });

    socket.on("startTimer", ({ roomId, duration }) => { // host starts timer
        const room = rooms[roomId];
        if (room) {
            const endTime = Date.now() + duration * 1000;
            let timer;

            timer = setInterval(() => {
                const currentTime = Date.now();
                const remainingTime = Math.max(0, endTime - currentTime);
                io.to(roomId).emit("timer-update", Math.round(remainingTime/1000));

                if (remainingTime <= 0) {
                    clearInterval(timer);
                    io.to(roomId).emit("timer-end");
                }
            }, 1000);
        }
    });

    socket.on("round-over", ({ roomId }) => { // player ends round
        const room = rooms[roomId];
        if (room) {
            const endTime = Date.now() + 5 * 1000;
            let timer;

            timer = setInterval(() => {
                const currentTime = Date.now();
                const remainingTime = Math.max(0, endTime - currentTime);

                io.to(roomId).emit("timer-update", Math.round(remainingTime/1000));

                if (remainingTime <= 0) { // have to fix sending multiple times
                    console.log("nextround emitted")
                    clearInterval(timer);
                    room.roundCount++;
                    io.to(roomId).emit("nextRound");
                }
            }, 1000);
        }
    });
});