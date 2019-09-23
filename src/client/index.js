import React from 'react';
import { render } from 'react-dom';
import App from './components/App.jsx';

render(<App />, document.getElementById('root'));

/* eslint-disable no-undef */
if (module.hot) {
    module.hot.accept();
}
/* eslint-enable */
