const Player = require('./Player.js');
const { tonal } = require('tonal');
const NoteQuestion = require('./noteQuestion.js');

class Room {
    constructor(id, hostId, roundSettings){
        this.id = id;
        this.hostId = hostId;
        this.players = {};
        this.playerCount = 0;
        this.roundCount = 1;
        this.roundSettings = roundSettings;
        this.typesSelected = this.generateTypesSelected();
        this.currentIndex = 0;
        this.questionCount = 0;
        this.question = null;
        this.started = false;
    }
    generateTypesSelected(){ // generate types selected based on roundSettings
        return Object.entries(this.roundSettings)
        .filter(([key, value]) => value === true)
        .map(([key, value]) => key);
    } 

    setRoundSettings(settings, callback){
        this.roundSettings = settings;
        this.typesSelected = this.generateTypesSelected();
        if (callback){
            callback();
        }
    }
    getRoundSettings(){
        return this.roundSettings;
    }
    setTypesSelected(types){
        this.typesSelected = types;
    }
    addPlayer(id, name){
        this.players[id] = new Player(id, name);
    }
    countPlayers(){
        this.playerCount = Object.keys(this.players).length;
        return this.playerCount;
    }
    getPlayerCount(){
        this.playerCount = Object.keys(this.players).length;
        return this.playerCount;
    }
    getPlayer(id){
        return this.players[id];
    }
    getAllPlayers(){
        return this.players;
    }
    async newQuestion() {
        this.currentIndex = (this.roundCount - 1) % this.typesSelected.length; // To loop through typesSelected
        if (this.currentIndex < this.typesSelected.length) {
          const type = this.typesSelected[this.currentIndex];
          const noteQuestion = await NoteQuestion.init(type);
    
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
          });
    
          console.log(this.question); // works
          this.currentIndex++;
          return Promise.resolve();
        } else {
          console.log("All types processed");
          return Promise.resolve(); // or reject with an error, depending on your needs
        }
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
        this.roundCount = 1;
        this.questionCount = 0;
    }
    setTypes(types){
        this.types = types;
    }
}

module.exports = Room;