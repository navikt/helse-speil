import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { withRouter } from 'react-router';
import './Navigasjonsknapper.css';
import { useKeyboard, Keys } from '../../hooks/useKeyboard';

const Navigasjonsknapper = ({ history, previous, next }) => {
    const clickPrevious = () => {
        history.push(previous);
    };

    const clickNext = () => {
        history.push(next);
    };

    useKeyboard([
        { keyCode: Keys.LEFT, action: clickPrevious },
        { keyCode: Keys.RIGHT, action: clickNext }
    ]);

    return (
        <div className="Navigasjonsknapper">
            <Knapp disabled={!previous} onClick={clickPrevious}>
                FORRIGE
            </Knapp>
            <Knapp disabled={!next} onClick={clickNext}>
                NESTE
            </Knapp>
        </div>
    );
}

Navigasjonsknapper.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func
    }).isRequired,
    previous: PropTypes.string,
    next: PropTypes.string
};

export default withRouter(Navigasjonsknapper);
