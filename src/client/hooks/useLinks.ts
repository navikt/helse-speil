import { useContext } from 'react';
import { PersonContext } from '../context/PersonContext';
import { Person } from '../context/types';

export type Links = { [key: string]: string };

export const pages = {
    SYKMELDINGSPERIODE: 'sykmeldingsperiode',
    INNGANGSVILKÅR: 'inngangsvilkår',
    OPPFØLGING: 'oppfølging',
    INNTEKTSKILDER: 'inntektskilder',
    SYKEPENGEGRUNNLAG: 'sykepengegrunnlag',
    FORDELING: 'fordeling',
    UTBETALINGSOVERSIKT: 'utbetalingsoversikt',
    OPPSUMMERING: 'oppsummering'
};

const linkBases = {
    [pages.SYKMELDINGSPERIODE]: '/sykmeldingsperiode',
    [pages.INNGANGSVILKÅR]: '/inngangsvilkår',
    [pages.OPPFØLGING]: '/oppfølging',
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

    const links =
        personTilBehandling &&
        Object.keys(linkBases).reduce(
            (links: Links, key) => ({
                ...links,
                [key]: `${linkBases[key]}/${personTilBehandling.aktørId}`
            }),
            {}
        );

    return personTilBehandling && buildLinks(personTilBehandling);
};

export default useLinks;
