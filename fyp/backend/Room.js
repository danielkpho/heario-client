const Player = require('./Player.js');
const { tonal } = require('tonal');
const NoteQuestion = require('./noteQuestion.js');

class Room {
    constructor(id, hostId, roundSettings){
        this.id = id;
        this.hostId = hostId;
        this.players = {};
        this.roundCount = 0;
        this.roundSettings = roundSettings;
        this.questionCount = 0;
        this.question = null;
    }
    setRoundSettings(settings){
        this.roundSettings = settings;
    }
    addPlayer(id, name){
        this.players[id] = new Player(id, name);
    }
    getPlayer(id){
        return this.players[id];
    }
    async newQuestion(){
        const noteQuestion = await NoteQuestion.init();

        const question = noteQuestion.getQuestion();
        const possibleAnswers = noteQuestion.getPossibleAnswers();
        const correctAnswer = noteQuestion.getCorrectAnswer();

        this.question = new NoteQuestion({
            question,
            possibleAnswers,
            correctAnswer,
        })
    }
    getQuestion(){
        return this.question.getQuestion();
    }
    getQuestionAnswers(){
        return this,question.getPossibleAnswers();
    }
    getCorrectAnswer(){
        return this.question.getCorrectAnswer();
    }
    answerQuestion(playerId, answer){
        if(answer === this.question.getCorrectAnswer()){
            this.players[playerId].addScore();
            console.log(this.players[playerId]);
        }
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
}

module.exports = Room;