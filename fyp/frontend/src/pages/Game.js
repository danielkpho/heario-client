import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

import {instrument as soundfontInstrument} from 'soundfont-player';
import { TONES, INTERVALS, SCALES, CHORDS } from '../constants/NOTES.js';
import '../components/Game.css';
import { TonesAnswerButton, resetButtonState } from '../components/TonesAnswerButton.js';
import { PitchTrainerStatistics, getStatRows } from '../components/PitchTrainerStats.js';
import { getNextTone, getNextNote, getRandomInterval, getIntervalNotes, getRandomScale, getScaleNotes, getRandomChord, getChordNotes } from '../constants/audioUtils.js';

class PitchTrainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tones: ['C',  'C#', 'D', 'D#',  'E',  'F', 'F#', 'G', 'G#',  'A','A#',  'B'],
      isLoaded: false,
      isStarted: false,
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
      // hasTimer: false,
      // statistics for last game if not first game
      isFirstGame: true,
      statQuestions: [0,0,0,0,0,0,0,0,0,0,0,0], // how many questions shown for a tone
      statSkips: [0,0,0,0,0,0,0,0,0,0,0,0], // how many skipped questions shown for a tone
      statTries: [0,0,0,0,0,0,0,0,0,0,0,0], // how many tries did user made for a tone
      statTriesTime: [0,0,0,0,0,0,0,0,0,0,0,0], // how long in total for user to decide a tone, used to calc average time
      statCorrect: [0,0,0,0,0,0,0,0,0,0,0,0], // how many correct ans in first selection, used to calc the accuracy
      selectedQuestionType: ['notes'], // ['notes', 'intervals', 'scales', 'chords'
      questionType: 'notes', // 
    };
    this.ac = new AudioContext();
    soundfontInstrument(this.ac, 'acoustic_grand_piano', {
      soundfont: 'MusyngKite'
    }).then((acoustic_grand_piano) => {
      this.somePiano = acoustic_grand_piano;
      this.setState({ isLoaded: true });
    });
  }

  setQuestions(){
    const { tones } = this.state;

    let questionType = this.state.questionType;
    const randomTypeIndex = Math.floor(Math.random() * this.state.selectedQuestionType.length);
    questionType = this.state.selectedQuestionType[randomTypeIndex];
    this.setState({ questionType: questionType });

      if (questionType === 'notes') {
      const nextTone = getNextTone(tones);
      this.setState({
          tonePlaying: nextTone,
          playingNotes: getNextNote(nextTone),
          answers: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
      });
    } else if (questionType === 'intervals') {
      // Set answers for intervals
      const intervals = Object.keys(INTERVALS); 
      const interval = getRandomInterval(intervals);
      this.setState({
          intervalPlaying: interval,
          playingNotes: getIntervalNotes(tones, interval),
          answers: ['m2', 'M2', 'm3', 'M3', 'P4', 'A4', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8'],
      });
    } else if (questionType === 'scales') {
      // Set answers for scales
      const scales = Object.keys(SCALES);
      const scale = getRandomScale(scales);
      this.setState({
          scalePlaying: scale,
          playingNotes: getScaleNotes(tones, scale),
          answers: ['Major', 'Minor', 'Augmented', 'Diminished'],
      });
    } else if (questionType === 'chords') {
      // Set answers for chords
      const chords = Object.keys(CHORDS);
      const chord = getRandomChord(chords);
      this.setState({
          chordPlaying: chord,
          playingNotes: getChordNotes(tones, chord),
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
  
    
// return an array of objects representing rows of the stat table
  

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
      resetButtonState(this.setState.bind(this));
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
  
  handleCheckboxChange = (type) => {
    this.setState((prevState) => {
      const { selectedQuestionType } = prevState;
      const index = selectedQuestionType.indexOf(type);
  
      if (index === -1) {
        // Add the type to the array if it's not present
        const updatedTypes = [...selectedQuestionType, type];
        return { selectedQuestionType: updatedTypes };
      } else {
        // Remove the type from the array if it's present
        const updatedTypes = [...selectedQuestionType];
        updatedTypes.splice(index, 1);
  
        // Check if there is at least one checkbox checked
        if (updatedTypes.length > 0) {
          return { selectedQuestionType: updatedTypes };
        } else {
          // If no checkbox is checked, keep the state unchanged
          return null;
        }
      }
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
                <PitchTrainerStatistics rows={getStatRows(
                  this.state.statQuestions,
                  this.state.statSkips,
                  this.state.statTries,
                  this.state.statTriesTime,
                  this.state.statCorrect
                )} />            
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

        {(!this.state.isStarted) ? (
          <Grid item xs={"auto"}>
            <Button disabled={!this.state.isLoaded} variant="contained" color="secondary" className="button pitch-trainer-button" onClick={() => this.handleGameStart()}>
              <ArrowRightIcon className="leftIcon pitch-trainer-leftIcon" />
              {this.state.isLoaded ? "Start" : "Loading"}
            </Button>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={this.state.selectedQuestionType.includes('notes')} onChange={() => this.handleCheckboxChange('notes')} />}
                label="Notes"
              />
              <FormControlLabel
                control={<Checkbox checked={this.state.selectedQuestionType.includes('intervals')} onChange={() => this.handleCheckboxChange('intervals')} />}
                label="Intervals"
              />
              <FormControlLabel
                control={<Checkbox checked={this.state.selectedQuestionType.includes('scales')} onChange={() => this.handleCheckboxChange('scales')} />}
                label="Scales"
              />
              <FormControlLabel
                control={<Checkbox checked={this.state.selectedQuestionType.includes('chords')} onChange={() => this.handleCheckboxChange('chords')} />}
                label="Chords"
              />
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