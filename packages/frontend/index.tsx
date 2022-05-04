import React from 'react';

import '@navikt/ds-css';
import '@navikt/ds-tokens/dist/tokens.css';
import './config';

import App from './routes/App';
import { createRoot } from 'react-dom/client';

window.global = window;

const root = createRoot(document.getElementById('root')!);

root.render(<App />);
