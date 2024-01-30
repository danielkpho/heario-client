import React from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';

import { Grid } from "@mui/material";

import SoundfontProvider from './SoundfontProvider';

// webkitAudioContext fallback needed to support Safari
export default function ReactPiano(){

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const noteRange = {
  first: MidiNumbers.fromNote('c3'),
  last: MidiNumbers.fromNote('f4'),
};
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

  return (
    <div>
      <div className="mt-5">
        <BasicPiano />
      </div>
    </div>
  );

function BasicPiano() {
    return (
        <Grid 
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            padding={5}
        >
            <Grid item>
            <SoundfontProvider
            instrumentName="acoustic_grand_piano"
            audioContext={audioContext}
            hostname={soundfontHostname}
            render={({ isLoading, playNote, stopNote }) => (
                <Piano
                noteRange={noteRange}
                width={300}
                playNote={playNote}
                stopNote={stopNote}
                disabled={isLoading}
                keyboardShortcuts={keyboardShortcuts}
                />
            )}
            />
            </Grid>
        <Grid/>
    </Grid>
    );
}
}

