import { useEffect, useState, useContext } from 'react';
import { PersonContext } from '../context/PersonContext';

export const pages = {
    SYKMELDINGSPERIODE: 'sykmeldingsperiode',
    SYKDOMSVILKÅR: 'sykdomsvilkår',
    INNGANGSVILKÅR: 'inngangsvilkår',
    INNTEKTSKILDER: 'inntektskilder',
    SYKEPENGEGRUNNLAG: 'sykepengegrunnlag',
    FORDELING: 'fordeling',
    UTBETALING: 'utbetaling',
    OPPSUMMERING: 'oppsummering'
};

const linkBases = {
    [pages.SYKMELDINGSPERIODE]: '/sykmeldingsperiode',
    [pages.SYKDOMSVILKÅR]: '/sykdomsvilkår',
    [pages.INNGANGSVILKÅR]: '/inngangsvilkår',
    [pages.INNTEKTSKILDER]: '/inntektskilder',
    [pages.SYKEPENGEGRUNNLAG]: '/sykepengegrunnlag',
    [pages.FORDELING]: '/fordeling',
    [pages.UTBETALING]: '/utbetaling',
    [pages.OPPSUMMERING]: '/oppsummering'
};

const buildLinks = person =>
    Object.keys(linkBases).reduce((links, key) => {
        links[key] = `${linkBases[key]}/${person.aktørId}`;
        return links;
    }, {});

const useLinks = () => {
    const [links, setLinks] = useState(undefined);

    const { personTilBehandling } = useContext(PersonContext);

    useEffect(() => {
        if (personTilBehandling !== undefined) {
            setLinks(buildLinks(personTilBehandling));
        }
    }, [personTilBehandling]);

    return links;
};

export default useLinks;
