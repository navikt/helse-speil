import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { Knapp } from 'nav-frontend-knapper';
import { withRouter } from 'react-router';
import { useKeyboard, Keys } from '../../../hooks/useKeyboard';
import './Navigasjonsknapper.less';

const tooltip = (direction = 'right') =>
    `<span class="typo-normal Navigasjonsknapper__tooltip ${direction}">Hurtigtast: </span>`;

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
        <>
            <ReactTooltip html={true} place="bottom" />
            <div className="Navigasjonsknapper">
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

Navigasjonsknapper.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func
    }).isRequired,
    previous: PropTypes.string,
    next: PropTypes.string
};

export default withRouter(Navigasjonsknapper);
