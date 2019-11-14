import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useLinks, { pages as rawPages } from '../../hooks/useLinks';
import PropTypes from 'prop-types';
import { Keys } from '../../hooks/useKeyboard';
import { withRouter } from 'react-router';
import { EasterEggContext } from '../../context/EasterEggContext';
import './InfotrygdInput.less';

const isOnlyLetters = str => str?.match(/^[a-z]+$/i);

const pages = Object.values(rawPages);

const InfotrygdInput = ({ onEnter, history }) => {
    const { deactivate } = useContext(EasterEggContext);
    const [value, setValue] = useState('');
    const [hasFocus, setHasFocus] = useState(false);
    const currentView = pages.findIndex(path => history.location.pathname.includes(path)) ?? -1;
    const links = useLinks();
    const ref = useRef();

    const onKeyDown = event => {
        switch (event.keyCode) {
            case Keys.LEFT: {
                if (currentView > 0) {
                    history.push(links[pages[currentView - 1]]);
                } else {
                    history.push('/');
                }
                break;
            }
            case Keys.RIGHT: {
                if (currentView < pages.length - 1) {
                    history.push(links[pages[currentView + 1]]);
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
    };

    useEffect(() => {
        if (hasFocus) {
            window.addEventListener('keydown', onKeyDown);
            return () => window.removeEventListener('keydown', onKeyDown);
        }
    }, [value, onKeyDown, hasFocus]);

    useEffect(() => {
        if (document.activeElement === document.body) {
            ref.current.focus();
        }
        console.log(document.activeElement);
    }, [document.activeElement]);

    return (
        <span
            className="InfotrygdInput"
            ref={ref}
            tabIndex={1}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
        >
            {value?.toUpperCase()}
            {hasFocus && <div className="InfotrygdInput__cursor blink" />}
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
