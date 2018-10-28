console.log("JSX entry logic.");


import React from 'react';
import ReactDOM from 'react-dom';

import GameBoard from './game_board.jsx';


ReactDOM.render(
    <div>
      <GameBoard />
    </div>,
    document.getElementById('react-app'));
