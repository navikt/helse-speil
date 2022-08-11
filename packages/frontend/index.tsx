import React from 'react';
import { createRoot } from 'react-dom/client';

import '@navikt/ds-css';
import '@navikt/ds-css-internal';
import '@navikt/ds-tokens/dist/tokens.css';

import App from './routes/App';

import './config';

// @ts-ignore
window.global = window;

const root = createRoot(document.getElementById('root')!);

root.render(<App />);
