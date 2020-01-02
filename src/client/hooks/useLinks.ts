import { useContext } from 'react';
import { PersonContext } from '../context/PersonContext';
import { Person } from '../context/types';

type Links = { [key: string]: string }

export const pages = {
    SYKMELDINGSPERIODE: 'sykmeldingsperiode',
    SYKDOMSVILKÅR: 'sykdomsvilkår',
    INNGANGSVILKÅR: 'inngangsvilkår',
    INNTEKTSKILDER: 'inntektskilder',
    SYKEPENGEGRUNNLAG: 'sykepengegrunnlag',
    FORDELING: 'fordeling',
    UTBETALINGSOVERSIKT: 'utbetalingsoversikt',
    OPPSUMMERING: 'oppsummering'
};

const linkBases = {
    [pages.SYKMELDINGSPERIODE]: '/sykmeldingsperiode',
    [pages.SYKDOMSVILKÅR]: '/sykdomsvilkår',
    [pages.INNGANGSVILKÅR]: '/inngangsvilkår',
    [pages.INNTEKTSKILDER]: '/inntektskilder',
    [pages.SYKEPENGEGRUNNLAG]: '/sykepengegrunnlag',
    [pages.FORDELING]: '/fordeling',
    [pages.UTBETALINGSOVERSIKT]: '/utbetalingsoversikt',
    [pages.OPPSUMMERING]: '/oppsummering'
};

export const buildLinks = (person: Person) =>
    Object.keys(linkBases).reduce((links: Links, key) => {
        links[key] = `${linkBases[key]}/${person.aktørId}`;
        return links;
    }, {});

const useLinks = () => {
    const { personTilBehandling } = useContext(PersonContext);

    return personTilBehandling ? buildLinks(personTilBehandling) : undefined;
};

export default useLinks;
