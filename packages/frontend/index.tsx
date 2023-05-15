import React from 'react';
import { createRoot } from 'react-dom/client';

import '@navikt/ds-css';
import '@navikt/ds-css-internal';
import '@navikt/ds-tokens';

import './config';
import { AppWithRoutingAndState as App } from './routes/App';

window.global = window;

const root = createRoot(document.getElementById('root')!);

root.render(<App />);
