import React from 'react';
import ReactDOM from 'react-dom';

import '@navikt/ds-css';
import '@navikt/ds-tokens/dist/tokens.css';

import App from './routes/App';
import './config';
import { createRoot } from 'react-dom/client';

window.global = window;

const root = createRoot(document.getElementById('root')!);

root.render(<App />);
