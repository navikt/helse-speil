import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Keys } from '../../hooks/useKeyboard';
import './InfotrygdInput.less';
import { withRouter } from 'react-router';
import { EasterEggContext } from '../../context/EasterEggContext';

const isOnlyLetters = str => str?.match(/^[a-z]+$/i);

const paths = [
    '/',
    '/sykdomsvilkår',
    '/inngangsvilkår',
    '/beregning',
    '/periode',
    '/utbetaling',
    '/oppsummering'
];

const InfotrygdInput = ({ onEnter, history }) => {
    const { deactivate } = useContext(EasterEggContext);
    const [value, setValue] = useState('');
    const currentView = paths.findIndex(path => path === history.location.pathname);

    const onKeyDown = useCallback(
        event => {
            switch (event.keyCode) {
                case Keys.LEFT: {
                    if (currentView > 0) {
                        history.push(paths[currentView - 1]);
                    }
                    break;
                }
                case Keys.RIGHT: {
                    if (currentView < paths.length - 1) {
                        history.push(paths[currentView + 1]);
                    }
                    break;
                }
                case Keys.ESC: {
                    deactivate();
                    break;
                }
                case Keys.BACKSPACE: {
                    setValue(v => v.slice(0, v.length - 1));
                    break;
                }
                case Keys.ENTER: {
                    onEnter(value?.toLowerCase(), history);
                    break;
                }
                default: {
                    if (isOnlyLetters(event.key) && event.key?.length === 1) {
                        setValue(v => v + event.key);
                    }
                }
            }
        },
        [history.location.pathname, value]
    );

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [value, onKeyDown]);

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
        push: PropTypes.func,
        location: PropTypes.shape({
            pathname: PropTypes.string
        })
    })
};

export default withRouter(InfotrygdInput);
