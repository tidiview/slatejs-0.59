import * as React from 'react';
import { render } from 'react-dom';
import SlateEditor from './components/SlateEditor';
import { cx, css } from '@emotion/css';

import './styles.css';

function App() {
  return (
    <div className='App'>
      <div
        className={cx(css`
          max-width: 50em;
          background: #f8f8f8;
          margin: 20px auto;
          padding: 20px;
        `)}
      >
        <SlateEditor editorTitle='Slate editor' />
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
render(<App />, rootElement);