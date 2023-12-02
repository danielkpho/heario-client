import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { gameId, updateRoundSettings } from './gameSlice';
import { Button, Form } from 'react-bootstrap';
import './Settings.css';

export default function Settings() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const id = useSelector(gameId);
    const [roundSettings, setRoundSettings] = useState([]);

    const updateSettingsField = (index, propertyName) => e => {
        const newSettings = [...roundSettings];
        newSettings[index][propertyName] = parseInt(e.target.value);
        setRoundSettings(newSettings);
    };

    const deleteRound = index => {
        const settings = [...roundSettings].filter((curr, idx) => idx !== index);
        settings.forEach((curr, idx) => (curr.round = idx + 1));
        setRoundSettings(settings);
    };

    const addRow = () => {
        setRoundSettings([
            ...roundSettings,
            {
                round: roundSettings.length + 1,
                numOfQuestions: 5,
                timer: 30,
            }
        ]);
    }

    const startGame = () => {
        dispatch(updateRoundSettings(roundSettings));
        navigate('/game/question/${id}');
    };

    const allowedRoundCounts = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const allowedTimes = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

    return (
        <div>
          <div className="option-grid option-grid-bg">
            <div className="option-item">#</div>
            <div className="option-item-left">Questions</div>
            <div className="option-item-left">Timer</div>
            <div className="option-item">
              <Button
                className="btn-width"
                size="sm"
                onClick={() => addRow()}
                variant="success"
              >
                +
              </Button>
            </div>
          </div>
          {roundSettings.map(
            ({ round, numOfQuestions, timer }, index) => (
              <div key={round} className="option-grid">
                <div className="option-item">{round}</div>
                <div className="option-item">
                  <Form.Control
                    as="select"
                    onChange={updateSettingsField(index, "numOfQuestions")}
                    value={numOfQuestions}
                  >
                    {allowedRoundCounts.map((val, idx) => (
                      <option key={`round${idx}`} value={val}>
                        {val}
                      </option>
                    ))}
                  </Form.Control>
                </div>
                <div className="option-item">
                  <Form.Control
                    as="select"
                    onChange={updateSettingsField(index, "timer")}
                    value={timer}
                  >
                    {allowedTimes.map((val, idx) => (
                      <option key={`time${idx}`} value={val}>
                        {val}
                      </option>
                    ))}
                  </Form.Control>
                </div>
                <div className="option-item">
                  <Button
                    className="btn-width"
                    size="sm"
                    onClick={() => deleteRound(index)}
                    variant="danger"
                    disabled={roundSettings.length === 1 ? true : false}
                  >
                    -
                  </Button>
                </div>
              </div>
            )
          )}
          <button className="start-button btn-grad " onClick={startGame}>
            Start Game
          </button>
        </div>
      );
    }