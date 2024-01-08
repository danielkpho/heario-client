import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useSelector } from "react-redux";

import { allQuestions, allTries, allAccuracy } from "../features/statSlice";

export default function Statistics(){
    const questions = useSelector(allQuestions);
    const tries = useSelector(allTries);
    const accuracy = useSelector(allAccuracy);

    const data = questions.map((question, index) => {
        return {
            question,
            tries: tries[index],
            accuracy: accuracy[index],
        }
    });
    

    return (
        <TableContainer component={Paper}>
          <Table sx= {{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ color: 'black' }} dense >Question</TableCell>
                <TableCell align="center" style={{ color: 'black' }} dense>Tries</TableCell>
                <TableCell align="center" style={{ color: 'black' }} dense>Accuracy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center" style={{ color: 'black' }} dense>{row.question}</TableCell>
                  <TableCell align="center" style={{ color: 'black' }} dense>{row.tries}</TableCell>
                  <TableCell align="center" style={{ color: 'black' }} dense>{row.accuracy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
}