import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import ErrorModal from '../widgets/modal/ErrorModal';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import { Keys } from '../../hooks/useKeyboard';
import './Search.less';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';
import SearchIcon from './SearchIcon';

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
                innrapportering.setKommentarer('');
                innrapportering.setGodkjent(true);
            }

            goBackToStart(data);
        }
    };

    return (
        <div className="Search">
            <input ref={ref} type="text" placeholder="FNR eller aktør" onKeyPress={keyTyped} />
            <button onClick={() => search(ref.current.value)}>
                <SearchIcon />
            </button>
            {behandlingerCtx.error && (
                <ErrorModal
                    errorMessage={behandlingerCtx.error.message}
                    onClose={
                        behandlingerCtx.error.statusCode !== 401
                            ? () => behandlingerCtx.clearError()
                            : undefined
                    }
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
