export const TONES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const OCTAVE_NUMBERS = [3,4,5,6];
export const INTERVALS = {
    'm2': [0,1],    // Minor 2nd
    'M2': [0,2],    // Major 2nd
    'm3': [0,3],    // Minor 3rd
    'M3': [0,4],    // Major 3rd
    'P4': [0,5],    // Perfect 4th
    'A4': [0,6],    // Augmented 4th / Diminished 5th
    'P5': [0,7],    // Perfect 5th
    'm6': [0,8],    // Minor 6th
    'M6': [0,9],    // Major 6th
    'm7': [0,10],   // Minor 7th
    'M7': [0,11],   // Major 7th
    'P8': [0,12]     // Perfect 8th (Octave)
  };

export const SCALES = {
  'Major': [0, 'W', 'W', 'H', 'W', 'W', 'W', 'H'],
  'Minor': [0, 'W', 'H', 'W', 'W', 'H', 'W', 'W'],
  'Augmented': [0, 'W', 'W', 'H', 'W', 'W', 'W', 'H'],
  'Diminished': [0, 'W', 'H', 'W', 'H', 'W', 'H', 'W'],
};

export const CHORDS = {
  'Major': [0, 4, 3], // ohow many half steps to take to get to the next note
  'Minor': [0, 3, 4],
  'Augmented': [0, 4, 4],
  'Diminished': [0, 3, 3],
  'Major 7th': [0, 4, 3, 4],
  'Minor 7th': [0, 3, 4, 3],
  'Dominant 7th': [0, 4, 3, 3],
  'Diminished 7th': [0, 3, 3, 3],
}

export default OCTAVE_NUMBERS.reduce((notes, octaveNumber) => {
  const notesInOctave = TONES.map(tone => `${tone}${octaveNumber}`);
  return [...notes, ...notesInOctave];
}, []);