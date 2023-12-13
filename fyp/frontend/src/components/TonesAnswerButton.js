import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';


import Button from '@mui/material/Button';

function resetButtonState(setStateFunc) {
  setStateFunc({ resetClickedButtons: true }, () => {
    // After a short delay, reset the state
    setTimeout(() => {
      setStateFunc({ resetClickedButtons: false });
    }, 100);
    console.log("reset button state");
  });
}

function TonesAnswerButton(props) {
    const [clickedButtons, setClickedButtons] = useState([]);
  
    const handleButtonClick = (note) => {
      setClickedButtons((prevClickedButtons) => [...prevClickedButtons, note]);
      props.handleGameAnswer(note);
    };
  
    useEffect(() => { // Reset the state when the resetClickedButtons prop is set to true
      if (props.resetClickedButtons) {
        // After a short delay, reset the state
        const timeoutId = setTimeout(() => {
          setClickedButtons([]);}, 100);
  
        return () => clearTimeout(timeoutId); // Cleanup on component unmount or re-render
      }

      if (props.isCorrect == true){
        setClickedButtons(props.answers);
      }
    }, [props.resetClickedButtons, props.answers, props.isCorrect]);
  
    const answerButtons = props.answers.map((r, index) => (
      <Grid key={index} item xs={"auto"}>
        <Button
          color="inherit"
          className="pitch-trainer-button"
          style={{ textTransform: 'none' }}
          disabled={clickedButtons.includes(r)}
          onClick={() => handleButtonClick(r)}
        >
          {r}
        </Button>
      </Grid>
    ));
  
    return (
      <Grid
        container
        spacing={8}
        direction="row"
        alignItems="center"
      >
        {answerButtons}
      </Grid>
    );
  }
  
  TonesAnswerButton.propTypes = {
    answers: PropTypes.array.isRequired,
    handleGameAnswer: PropTypes.func.isRequired,
  };

export { TonesAnswerButton, resetButtonState };