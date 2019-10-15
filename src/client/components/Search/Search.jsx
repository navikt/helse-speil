import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import SearchIcon from './SearchIcon';
import { Keys } from '../../hooks/useKeyboard';
import { withRouter } from 'react-router';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';
import './Search.less';

const Search = ({ history }) => {
    const ref = useRef();
    const { fetchBehandlinger, setUserMustSelectBehandling } = useContext(BehandlingerContext);
    const { resetUserFeedback } = useContext(InnrapporteringContext);

    const keyTyped = event => {
        const isEnter = (event.charCode || event.keyCode) === Keys.ENTER;
        if (isEnter) {
            search(event.target.value);
        }
    };

    const goBackToStart = behandlinger => {
        if (behandlinger && history.location.pathname !== '/sykdomsvilkår') {
            history.push('/sykdomsvilkår');
        }
    };

    const search = async value => {
        if (value.trim().length !== 0) {
            fetchBehandlinger(value).then(behandlinger => {
                if (behandlinger?.length > 1) {
                    setUserMustSelectBehandling(true);
                }
                if (behandlinger) {
                    resetUserFeedback();
                    goBackToStart(behandlinger);
                }
            });
        }
    };

    return (
        <div className="Search">
            <input ref={ref} type="text" placeholder="FNR eller aktør" onKeyPress={keyTyped} />
            <button onClick={() => search(ref.current.value)}>
                <SearchIcon />
            </button>
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
