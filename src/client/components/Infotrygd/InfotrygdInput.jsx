import React, { useContext, useEffect, useRef, useState } from 'react';
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
    const lastTabRef = useRef();

    const onKeyDown = event => {
        switch (event.keyCode) {
            case Keys.ESC:
                return deactivate();
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
            case Keys.BACKSPACE: {
                if (hasFocus) setValue(v => v.slice(0, v.length - 1));
                break;
            }
            case Keys.ENTER: {
                if (hasFocus) onEnter(value?.toLowerCase(), history);
                break;
            }
            default: {
                if (hasFocus && isOnlyLetters(event.key) && event.key?.length === 1) {
                    setValue(v => v + event.key);
                }
            }
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [value, onKeyDown, hasFocus]);

    useEffect(() => {
        if (document.activeElement === lastTabRef.current) {
            ref.current.focus();
        }
    }, [document.activeElement]);

    return (
        <div
            className="InfotrygdInput"
            ref={ref}
            tabIndex={1}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            onClick={() => ref.current.focus()}
        >
            {value?.toUpperCase()}
            {hasFocus && <div className="InfotrygdInput__cursor blink" />}
            <span tabIndex={1000} ref={lastTabRef} />
        </div>
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
