import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Keys } from '../../hooks/useKeyboard';
import './InfotrygdInput.less';
import { withRouter } from 'react-router';
import { EasterEggContext } from '../../context/EasterEggContext';

const isOnlyLetters = str => str?.match(/^[a-z]+$/i);

const InfotrygdInput = ({ onEnter, history }) => {
    const { deactivate } = useContext(EasterEggContext);
    const [value, setValue] = useState('');

    useEffect(() => {
        const onKeyDown = event => {
            if (event.keyCode === Keys.ESC) {
                deactivate();
            } else if (event.keyCode === Keys.BACKSPACE) {
                setValue(v => v.slice(0, v.length - 1));
            } else if (event.keyCode === Keys.ENTER) {
                onEnter(value?.toLowerCase(), history);
            } else if (isOnlyLetters(event.key) && event.key?.length === 1) {
                setValue(v => v + event.key);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [value]);

    return (
        <span className="InfotrygdInput">
            {value?.toUpperCase()}
            <div className="InfotrygdInput__cursor blink" />
        </span>
    );
};

InfotrygdInput.propTypes = {
    onEnter: PropTypes.func,
    history: PropTypes.shape({
        push: PropTypes.func
    })
};

export default withRouter(InfotrygdInput);
