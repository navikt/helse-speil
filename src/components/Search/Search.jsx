import React, { useContext, useRef } from 'react';
import BehandlingerContext from '../../context/BehandlingerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { behandlingerFor } from '../../io/http';
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
            behandlingerFor(value)
                .then(response => {
                    behandlingerCtx.setBehandlinger({ behandlinger: response });
                })
                .catch(err => {
                    console.log(err); // eslint-disable-line no-console
                });
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
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </div>
    );
};

export default Search;
