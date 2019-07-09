import React, { useContext, useRef } from 'react';
import ErrorModal from '../widgets/modal/ErrorModal';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import { Keys } from '../../hooks/useKeyboard';
import './Search.css';

const Search = () => {
    const ref = useRef(undefined);
    const behandlingerCtx = useContext(BehandlingerContext);

    const keyTyped = event => {
        const isEnter = (event.charCode || event.keyCode) === Keys.ENTER;
        if (isEnter) {
            search(event.target.value);
        }
    };

    const search = value => {
        if (value.trim().length !== 0) {
            behandlingerCtx.fetchBehandlinger(value);
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
            <button onClick={() => search(ref.current.value)}>Søk</button>
            {behandlingerCtx.error && (
                <ErrorModal
                    errorMessage={behandlingerCtx.error}
                    onClose={() => behandlingerCtx.clearError()}
                />
            )}
        </div>
    );
};

export default Search;
