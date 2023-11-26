import { OCTAVE_NUMBERS, INTERVALS, SCALES, CHORDS } from './NOTES.js';

function getNextTone(tones) {
    const nextTone = tones[Math.floor(Math.random()*tones.length)];
    return nextTone;
  }
  
function getNextNote(tone) { // randomly chose a note from the tones with an octave 
      const note = tone+OCTAVE_NUMBERS[Math.floor(Math.random()*OCTAVE_NUMBERS.length)].toString();
      console.log(note);
    return [note];
  }
  
function getRandomInterval(intervals) { // return a random interval
    const randomInterval = intervals[Math.floor(Math.random()*intervals.length)];
    return randomInterval;
  };

function getIntervalNotes(tones, interval, startingOctave = 4) { // return a pair of notes based on the selected interval  
    const intervals = INTERVALS[interval];
    console.log(intervals);

    let currentOctave = startingOctave;
    let startingIndex = Math.floor(Math.random() * tones.length);
  
    const intervalNotes = intervals.map(offset => {
      const index = (startingIndex + offset) % tones.length;
      const note = tones[index];
  
      // Check if the note is lower than the previous note (crossed into a new octave)
      if (index < startingIndex) {
        currentOctave++;
      }
  
      startingIndex = index;
      return `${note}${currentOctave}`;
    });
  
    return intervalNotes;
    };
    
 function getRandomScale(scales) { // return a random scale
    const randomScale = scales[Math.floor(Math.random()*scales.length)];
    console.log(randomScale);
    return randomScale;
  };
  
 function getScaleNotes(tones, scale, startingOctave = 4) {  
    const scaleIntervals = SCALES[scale];
    
    let currentOctave = startingOctave;
    let startingIndex = Math.floor(Math.random() * tones.length);
    let currentNoteIndex = startingIndex;
  
    const scaleNotes = scaleIntervals.map(interval => {
      if (typeof interval === 'number') {
        // If the interval is a number, it represents the number of semitones
        currentNoteIndex = (startingIndex + interval) % tones.length;
      } else if (interval === 'W') {
        // Whole step
        currentNoteIndex = (startingIndex + 2) % tones.length;
      } else if (interval === 'H') {
        // Half step
        currentNoteIndex = (startingIndex + 1) % tones.length;
      }
  
      // Increase the octave if the array is looped back to the beginning
      if (currentNoteIndex < startingIndex){
        currentOctave++;
      }
      
      const note = tones[currentNoteIndex];

      startingIndex = currentNoteIndex;
      return `${note}${currentOctave}`;
    });
  
    return scaleNotes;
  }

 function getRandomChord(chords) { // return a random chord
    const randomChord = chords[Math.floor(Math.random()*chords.length)];
    console.log(randomChord);
    return randomChord;
  };

function getChordNotes(tones, chord, startingOctave = 4) {
    const chordIntervals = CHORDS[chord];

    let currentOctave = startingOctave;
    let startingIndex = Math.floor(Math.random() * tones.length);

    const chordNotes = chordIntervals.map(interval => {
      let index = (startingIndex + interval) % tones.length;
      const note = tones[index];
      // Check if the note is lower than the previous note (crossed into a new octave)
      if (index < startingIndex) {
        currentOctave++;
      }

      startingIndex = index;
      return `${note}${currentOctave}`;
    });

    return chordNotes;
  };

export { getNextTone, getNextNote, getRandomInterval, getIntervalNotes, getRandomScale, getScaleNotes, getRandomChord, getChordNotes };