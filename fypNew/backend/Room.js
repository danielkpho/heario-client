const Player = require('./Player.js');
const { tonal } = require('tonal');
const NoteQuestion = require('./noteQuestion.js');

class Room {
    constructor(id, hostId, roundSettings){
        this.id = id;
        this.hostId = hostId;
        this.players = {};
        this.roundCount = 1;
        this.roundSettings = roundSettings;
        this.questionCount = 0;
        this.question = null;
        this.started = false;
    }
    setRoundSettings(settings, callback){
        this.roundSettings = settings;
        if (callback){
            callback();
        }
    }
    getRoundSettings(){
        return this.roundSettings;
    }
    addPlayer(id, name){
        this.players[id] = new Player(id, name);
    }
    getPlayer(id){
        return this.players[id];
    }
    getAllPlayers(){
        return this.players;
    }
    async newQuestion(sharps, notes, intervals, scales, chords){
        const noteQuestion = await NoteQuestion.init(sharps, notes, intervals, scales, chords);
        
        const note = noteQuestion.getNote();
        const tone = noteQuestion.getTone();
        const possibleAnswers = noteQuestion.getPossibleAnswers();
        const correctAnswer = noteQuestion.getCorrectAnswer();
        const questionType = noteQuestion.getQuestionType();

        this.question = new NoteQuestion({
            note,
            tone,
            possibleAnswers,
            correctAnswer,
            questionType,
        })
        console.log(this.question); // works
        return Promise.resolve();
    }
    getNote(){
        return this.question.getNote();
    }
    getTone(){
        return this.question.getTone();
    }
    getQuestionAnswers(){
        return this.question.getPossibleAnswers();
    }
    getCorrectAnswer(){
        return this.question.getCorrectAnswer();
    }
    getQuestionType(){
        return this.question.getQuestionType();
    }
    answerQuestion(playerId, answer){
        if(answer === this.question.getCorrectAnswer()){
            this.players[playerId].addScore();
            console.log(this.players[playerId]);
        }
    }
    setPlayerScore(playerId, score){
        this.players[playerId].setScore(score);
        const player = this.players[playerId];
        const Score = player.getScore();
        console.log(`Player ID: ${playerId}, Score: ${score}`);
    }
    getScores(){
        const scores = [];
        for (let player in this.players){
            let id = this.players[player].getId();
            let name = this.players[player].getName();
            let score = this.players[player].getScore();
            scores.push({id, name, score});
        }
        console.log(scores);
        scores.sort((a, b) => (a.score < b.score) ? 1 : -1);
        return scores;
    }
    removePlayer(id){
        delete this.players[id];
    }
    resetGame(){
        for (let player in this.players){
            this.players[player].resetScore();
        }
        this.roundCount = 0;
        this.questionCount = 0;
    }
    setTypes(types){
        this.types = types;
    }
}

module.exports = Room;