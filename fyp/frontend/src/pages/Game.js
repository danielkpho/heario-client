import React, { Component, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Lobby from './Lobby.js';
// import { withStyles } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
// import Input from '@mui/material/Input';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import FilledInput from '@mui/material/FilledInput';
// import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
// import FormHelperText from '@mui/material/FormHelperText';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import StopIcon from '@mui/icons-material/Stop';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {instrument as soundfontInstrument} from 'soundfont-player';
import {OCTAVE_NUMBERS, TONES, INTERVALS, SCALES, CHORDS} from '../constants/NOTES.js';
import '../components/Game.css';
import TonesAnswerButton from '../components/answerButton.js';

// function TonesAnswerButtons(props) {
//   const answerButtons = props.answers.map((r) => 
//     <Grid 
//       key={r} item xs={"auto"}>
//       <AnswerButton
//         onClick={() => props.handleGameAnswer(r)}
//         label={r} 
//       />
//     </Grid>);

//   return (
//     <Grid
//         container
//         spacing={8}
//         direction="row"
//         alignItems="center"
//         // justify="center"
//         // style={{ minHeight: '70vh' }}
//       >
//       {answerButtons}
//     </Grid>
//   );
// }



// return a table of statistics that user may be interested in
function PitchTrainerStatistics(props) {
  return(
    <Table className="pitch-trainer-stat-table">
        <TableHead>
          <TableRow>
            <TableCell>Notes Tested</TableCell>
            <TableCell numeric>Number of Questions</TableCell>
            <TableCell numeric>Number of Skipped Questions</TableCell>
            <TableCell numeric>Number of Attempts</TableCell>
            <TableCell numeric>Average Times for Correct Attempt(s)</TableCell>
            <TableCell numeric>Accuracy (#Correct/#Attempts)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map(row => {
            return (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.note}
                </TableCell>
                <TableCell numeric>{row.numQ}</TableCell>
                <TableCell numeric>{row.numS}</TableCell>
                <TableCell numeric>{row.numA}</TableCell>
                <TableCell numeric>{isNaN(row.averageCorrectTime)?(0):(row.averageCorrectTime)}</TableCell>
                <TableCell numeric>{isNaN(row.accuracy)?(0):(row.accuracy)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
  );
}

// TODO
// Maybe using note from Teoria is better?
class PitchTrainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tones: ['C',  'C#', 'D', 'D#',  'E',  'F', 'F#', 'G', 'G#',  'A','A#',  'B'],
      isLoaded: false,
      isStarted: false,
      // numChoices: 3,
      tonePlaying: 'C',
      intervalPlaying: 'M2',
      scalePlaying: 'Major',
      chordPlaying: 'Major',
      playingNotes: [],
      resetClickedButtons: false,
      gameStartTime: 0,
      isCorrect: false,
      lastAnswer: -1, // -1: no ans, 0: wrong ans, 1: correct ans
      answers: [],
      timeLimit: 10,
      // hasTimer: false,
      // statistics for last game if not first game
      isFirstGame: true,
      statQuestions: [0,0,0,0,0,0,0,0,0,0,0,0], // how many questions shown for a tone
      statSkips: [0,0,0,0,0,0,0,0,0,0,0,0], // how many skipped questions shown for a tone
      statTries: [0,0,0,0,0,0,0,0,0,0,0,0], // how many tries did user made for a tone
      statTriesTime: [0,0,0,0,0,0,0,0,0,0,0,0], // how long in total for user to decide a tone, used to calc average time
      statCorrect: [0,0,0,0,0,0,0,0,0,0,0,0], // how many correct ans in first selection, used to calc the accuracy
      questionType: 'notes',
    };
    // this.NUM_CHOICES_LIST = Array.apply(null, {length: TONES.length}).map(Number.call, Number).map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>).slice(3);
    this.ac = new AudioContext();
    soundfontInstrument(this.ac, 'acoustic_grand_piano', {
      soundfont: 'MusyngKite'
    }).then((acoustic_grand_piano) => {
      this.somePiano = acoustic_grand_piano;
      this.setState({ isLoaded: true });
    });
  }
//   handleSelection = name => event => {
//     let t = this.state.tones;
//     t[TONES.indexOf(name)] = event.target.checked;
//     this.setState({ tones: t });
//   };

    setQuestions(){
      const { questionType } = this.state;

        if (questionType === 'notes') {
        const nextTone = this.getNextTone();
        this.setState({
            tonePlaying: nextTone,
            playingNotes: this.getNextNote(nextTone),
            answers: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
        });
      } else if (questionType === 'intervals') {
        // Set answers for intervals
        const interval = this.getRandomInterval();
        this.setState({
            intervalPlaying: interval,
            playingNotes: this.getIntervalNotes(interval),
            answers: ['m2', 'M2', 'm3', 'M3', 'P4', 'A4', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8'],
        });
      } else if (questionType === 'scales') {
        // Set answers for scales
        const scale = this.getRandomScale();
        this.setState({
            scalePlaying: scale,
            playingNotes: this.getScaleNotes(scale),
            answers: ['Major', 'Minor', 'Augmented', 'Diminished'],
        });
      } else if (questionType === 'chords') {
        // Set answers for chords
        const chord = this.getRandomChord();
        this.setState({
            chordPlaying: chord,
            playingNotes: this.getChordNotes(chord),
            answers: ['Major', 'Minor', 'Augmented', 'Diminished', 'Major 7th', 'Minor 7th', 'Dominant 7th', 'Diminished 7th'],
        });
      }
    }

  handleGameStart() {
    this.setQuestions();
    this.setState({
      gameStartTime: performance.now(),
      isStarted: true,
      isCorrect: false,
      lastAnswer: -1,
      // answers: answers,
    }, () => {
      this.handlePlayNote();
    }
    );
  }
  
  handleGameStop() {
    const tonePlayingIdx = TONES.indexOf(this.state.tonePlaying);

    let statQuestions = this.state.statQuestions;
    statQuestions[tonePlayingIdx] += 1;

    let statSkips = this.state.statSkips;
    if(!this.state.isCorrect) statSkips[tonePlayingIdx] += 1;

    this.setState({
      isStarted: false,
      isCorrect: false,
      isFirstGame: false,
      lastAnswer: -1,
      gameStartTime: 0,
      statQuestions: statQuestions,
      statSkips: statSkips,
    });
  }

  // randomly chose a note from the tones user chooses
  getNextTone() {
    const { tones } = this.state;
    const nextTone = tones[Math.floor(Math.random()*tones.length)];
    return nextTone;
  }
  
  getNextNote(tone) { // randomly chose a note from the tones with an octave 
      const note = tone+OCTAVE_NUMBERS[Math.floor(Math.random()*OCTAVE_NUMBERS.length)].toString();
      console.log(note);
    return [note];
  }
  
  getRandomInterval() { // return a random interval
    const intervals = Object.keys(INTERVALS);
    const randomInterval = intervals[Math.floor(Math.random()*intervals.length)];
    return randomInterval;
  };

  getIntervalNotes(interval, startingOctave = 4) { // return a pair of notes based on the selected interval
    const { tones } = this.state;
  
    const intervals = INTERVALS[interval];
  
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
    
    getRandomScale() { // return a random scale
      const scales = Object.keys(SCALES);
      const randomScale = scales[Math.floor(Math.random()*scales.length)];
      console.log(randomScale);
      return randomScale;
    };
  
    getScaleNotes(scale, startingOctave = 4) {
      const { tones } = this.state;
    
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

    getRandomChord() { // return a random chord
      const chords = Object.keys(CHORDS);
      const randomChord = chords[Math.floor(Math.random()*chords.length)];
      console.log(randomChord);
      return randomChord;
    };

    getChordNotes(chord, startingOctave = 4) {
      const { tones } = this.state;

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
      
  // return an array of objects representing rows of the stat table
  getStatRows() {
    let id = 0, rows = [], note;
    for(let noteIdx = 0; noteIdx < TONES.length; ++noteIdx) {
      if(this.state.statQuestions[noteIdx]) { // only process existing data
        note = TONES[noteIdx];
        id += 1;
        rows.push({
          id,
          note,
          numQ: this.state.statQuestions[noteIdx],
          numS: this.state.statSkips[noteIdx],
          numA: this.state.statTries[noteIdx],
          averageCorrectTime: (this.state.statTriesTime[noteIdx]/this.state.statCorrect[noteIdx]/1000).toFixed(4), // milliseconds
          accuracy: (this.state.statCorrect[noteIdx]/this.state.statTries[noteIdx]).toFixed(4),
        });
      }
    }
    return rows;
  }

  async handlePlayNote() {
    // Assuming this.somePiano.play(note) plays a note using your piano library
    const playingNotes = this.state.playingNotes;
    // Define a delay function
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
    // Iterate through the notes and play each one
    for (let index = 0; index < playingNotes.length; index++) {
      // Play the note
      this.somePiano.play(playingNotes[index]);
      console.log(playingNotes[index]);
  
      // Wait for a short duration before playing the next note
      await delay(1000); // Adjust the duration as needed
    }
  
    // Perform actions after the last note is played
    console.log("Last note played");
  }

  async handlePlayNote() {
    const { playingNotes, questionType } = this.state;
  
    // Assuming this.somePiano.play(note) plays a note using your piano library
    if (questionType === 'chords' || questionType === 'intervals') {
      // Play all notes simultaneously for chords
      playingNotes.forEach(note => {
        this.somePiano.play(note);
        console.log(note);
      });
    } else {
      // Play notes sequentially for other question types
      for (let index = 0; index < playingNotes.length; index++) {
        // Play the note
        this.somePiano.play(playingNotes[index]);
        console.log(playingNotes[index]);
  
        // Wait for a short duration before playing the next note
        await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the duration as needed
      }
  
      // Perform actions after the last note is played
      console.log("Last note played");
    }
  }

  handleNext() {
    const tonePlayingIdx = TONES.indexOf(this.state.tonePlaying);

    let statQuestions = this.state.statQuestions;
    statQuestions[tonePlayingIdx] += 1;

    let statSkips = this.state.statSkips;
    if(!this.state.isCorrect) statSkips[tonePlayingIdx] += 1;

    // const answers = this.getAnswers(this.state.tones, nextTone);
    this.setQuestions();
    this.setState({
      gameStartTime: performance.now(),
      lastAnswer: -1,
      isCorrect: false,
      statQuestions: statQuestions,
      statSkips: statSkips,
    }, () => {
      this.handlePlayNote();
      this.resetButtonState();
    }
    );
  }

  handleGameAnswer(answer, answerType) {
    const timeNow = performance.now();

    if(!this.state.isCorrect) { // do nothing if already answered correctly
      let statTries = this.state.statTries;
      const tonePlayingIdx = TONES.indexOf(this.state.tonePlaying)
      statTries[tonePlayingIdx] += 1;

      if(answer === this.state[answerType]) { // correct answer
        let statTriesTime = this.state.statTriesTime;
        statTriesTime[tonePlayingIdx] += (timeNow - this.state.gameStartTime); // milliseconds

        let statCorrect = this.state.statCorrect;
        statCorrect[tonePlayingIdx] += 1;

        this.setState({
          isCorrect:true,
          lastAnswer:1,
          statTries: statTries,
          statTriesTime: statTriesTime,
          statCorrect: statCorrect,
        });
      } else {
        this.setState({
          statTries: statTries,
          lastAnswer: 0,
        });
      }
    } 
  }
  
  resetButtonState = () => {
    this.setState({ resetClickedButtons: true }, () => {
      // After a short delay, reset the state
      setTimeout(() => {
        this.setState({ resetClickedButtons: false });
      }, 100);
      console.log("reset button state");
    });
  };
  
  render() {
    const { questionType } = this.state;
    const correctAnswer = (questionType === 'notes') ? this.state.tonePlaying : (questionType === 'intervals') ? this.state.intervalPlaying : (questionType === 'scales') ? this.state.scalePlaying : this.state.chordPlaying;
    return (
      <Grid
        container
        spacing={5}
        direction="column"
        alignItems="center"
        style={{ minHeight: '70vh', width: '100%', margin: 'auto' }}
      >
        <Grid item xs={"auto"}>
          <h1>Pitch Listening Practice</h1>
          <h2>{!this.state.isStarted ? "Listen and select the note played" : ""}</h2>
        </Grid>

        {!this.state.isStarted ? (
          <Grid item xs={"auto"}>
            <form className='pitch-trainer-num-choices-form' autoComplete='off'>
              <Typography variant="h5">Statistics</Typography>
              <PitchTrainerStatistics rows={this.getStatRows()} />
            </form>
          </Grid>
        ) : (
          <Grid item xs={6}>
            <Grid container spacing={16} direction="row" alignContent="center">
              <Grid item xs={6} sm={6}>
                <Button fullWidth={true} variant="contained" className="button pitch-trainer-button" onClick={() => this.handlePlayNote()}>
                  <MusicNoteIcon className="leftIcon pitch-trainer-leftIcon" />
                  Play
                </Button>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Button fullWidth={true} variant="contained" className="button pitch-trainer-button" onClick={() => {this.handleNext()}}>
                  {(!this.state.isCorrect) ?
                    (<SkipNextIcon className="leftIcon pitch-trainer-leftIcon" />) :
                    (<NavigateNextIcon className="leftIcon pitch-trainer-leftIcon" />)
                  }
                  {(!this.state.isCorrect) ? ("Skip") : ("Next")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}

        {(this.state.isStarted) &&
          <Grid item xs={"auto"}>
            <TonesAnswerButton
              answers={this.state.answers}
              handleGameAnswer={(answer) => this.handleGameAnswer(answer, this.state.questionType === 'notes' ? 'tonePlaying' : (this.state.questionType === 'intervals' ? 'intervalPlaying' : (this.state.questionType === 'scales' ? 'scalePlaying' : 'chordPlaying')))}
              resetClickedButtons={this.state.resetClickedButtons}
              isCorrect={this.state.isCorrect}
              />
          </Grid>
        }

        {(this.state.isStarted) &&
          <Grid item>
            <Typography variant="h5">
              {(this.state.lastAnswer === -1) ? "Make a choice" : (this.state.lastAnswer === 1) ? "Correct! The note is: " + correctAnswer : "Sorry, try again."}
            </Typography>
          </Grid>
        }

        {/* {(!this.state.isStarted) && (!this.state.isFirstGame) &&
          <Grid item xs={"auto"}>
            <PitchTrainerStatistics rows={this.getStatRows()} />
          </Grid>
        } */}

        {(!this.state.isStarted) ? (
          <Grid item xs={"auto"}>
            <Button disabled={!this.state.isLoaded} variant="contained" color="secondary" className="button pitch-trainer-button" onClick={() => this.handleGameStart()}>
              <ArrowRightIcon className="leftIcon pitch-trainer-leftIcon" />
              {this.state.isLoaded ? "Start" : "Loading"}
            </Button>
            <FormGroup>
                <FormControlLabel control={<Checkbox checked={questionType === 'notes'} onChange={() => this.setState({ questionType: 'notes' })} />} label="Notes" />
                <FormControlLabel control={<Checkbox checked={questionType === 'intervals'} onChange={() => this.setState({ questionType: 'intervals' })} />} label="Intervals" />
                <FormControlLabel control={<Checkbox checked={questionType === 'scales'} onChange={() => this.setState({ questionType: 'scales' })} />} label="Scales" />
                <FormControlLabel control={<Checkbox checked={questionType === 'chords'} onChange={() => this.setState({ questionType: 'chords' })} />} label="Chords" />
            </FormGroup>
          </Grid>
        ) : (
          <Grid item xs={"auto"}>
            <Button variant="contained" color="secondary" className="button pitch-trainer-button" onClick={() => this.handleGameStop()}>
              <StopIcon className="leftIcon pitch-trainer-leftIcon" />
              End
            </Button>
          </Grid>
        )}
      </Grid>
      
    );
  }
}

export default PitchTrainer;