const tonal = require('tonal');

class NoteQuestion{
    constructor({
        question = null,
        possibleAnswers = null,
        correctAnswer = null,
    }) {
        this.question = question;
        this.possibleAnswers = possibleAnswers;
        this.correctAnswer = correctAnswer;
    }
    static init(){
        const question = tonal.Note.names()[Math.floor(Math.random() * tonal.Note.names().length)];
        const possibleAnswers = tonal.Note.names();
        const correctAnswer = question;
        return question;
    }
    getQuestion(){
        return this.question;
    }
    getPossibleAnswers(){
        return this.possibleAnswers;
    }
    getCorrectAnswer(){
        return this.correctAnswer;
    }
}

module.exports = NoteQuestion;