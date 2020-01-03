import React, { useContext, useRef } from 'react';
import SearchIcon from './SearchIcon';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { Keys } from '../../hooks/useKeyboard';
import { PersonContext } from '../../context/PersonContext';
import { EasterEggContext } from '../../context/EasterEggContext';
import { useNavigateAfterSearch } from './useNavigateAfterSearch';
import './Search.less';
import { PopoverOrientering } from 'nav-frontend-popover';

const Search = () => {
    const ref = useRef<HTMLInputElement>(null);
    const { activate: activateInfotrygd } = useContext(EasterEggContext);
    const { hentPerson } = useContext(PersonContext);
    const { setShouldNavigate } = useNavigateAfterSearch();

    const keyTyped = (event: React.KeyboardEvent) => {
        const target = event.target as HTMLInputElement;
        if (event.key === Keys.ENTER && target.value) {
            search(target.value);
        }
    };

    const search = (value?: string) => {
        if (value === undefined) return;
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
                <input ref={ref} type="text" placeholder="Søk" onKeyDown={keyTyped} />
                <button onClick={() => search(ref?.current?.value)}>
                    <SearchIcon />
                </button>
            </div>
            <div className="Search__hjelpetekst">
                <Hjelpetekst tittel="" type={PopoverOrientering.UnderHoyre}>
                    Du kan søke på fødselsnummer, aktørId eller utbetalingsreferanse. Søkefeltet
                    skjønner hva du søker på basert på lengden.
                </Hjelpetekst>
            </div>
        </div>
    );
};

export default Search;
