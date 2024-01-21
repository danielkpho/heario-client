const Room = require('./Room.js');
const express = require('express');
const jwt = require('jsonwebtoken');
const socketio = require('socket.io');
const cors = require('cors');
const PORT = 8000; // port to run server on
// require('dotenv').config();
// const secretKey = process.env.HEARIO_SECRET_KEY;

// console.log(secretKey);
// const crypto = require('crypto');



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

// var mysql = require('mysql');

// var db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "password",
//     database: "heariodb"
// });

// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
// });

// app.post('/register', function(req, res) {
//     const username = req.body.username;
//     const password = req.body.password;
//     console.log(username, password);

//     db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err, result) => { console.log(err);})
//     console.log("User registered");
// });

// app.post('/login', function(req, res) {
//     const username = req.body.username;
//     const password = req.body.password;

//     db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, result) => {
//         if (err){
//             res.send({ err: err });
//             console.log(err);
//         } 
//         if (result.length > 0) {
//             res.send(result);
//         } else {
//             res.send({ message: "Wrong username/password combination!" })
//         }    
//     })
// });

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./heariodb.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the heariodb database.');
});

db.run('CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL)');
db.run('CREATE TABLE IF NOT EXISTS games_played (user_id INT PRIMARY KEY, total_games_played INT, games_won INT, FOREIGN KEY (user_id) REFERENCES users(user_id))');
db.run('CREATE TABLE IF NOT EXISTS user_tokens (user_id INT PRIMARY KEY, token TEXT, FOREIGN KEY (user_id) REFERENCES users(user_id))');
db.run('CREATE TABLE IF NOT EXISTS user_attempts (user_id INTEGER,question_type VARCHAR(50),question VARCHAR(50), correct_attempts FLOAT, total_attempts FLOAT, PRIMARY KEY (user_id, question_type, question), FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE)');


app.post('/register', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Check if the user already exists
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, existingUser) => {
        if (err) {
            res.status(500).send({ err: err });
            console.log(err);
        } else if (existingUser) {
            res.status(200).send({ message: "User already exists!" });
            console.log("User already exists");
        } else {
            // If the user doesn't exist, insert the new user
            db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err, result) => {
                if (err) {
                    res.status(500).send({ err: err });
                    console.log(err);
                } else {
                    // User successfully added to the database
                    const token = generateToken(username, 3600);

                    res.status(200).send({ message: "User added to database", username, token });
                    console.log("User added to database");
                }
            });
            // db.run("INSERT INTO games_played (user_id, total_games_played, games_won) VALUES ((SELECT user_id FROM users WHERE username = ?), 0, 0)", [username], (err, result) => {
            //     if (err) {
            //         res.status(500).send({ err: err });
            //         console.log(err);
            //     } else {
            //         // User successfully added to the database
            //         res.send({ message: "User games database init" });
            //         console.log("User games database init");
            //     }
            // });
        }
    });
});


app.post('/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    db.all("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, result) => {
        if (err) {
            res.send({ err: err });
            console.log(err);
            return;
        }
    
        if (result.length > 0) {
            const user_id = result[0].user_id;
    
            // Check if there is an existing token for the user
            db.get("SELECT token FROM user_tokens WHERE user_id = ?", [user_id], (err, existingToken) => {
                if (err) {
                    res.send({ err: err });
                    console.log(err);
                    return;
                }
    
                // Generate a new token or update the existing one
                const token = existingToken ? existingToken.token : generateToken(username, 3600);
    
                // Insert or update the token in the database
                const sql = existingToken
                    ? "UPDATE user_tokens SET token = ? WHERE user_id = ?"
                    : "INSERT INTO user_tokens (user_id, token) VALUES (?, ?)";
    
                db.run(sql, [token, user_id], (err) => {
                    if (err) {
                        res.send({ err: err });
                        console.log(err);
                    } else {
                        console.log("User logged in");
                        console.log("Token added or updated in the database");
                        res.send({ username, token });
                    }
                });
            });
        } else {
            res.send({ message: "Wrong username/password combination!" });
        }
    });
    
});
// app.post('/incrementGamesPlayed', verifyToken, function(req, res) {
app.post('/incrementGamesPlayed', function(req, res) {
    const username = req.body.username;

    // Using INSERT OR REPLACE to either update or insert a new row
    db.run(`
    INSERT INTO games_played (user_id, total_games_played, games_won)
    VALUES (
        (SELECT user_id FROM users WHERE username = ?),
        1,
        0
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_games_played = total_games_played + 1
        ;
    `, [username], (err) => {
        if (err){
            res.status(500).send({ err: err.message });
            console.log(err);
        } else {
            console.log("Games played incremented");
            res.send({ message: "Games played incremented" });
        }
    });
});

app.post("/incrementGamesWon", function(req, res) {
    const username = req.body.username;

    // Using INSERT OR REPLACE to either update or insert a new row
    db.run(`
    INSERT INTO games_played (user_id, total_games_played, games_won)
    VALUES (
        (SELECT user_id FROM users WHERE username = ?),
        0,
        1
    )
    ON CONFLICT (user_id) DO UPDATE SET
        games_won = games_won + 1
        ;
    `, [username], (err) => {
        if (err){
            res.status(500).send({ err: err.message });
            console.log(err);
        } else {
            console.log("Games won incremented");
            res.send({ message: "Games won incremented" });
        }
    });
});

