import React, { useContext, useEffect, useRef, useState } from 'react';
import SearchIcon from './SearchIcon';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import useLinks, { pages } from '../../hooks/useLinks';
import { Keys } from '../../hooks/useKeyboard';
import { useHistory } from 'react-router';
import { PersonContext } from '../../context/PersonContext';
import { EasterEggContext } from '../../context/EasterEggContext';
import './Search.less';

const useNavigateAfterSearch = () => {
    const history = useHistory();
    const links = useLinks();
    const { personTilBehandling } = useContext(PersonContext);
    const [shouldNavigate, setShouldNavigate] = useState(false);

    const doNavigate =
        personTilBehandling &&
        links &&
        shouldNavigate &&
        history.location.pathname.indexOf(pages.SYKMELDINGSPERIODE) < 0;

    useEffect(() => {
        if (doNavigate) {
            history.push(links[pages.SYKMELDINGSPERIODE]);
            setShouldNavigate(false);
        }
    }, [doNavigate]);

    return { setShouldNavigate };
};

const Search = () => {
    const ref = useRef();
    const { activate: activateInfotrygd } = useContext(EasterEggContext);
    const { hentPerson } = useContext(PersonContext);
    const { setShouldNavigate } = useNavigateAfterSearch();

    const keyTyped = event => {
        const isEnter = (event.charCode || event.keyCode) === Keys.ENTER;
        if (isEnter) {
            search(event.target.value);
        }
    };

    const search = value => {
        if (value.trim().toLowerCase() === 'infotrygd') {
            activateInfotrygd();
        } else if (value.trim().length !== 0) {
            hentPerson(value).then(() => {
                setShouldNavigate(true);
            });
        }
    };

    return (
        <div className="Search">
            <div className="SearchField">
                <input ref={ref} type="text" placeholder="Søk" onKeyPress={keyTyped} />
                <button onClick={() => search(ref.current.value)}>
                    <SearchIcon />
                </button>
            </div>
            <div className="Search__hjelpetekst">
                <Hjelpetekst tittel="" type="under-hoyre">
                    Du kan søke på fødselsnummer, aktørId eller utbetalingsreferanse. Søkefeltet
                    skjønner hva du søker på basert på lengden.
                </Hjelpetekst>
            </div>
        </div>
    );
};

export default Search;
