import React, { useEffect, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import { Knapp } from 'nav-frontend-knapper';
import { useHistory } from 'react-router';
import { useKeyboard, Key } from '../../hooks/useKeyboard';
import useLinks from '../../hooks/useLinks';
import './NavigationButtons.less';
import classNames from 'classnames';

interface Props {
    previous?: string;
    next?: string;
    className?: string;
}

const tooltip = (direction = 'right') =>
    `<span class="typo-normal NavigationButtons__tooltip ${direction}">Hurtigtast: </span>`;

const NavigationButtons = ({ previous, next, className }: Props) => {
    const links = useLinks();
    const history = useHistory();

    const linksRef = useRef(links);
    useEffect(() => {
        linksRef.current = links;
    }, [links]);

    const clickPrevious = () => {
        previous && linksRef.current && history.push(linksRef.current[previous]);
    };

    const clickNext = () => {
        next && linksRef.current && history.push(linksRef.current[next]);
    };

    useKeyboard({
        [Key.Left]: { action: clickPrevious, ignoreIfModifiers: true },
        [Key.Right]: { action: clickNext, ignoreIfModifiers: true }
    });

    return (
        <>
            <ReactTooltip html={true} place="bottom" />
            <div className={classNames('NavigationButtons', className)}>
                {previous && (
                    <div data-tip={tooltip('left')}>
                        <Knapp onClick={clickPrevious}>FORRIGE</Knapp>
                    </div>
                )}
                {next && (
                    <div data-tip={tooltip()}>
                        <Knapp onClick={clickNext}>NESTE</Knapp>
                    </div>
                )}
            </div>
        </>
    );
};

export default NavigationButtons;
