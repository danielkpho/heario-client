const tonal = require('tonal');

class NoteQuestion{
    constructor({
        note = "",
        tone = "",
        possibleAnswers = "",
        correctAnswer = "",
        questionType = "",
    }) {
        this.note = note;
        this.tone = tone;
        this.possibleAnswers = possibleAnswers;
        this.correctAnswer = correctAnswer;
        this.questionType = questionType;
    }
    static init(type){ // to fix 
        let note;
        let tone;
        let possibleAnswers;
        let correctAnswer;
        let questionType;
        const randomOctave = Math.floor(Math.random() * 6) + 1;
        if (type === "notes"){
            note = tonal.Note.names()[Math.floor(Math.random() * tonal.Note.names().length)];
            tone = [note + randomOctave];
            possibleAnswers = tonal.Note.names();
            correctAnswer = note;
            questionType = "notes";
        }
        if (type === "sharps"){
            const allNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A","A#", "B"];

            note = allNotes[Math.floor(Math.random() * allNotes.length)];
            tone = [note + randomOctave];
            possibleAnswers = allNotes;
            correctAnswer = note;
            questionType = "notes";
        }
        if (type === "intervals"){
            const initialNote = tonal.Note.names()[Math.floor(Math.random() * tonal.Note.names().length)] + randomOctave;
            const allIntervals = tonal.Interval.names();
            const interval = allIntervals[Math.floor(Math.random() * allIntervals.length)];
            const intervalTone =  tonal.transpose(initialNote, interval)// TODO

            possibleAnswers = allIntervals;
            correctAnswer = interval;
            note = intervalTone;
            tone = [initialNote, intervalTone];
            questionType = "intervals";
        }
        if (type === "scales"){
            const initialNote = tonal.Note.names()[Math.floor(Math.random() * tonal.Note.names().length)] + randomOctave;
            const allScales = ["major", "minor", "dorian", "phrygian", "lydian", "mixolydian", "locrian"]
            const scale = allScales[Math.floor(Math.random() * allScales.length)];
            const scaleTone = tonal.Scale.get(`${initialNote} ${scale}`).notes;

            possibleAnswers = allScales;
            correctAnswer = scale;
            note = scaleTone;
            tone = scaleTone;
            questionType = "scales";
        }
        if (type === "chords"){
            const initialNote = tonal.Note.names()[Math.floor(Math.random() * tonal.Note.names().length)];
            
            const allChords = ["major", "minor", "augmented", "diminished", "dominant"]
            const chord = allChords[Math.floor(Math.random() * allChords.length)];
            const chordNote = tonal.Chord.get(`${initialNote} ${chord}`).notes;
            const chordTone = chordNote.map(note => note + randomOctave);

            possibleAnswers = allChords;
            correctAnswer = chord;
            note = initialNote;
            tone = chordTone;
            questionType = "chords";
        }

        return new NoteQuestion({
            note,
            tone,
            possibleAnswers,
            correctAnswer,
            questionType,
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
    getQuestionType(){
        return this.questionType;
    }
}

module.exports = NoteQuestion;