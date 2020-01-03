import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

declare const module: any;

if (module.hot) {
    module.hot.accept();
}

render(<App />, document.getElementById('root'));
