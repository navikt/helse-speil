import React from 'react';
import { render } from 'react-dom';

import '@navikt/ds-css';
import '@navikt/ds-tokens/dist/tokens.css';

import App from './routes/App';
import './config';

window.global = window;

render(<App />, document.getElementById('root'));
