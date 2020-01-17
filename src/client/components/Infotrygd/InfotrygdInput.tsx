import React, { useContext, useEffect, useRef, useState } from 'react';
import useLinks, { pages as rawPages } from '../../hooks/useLinks';
import { Key } from '../../hooks/useKeyboard';
import { useHistory } from 'react-router';
import { History } from 'history';
import { EasterEggContext } from '../../context/EasterEggContext';
import './InfotrygdInput.less';

interface Props {
    onEnter: (url: string, history: History) => void;
}

const isOnlyLetters = (value: string) => value?.match(/^[a-z]+$/i);

const pages = Object.values(rawPages);

const InfotrygdInput = ({ onEnter }: Props) => {
    const history = useHistory();
    const [value, setValue] = useState('');
    const [hasFocus, setHasFocus] = useState(false);
    const currentView = pages.findIndex(path => history.location.pathname.includes(path)) ?? -1;
    const lastTabRef = useRef<HTMLSpanElement>(null);
    const links = useLinks();
    const ref = useRef<HTMLDivElement>(null);
    const { deactivate } = useContext(EasterEggContext);

    const onKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case Key.Escape:
                return deactivate();
            case Key.Left: {
                if (currentView > 0 && links) {
                    history.push(links[pages[currentView - 1]]);
                } else {
                    history.push('/');
                }
                break;
            }
            case Key.Right: {
                if (currentView < pages.length - 1 && links) {
                    history.push(links[pages[currentView + 1]]);
                }
                break;
            }
            case Key.Backspace: {
                if (hasFocus) setValue(v => v.slice(0, v.length - 1));
                break;
            }
            case Key.Enter: {
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
            ref.current?.focus();
        }
    }, [document.activeElement]);

    return (
        <div
            className="InfotrygdInput"
            ref={ref}
            tabIndex={1}
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            onClick={() => ref.current?.focus()}
        >
            {value?.toUpperCase()}
            {hasFocus && <div className="InfotrygdInput__cursor blink" />}
            <span tabIndex={1000} ref={lastTabRef} />
        </div>
    );
};

export default InfotrygdInput;
