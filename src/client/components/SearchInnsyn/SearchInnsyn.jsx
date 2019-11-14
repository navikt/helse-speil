import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '../Search/SearchIcon';
import { Keys } from '../../hooks/useKeyboard';
import useLinks, { pages } from '../../hooks/useLinks';
import { withRouter } from 'react-router';
import { PersonContext } from '../../context/PersonContext';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';
import './SearchInnsyn.less';

const SearchInnsyn = ({ history }) => {
    const ref = useRef();
    const [fetchPerformed, setFetchPerformed] = useState(false);
    const links = useLinks();
    const { hentPerson, personTilBehandling } = useContext(PersonContext);
    const { resetUserFeedback } = useContext(InnrapporteringContext);

    const keyTyped = event => {
        const isEnter = (event.charCode || event.keyCode) === Keys.ENTER;
        if (isEnter) {
            searchInnsyn(event.target.value);
        }
    };

    useEffect(() => {
        if (
            personTilBehandling &&
            links &&
            fetchPerformed &&
            history.location.pathname.indexOf(pages.SYKMELDINGSPERIODE) < 0
        ) {
            history.push(links[pages.SYKMELDINGSPERIODE]);
            setFetchPerformed(false);
        }
    }, [fetchPerformed, links, personTilBehandling]);

    const searchInnsyn = async value => {
        if (value.trim().length !== 0) {
            hentPerson(value, true).then(person => {
                if (person) {
                    resetUserFeedback();
                    setFetchPerformed(true);
                }
            });
        }
    };

    return (
        <div className="Search">
            <input ref={ref} type="text" placeholder="Utbetalingsreferanse" onKeyPress={keyTyped} />
            <button onClick={() => searchInnsyn(ref.current.value)}>
                <SearchIcon />
            </button>
        </div>
    );
};

SearchInnsyn.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};
export default withRouter(SearchInnsyn);
