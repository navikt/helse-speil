import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SearchIcon from './SearchIcon';
import { Keys } from '../../hooks/useKeyboard';
import useLinks, { pages } from '../../hooks/useLinks';
import { withRouter } from 'react-router';
import { PersonContext } from '../../context/PersonContext';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';
import './Search.less';
import { EasterEggContext } from '../../context/EasterEggContext';

const Search = ({ history }) => {
    const ref = useRef();
    const [fetchPerformed, setFetchPerformed] = useState(false);
    const links = useLinks();
    const { activate } = useContext(EasterEggContext);
    const { hentPerson, personTilBehandling } = useContext(PersonContext);
    const { resetUserFeedback } = useContext(InnrapporteringContext);

    const keyTyped = event => {
        const isEnter = (event.charCode || event.keyCode) === Keys.ENTER;
        if (isEnter) {
            search(event.target.value);
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

    const search = async value => {
        if (value.trim().toLowerCase() === 'infotrygd') {
            activate();
        } else if (value.trim().length !== 0) {
            hentPerson(value).then(person => {
                if (person) {
                    resetUserFeedback();
                    setFetchPerformed(true);
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
