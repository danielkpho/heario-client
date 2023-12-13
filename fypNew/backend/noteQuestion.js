const tonal = require('tonal');

class NoteQuestion{
    constructor({
        note = "",
        tone = "",
        possibleAnswers = "",
        correctAnswer = "",
    }) {
        this.note = note;
        this.tone = tone;
        this.possibleAnswers = possibleAnswers;
        this.correctAnswer = correctAnswer;
    }
    static init(){
        const note = tonal.Note.names()[Math.floor(Math.random() * tonal.Note.names().length)];
        const tone = note + [Math.floor(Math.random() * 7) + 1];
        const possibleAnswers = tonal.Note.names();
        const correctAnswer = note;
        return new NoteQuestion({
            note,
            tone,
            possibleAnswers,
            correctAnswer,
        });
    }
    getNote(){
        return this.note;
    }
    getTone(){
        return this.tone;
    }
    getPossibleAnswers(){
        return this.possibleAnswers;
    }
    getCorrectAnswer(){
        return this.correctAnswer;
    }
}

module.exports = NoteQuestion;