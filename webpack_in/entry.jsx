console.log("JSX entry logic.");


import React from 'react';
import ReactDOM from 'react-dom';

import ColorSelector from './color_selector.jsx';
import HelloWidget from './hello_widget.jsx';
import ListWidget from './list_widget.jsx';
import TextWidget from './text_widget.jsx';


ReactDOM.render(
    <div>
      <HelloWidget />
      <TextWidget />
      <ListWidget />
      <ColorSelector />
    </div>,
    document.getElementById('react-app'));
