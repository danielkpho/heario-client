const { Note, Chord, Scale, Interval } = require('@tonaljs/tonal');

const getNote = () => {
  const note = Note.random();
  console.log(note);
  return note;
};

const getChord = () => {
    const chord = Chord.random();
    console.log(chord);
    return chord;
}

const getScale = () => {
    const scale = Scale.random();
    console.log(scale);
    return scale;
}

const getInterval = () => {
    const interval = Interval.random();
    console.log(interval);
    return interval;
}

module.exports = { getNote, getChord, getScale, getInterval };