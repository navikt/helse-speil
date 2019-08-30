import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import ErrorModal from '../widgets/modal/ErrorModal';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import { Keys } from '../../hooks/useKeyboard';
import './Search.css';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';

const SearchIcon = () => (
    <svg
        version="1.1"
        id="Filled_Version"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="16px"
        height="16px"
        viewBox="0 0 24 24"
        enableBackground="new 0 0 24 24"
        xmlSpace="preserve"
    >
        <g>
            <path
                fill="#fff"
                d="M9,18c2.131,0,4.09-0.75,5.633-1.992l7.658,7.697c0.389,0.393,1.021,0.395,1.414,0.004s0.393-1.023,0.004-1.414
                l-7.668-7.707C17.264,13.053,18,11.111,18,9c0-4.963-4.037-9-9-9S0,4.037,0,9S4.037,18,9,18z M9,2c3.859,0,7,3.139,7,7
                c0,3.859-3.141,7-7,7c-3.861,0-7-3.141-7-7C2,5.139,5.139,2,9,2z"
            />
        </g>
    </svg>
);

const Search = ({ history }) => {
    const ref = useRef(undefined);
    const behandlingerCtx = useContext(BehandlingerContext);
    const innrapportering = useContext(InnrapporteringContext);

    const keyTyped = event => {
        const isEnter = (event.charCode || event.keyCode) === Keys.ENTER;
        if (isEnter) {
            search(event.target.value);
        }
    };

    const goBackToStart = newData => {
        if (newData?.behandlinger && history.location.pathname !== '/') {
            history.push('/');
        }
    };

    const search = async value => {
        if (value.trim().length !== 0) {
            const data = await behandlingerCtx.fetchBehandlinger(value);

            if (data?.behandlinger?.length > 0) {
                innrapportering.setUenigheter([]);
                innrapportering.setHasSendt(false);
                await innrapportering.fetchFeedback(
                    data.behandlinger[0].behandlingsId
                );
            }

            goBackToStart(data);
        }
    };

    return (
        <div className="Search">
            <input
                ref={ref}
                type="text"
                placeholder="FNR eller aktør"
                onKeyPress={keyTyped}
            />
            <button onClick={() => search(ref.current.value)}>
                <SearchIcon />
            </button>
            {behandlingerCtx.error && (
                <ErrorModal
                    errorMessage={behandlingerCtx.error}
                    onClose={() => behandlingerCtx.clearError()}
                />
            )}
        </div>
    );
};

Search.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};
export default withRouter(Search);