app.post('/getGamesPlayed', function(req, res) {
    const username = req.body.username;

    // Upsert (INSERT or UPDATE) the user's data into games_played
    db.run(`
        INSERT INTO games_played (user_id, total_games_played, games_won)
        VALUES (
            (SELECT user_id FROM users WHERE username = ?),
            0,
            0
        )
        ON CONFLICT (user_id) DO UPDATE
        SET total_games_played = COALESCE(games_played.total_games_played, 0),
            games_won = COALESCE(games_played.games_won, 0)
    `, [username], (err) => {
        if (err) {
            res.status(500).send({ err: err.message });
            console.log(err);
        } else {
            // Retrieve the user's data after the upsert
            db.get(`
                SELECT total_games_played, games_won
                FROM games_played
                WHERE user_id = (SELECT user_id FROM users WHERE username = ?)
            `, [username], (err, result) => {
                if (err) {
                    res.status(500).send({ err: err.message });
                    console.log(err);
                } else {
                    const gamesPlayed = result ? result.total_games_played : 0;
                    const gamesWon = result ? result.games_won : 0;
                    res.send({ gamesPlayed, gamesWon });
                }
            });
        }
    });
});


app.post('/updateAttempts', function(req, res) {
    const username = req.body.username;
    const questionType = req.body.questionType;
    const question = req.body.question;
    const correctAttempts = req.body.correctAttempts;
    const totalAttempts = req.body.totalAttempts;

    // Using INSERT OR REPLACE to either update or insert a new row
    db.run(`
    INSERT INTO user_attempts (user_id, question_type, question, correct_attempts, total_attempts)
    VALUES (
        (SELECT user_id FROM users WHERE username = ?),
        ?,
        ?,
        ?,
        ?
    )
    ON CONFLICT (user_id, question_type, question) DO UPDATE SET
        correct_attempts = user_attempts.correct_attempts + EXCLUDED.correct_attempts,
        total_attempts = user_attempts.total_attempts + EXCLUDED.total_attempts
    ;
    `, [username, questionType, question, correctAttempts, totalAttempts], (err) => {
        if (err){
            res.status(500).send({ err: err.message });
            console.log(err);
        } else {
            console.log("Attempts updated");
            res.send({ message: "Attempts updated" });
        }
    });
});

function generateToken(username, expirationInSeconds) { // token that contains username and expiration time
    const payload = {
        username,
        exp: Math.floor(Date.now() / 1000) + expirationInSeconds,
    };

    return jwt.sign(payload, null, { algorithm: 'none' });
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    
    if (!token) {
        res.status(401).send({ message: "No token provided" });
        return;
    }

    jwt.verify(token, null, { algorithms: ['none'] }, (err, payload) => {
        if (err) {
            res.status(401).send({ message: "Invalid token" });
            console.log(err);
            console.log(token)
            return;
        }

        req.username = payload.username;
        next();
    });
}

app.post('/getAttempts', function (req,res) { 
    const username = req.body.username;
    db.all("SELECT question_type, question, correct_attempts, total_attempts FROM user_attempts WHERE user_id = (SELECT user_id FROM users WHERE username = ?)", [username], (err, result) => {
        if (err){
            res.status(500).send({ err: err.message });
            console.log(err);
        } else {
            res.send({ result });
        }
    });
}
);










io.on('connection', socket => { 
    console.log('user with socket id ' + socket.id + ' connected');
    console.log(rooms);
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
        io.emit("rooms", Object.keys(rooms).map((id) => ({ id, started: rooms[id].started, players: rooms[id].getPlayerCount() })));
        io.emit("message", { name: "Console", message: name + " created a room!" });
        console.log(rooms);

    });

    socket.on("getRooms", () => { // player requests rooms
        io.to(socket.id).emit("rooms", Object.keys(rooms).map((id) => ({ id, started: rooms[id].started, players: rooms[id].getPlayerCount()})));
    });
    

    socket.on("joinRoom", ({id, name}) => { // player joins room
        const room = rooms[id];
        if (!room) return; 
        if (room.players.length >= 8) return; // room is full
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

    socket.on("getQuestion", async (roomId) => { // player requests question
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
            socket.broadcast.to(roomId).emit("gameReset");
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
            io.to(socket.id).emit("rooms", Object.keys(rooms).map((id) => ({ id, started: rooms[id].started, players: rooms[id].getPlayerCount() })));
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

                console.log(remainingTime);


                if (remainingTime <= 0) {
                    clearInterval(timer);
                    io.to(roomId).emit("timer-end");
                }
            }, 1000);
        }
    });

    socket.on("round-over", roomId => { // player ends round
        const room = rooms[roomId];
        if (room) {
            const endTime = Date.now() + 5 * 1000;
            let timer;

            timer = setInterval(() => {
                const currentTime = Date.now();
                const remainingTime = Math.max(0, endTime - currentTime);

                io.to(roomId).emit("timer-update", Math.round(remainingTime/1000));

                console.log(remainingTime);

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