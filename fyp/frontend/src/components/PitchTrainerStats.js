import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TONES } from '../constants/NOTES.js';

function getStatRows(statQuestions, statSkips, statTries, statTriesTime, statCorrect) {
  let id = 0, rows = [], note;
  for (let noteIdx = 0; noteIdx < TONES.length; ++noteIdx) {
    if (statQuestions[noteIdx]) { // only process existing data
      note = TONES[noteIdx];
      id += 1;
      rows.push({
        id,
        note,
        numQ: statQuestions[noteIdx],
        numS: statSkips[noteIdx],
        numA: statTries[noteIdx],
        averageCorrectTime: (statTriesTime[noteIdx] / statCorrect[noteIdx] / 1000).toFixed(4), // milliseconds
        accuracy: (statCorrect[noteIdx] / statTries[noteIdx]).toFixed(4),
      });
    }
  }
  return rows;
}

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

export { PitchTrainerStatistics, getStatRows }