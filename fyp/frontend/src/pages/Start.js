import React from 'react';

const YourComponent = ({ socket }) => {
  const createGame = () => {
    const data = { name: 'test' };
    socket.emit('create-game', data, (response) => {
      console.log(response.status);
    });
  };

  const quickPlay = () => {
    // implement later
  };

  const test = () => {
    socket.emit('test');
  };

  const playNote = () => {
    socket.emit('play-note');
  }

  return (
    <div>
      <button onClick={createGame}>Create Game</button>
      <button onClick={quickPlay}>Quickplay</button>
      <button onClick={test}>List Games</button>
    </div>
  );
};

export default YourComponent;