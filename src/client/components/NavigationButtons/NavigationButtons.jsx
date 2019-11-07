import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { Knapp } from 'nav-frontend-knapper';
import { withRouter } from 'react-router';
import { useKeyboard, Keys } from '../../hooks/useKeyboard';
import './NavigationButtons.less';

const tooltip = (direction = 'right') =>
    `<span class="typo-normal NavigationButtons__tooltip ${direction}">Hurtigtast: </span>`;

const NavigationButtons = ({ history, previous, next }) => {
    const clickPrevious = () => {
        previous && history.push(previous);
    };

    const clickNext = () => {
        next && history.push(next);
    };

    useKeyboard([
        { keyCode: Keys.LEFT, action: clickPrevious, ignoreIfModifiers: true },
        { keyCode: Keys.RIGHT, action: clickNext, ignoreIfModifiers: true }
    ]);

    return (
        <>
            <ReactTooltip html={true} place="bottom" />
            <div className="NavigationButtons">
                <div data-tip={tooltip('left')}>
                    <Knapp disabled={!previous} onClick={clickPrevious}>
                        FORRIGE
                    </Knapp>
                </div>
                <div data-tip={tooltip()}>
                    <Knapp disabled={!next} onClick={clickNext}>
                        NESTE
                    </Knapp>
                </div>
            </div>
        </>
    );
};

NavigationButtons.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func
    }).isRequired,
    previous: PropTypes.string,
    next: PropTypes.string
};

export default withRouter(NavigationButtons);
