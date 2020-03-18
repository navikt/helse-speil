import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Knapp } from 'nav-frontend-knapper';
import { Key, useKeyboard } from '../../hooks/useKeyboard';
import './NavigationButtons.less';
import classNames from 'classnames';
import { useNavigation } from '../../hooks/useNavigation';

interface Props {
    previous?: string;
    next?: string;
    className?: string;
}

const tooltip = (direction = 'right') =>
    `<p class="typo-normal NavigationButtons__tooltip ${direction}">Hurtigtast: </p>`;

const NavigationButtons = ({ className }: Props) => {
    const { navigateToNext, navigateToPrevious } = useNavigation();

    const clickPrevious = () => {
        navigateToPrevious?.();
    };

    const clickNext = () => {
        navigateToNext?.();
    };

    useKeyboard({
        [Key.Left]: { action: clickPrevious, ignoreIfModifiers: true },
        [Key.Right]: { action: clickNext, ignoreIfModifiers: true }
    });

    return (
        <>
            <ReactTooltip html={true} place="bottom" />
            <div className={classNames('NavigationButtons', className)}>
                <div data-tip={navigateToPrevious && tooltip('left')}>
                    <Knapp disabled={!navigateToPrevious} onClick={clickPrevious}>
                        FORRIGE
                    </Knapp>
                </div>
                <div data-tip={navigateToNext && tooltip()}>
                    <Knapp disabled={!navigateToNext} onClick={clickNext}>
                        NESTE
                    </Knapp>
                </div>
            </div>
        </>
    );
};

export default NavigationButtons;
