// import React, { useEffect } from 'react';
// import { SplendidGrandPiano } from 'smplr';

// const Game = () => {
//   useEffect(() => {
//     const context = new (window.AudioContext || window.webkitAudioContext)();
//     const piano = new SplendidGrandPiano(context);

//     piano.load.then(() => {
//       const handleButtonClick = () => {
//         context.resume(); // enable audio context after a user interaction
//         piano.start({ note: 60, velocity: 80 });
//       };

//     document.getElementById("btn").addEventListener("click", handleButtonClick);

//     return () => {
//       // Cleanup: remove the event listener and close the audio context
//       document.getElementById("btn").removeEventListener("click", handleButtonClick);
//       context.close();
//     };
//   }, []); 
// });// The empty dependency array ensures the effect runs once when the component mounts

//   return (
//     <div>
//       <button id="btn">Play</button>
//     </div>
//   );
// };

// export default Game;

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
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
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
import {OCTAVE_NUMBERS, TONES} from '../constants/NOTES.js';
import shuffleArray from '../util/shuffleArray';
import '../components/Game.css';

function TonesCheckboxes(props){
  return(
    <React.Fragment>
      <FormLabel component="legend">
        Choose the notes to test, you can change anytime
      </FormLabel>
      <FormGroup row>
        {TONES.map((t) => 
          <FormControlLabel
            key={t}
            control={
              <Checkbox
                checked={props.tones[TONES.indexOf(t)]}
                onChange={props.handleSelection(t)}
                value={t}
              />
            }
            label={t}
          />
        )}
      </FormGroup>
    </React.Fragment>
  );
}

TonesCheckboxes.propTypes = {
  tones: PropTypes.array.isRequired,
  handleSelection: PropTypes.func.isRequired,
};

function TonesAnswerButtons(props) {
  const answerButtons = props.answers.map((r) => 
    <Grid 
      key={r} 
      item xs={"auto"}>
      <Button 
        key={r} 
        color="inherit"
        className="pitch-trainer-button" 
        onClick={() => props.handleGameAnswer(r)}> 
          {r} 
      </Button>
    </Grid>);
  return (
    <Grid
        container
        spacing={8}
        direction="row"
        alignItems="center"
        // justify="center"
        // style={{ minHeight: '70vh' }}
      >
      {answerButtons}
    </Grid>
  );
}

TonesAnswerButtons.propTypes = {
  answers: PropTypes.array.isRequired,
  handleGameAnswer: PropTypes.func.isRequired,
};

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
      //     ['C',  'C#', 'D', 'D#',  'E',  'F', 'F#', 'G', 'G#',  'A','A#',  'B']
      tones: [true,true,true,true,true,true,true,true,true,true,true,true],
      isLoaded: false,
      isStarted: false,
      // numChoices: 3,
      tonePlaying: 'C',
      notePlaying: 'C4',
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
    };
    this.NUM_CHOICES_LIST = Array.apply(null, {length: TONES.length}).map(Number.call, Number).map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>).slice(3);
    this.ac = new AudioContext();
    soundfontInstrument(this.ac, 'acoustic_grand_piano', {
      soundfont: 'MusyngKite'
    }).then((acoustic_grand_piano) => {
      this.somePiano = acoustic_grand_piano;
      this.setState({ isLoaded: true });
    });
  }
  handleSelection = name => event => {
    let t = this.state.tones;
    t[TONES.indexOf(name)] = event.target.checked;
    this.setState({ tones: t });
  };
  handleGameStart() {
    const nextTone = this.getNextTone();
    const answers = this.getAnswers(this.state.tones, nextTone);
    this.setState({
      gameStartTime: performance.now(),
      isStarted: true,
      tonePlaying: nextTone,
      notePlaying: this.getNextNote(nextTone),
      isCorrect: false,
      lastAnswer: -1,
      answers: answers,
    }, () => this.handlePlayNote());
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
  // handleNumChoices = event => {
  //   this.setState({
  //     [event.target.name]: event.target.value,
  //    });
  // };
  // randomly chose a note from the tones user chooses
  getNextTone() {
    let tonesChosen = [];
    for(let i = 0; i < this.state.tones.length; ++i){ if(this.state.tones[i]) tonesChosen.push(TONES[i]); }
    return tonesChosen[Math.floor(Math.random()*tonesChosen.length)];
  }
  getNextNote(tone) {
    return tone+OCTAVE_NUMBERS[Math.floor(Math.random()*OCTAVE_NUMBERS.length)].toString();
  }
  
  getAnswers(tones, tonePlaying) {
    let answers = [...TONES];
    return answers; 
  }
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
  handlePlayNote() {
    this.somePiano.play(this.state.notePlaying);
  }
  handleNext() {
    const tonePlayingIdx = TONES.indexOf(this.state.tonePlaying);

    let statQuestions = this.state.statQuestions;
    statQuestions[tonePlayingIdx] += 1;

    let statSkips = this.state.statSkips;
    if(!this.state.isCorrect) statSkips[tonePlayingIdx] += 1;

    const nextTone = this.getNextTone();
    const answers = this.getAnswers(this.state.tones, nextTone);
    this.setState({
      tonePlaying: nextTone,
      notePlaying: this.getNextNote(nextTone),
      answers: answers,
      gameStartTime: performance.now(),
      lastAnswer: -1,
      isCorrect: false,
      statQuestions: statQuestions,
      statSkips: statSkips,
    }, () => this.handlePlayNote());
  }
  handleGameAnswer(note) {
    const timeNow = performance.now(), tonePlayingIdx = TONES.indexOf(this.state.tonePlaying);
    if(!this.state.isCorrect) { // do nothing if already answered correctly
      let statTries = this.state.statTries;
      statTries[tonePlayingIdx] += 1;
      if(note===this.state.tonePlaying) {
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
          lastAnswer:0,
        });
      }
    } 
  }
  render() {
    return (
      <Grid
        container
        spacing={32}
        direction="column"
        alignItems="center"
        style={{ minHeight: '90vh', width: '100%', margin: 'auto' }}
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
                <Button fullWidth={true} variant="contained" className="button pitch-trainer-button" onClick={() => this.handleNext()}>
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
            <TonesAnswerButtons
              answers={this.state.answers}
              handleGameAnswer={(note) => this.handleGameAnswer(note)}
            />
          </Grid>
        }

        {(this.state.isStarted) &&
          <Grid item>
            <Typography variant="h5">
              {(this.state.lastAnswer === -1) ? "Make a choice" : (this.state.lastAnswer === 1) ? "Correct! The note is: " + this.state.notePlaying : "Sorry, try again."}
            </Typography>
          </Grid>
        }

        {(!this.state.isStarted) && (!this.state.isFirstGame) &&
          <Grid item xs={"auto"}>
            <PitchTrainerStatistics rows={this.getStatRows()} />
          </Grid>
        }

        {(!this.state.isStarted) ? (
          <Grid item xs={"auto"}>
            <Button disabled={!this.state.isLoaded} variant="contained" color="secondary" className="button pitch-trainer-button" onClick={() => this.handleGameStart()}>
              <ArrowRightIcon className="leftIcon pitch-trainer-leftIcon" />
              {this.state.isLoaded ? "Start" : "Loading"}
            </Button>
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