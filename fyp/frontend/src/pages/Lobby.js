// import React from 'react';

// const Lobby = () => {
//   return (
//     <div>
//       <h2>Lobby Page</h2>
//       {/* Add content for the About page here */}
//     </div>
//   );
// };

// export default Lobby;

import React, { useState } from 'react';

const GameForm = () => {
  const [formData, setFormData] = useState({
    players: '1',
    guessTime: '5',
    rounds: '3',
    referenceNote: 'yes',
    sharpFlat: 'yes',
    notes: false,
    chords: false,
    scales: false,
    intervals: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the form data as needed (e.g., send it to the server)
    console.log('Form Data:', formData);
  };

  const handleStartClick = () => {
    // Handle the Start button click event
    console.log('Start button clicked');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="players">Players</label>
        <select name="players" id="players" value={formData.players} onChange={handleInputChange}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <br />
        <label htmlFor="guessTime">Guess Time</label>
        <select name="guessTime" id="guessTime" value={formData.guessTime} onChange={handleInputChange}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
        <br />
        <label htmlFor="rounds">Rounds</label>
        <select name="rounds" id="rounds" value={formData.rounds} onChange={handleInputChange}>
          <option value="3">3</option>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
        <br />
        <label htmlFor="referenceNote">Reference Note</label>
        <select name="referenceNote" id="referenceNote" value={formData.referenceNote} onChange={handleInputChange}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <br />
        <label htmlFor="sharpFlat">Sharp/Flat</label>
        <select name="sharpFlat" id="sharpFlat" value={formData.sharpFlat} onChange={handleInputChange}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <br />
        <p>Types</p>
        <label htmlFor="notes">Notes</label>
        <input type="checkbox" name="notes" id="notes" checked={formData.notes} onChange={handleInputChange} />
        <br />
        <label htmlFor="chords">Chords</label>
        <input type="checkbox" name="chords" id="chords" checked={formData.chords} onChange={handleInputChange} />
        <br />
        <label htmlFor="scales">Scales</label>
        <input type="checkbox" name="scales" id="scales" checked={formData.scales} onChange={handleInputChange} />
        <br />
        <label htmlFor="intervals">Intervals</label>
        <input type="checkbox" name="intervals" id="intervals" checked={formData.intervals} onChange={handleInputChange} />
        <br />
        <input type="submit" value="Submit" />
      </form>

      <button onClick={handleStartClick}>Start</button>
    </div>
  );
};

export default GameForm;