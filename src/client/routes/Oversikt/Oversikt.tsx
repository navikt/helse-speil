import React, { useContext, useEffect } from 'react';
import Varsel, { Varseltype } from '@navikt/helse-frontend-varsel';
import styled from '@emotion/styled';
import Panel from 'nav-frontend-paneler';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { useLocation } from 'react-router-dom';
import { SuksessToast } from '../../components/Toast';
import { PersonContext } from '../../context/PersonContext';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { OppgaverContext } from '../../context/OppgaverContext';
import { Tabell, useTabell } from '@navikt/helse-frontend-tabell';
import { Oppgave, OppgaveType } from '../../../types';
import { Scopes, useVarselFilter } from '../../state/varslerState';
import { filtreringState, sorteringState } from './state';
import { oversiktsradRenderer, tilOversiktsrad } from './Oversikt.rader';

const Container = styled(Panel)`
    margin: 1rem;
    padding: 1rem;
    color: #3e3832;
    max-width: max-content;
`;

const LasterInnhold = styled.div`
    display: flex;
    align-items: center;
    margin-left: 1rem;
    margin-top: 1rem;
    svg {
        margin-right: 1rem;
        width: 25px;
        height: 25px;
    }
`;

const Oversiktstabell = styled(Tabell)`
    max-width: unset;
    tbody tr td {
        white-space: nowrap;
        height: 48px;
    }
`;

const sorterTall = (a: number, b: number) => a - b;

const sorterDateString = (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime();

const sorterTekstAlfabetisk = (a: string, b: string) => a.localeCompare(b, 'nb-NO');

const sorterTildeltTil = (a: Oppgave, b: Oppgave) =>
    a.tildeltTil ? (b.tildeltTil ? a.tildeltTil.localeCompare(b.tildeltTil, 'nb-NO') : -1) : b.tildeltTil ? 1 : 0;

const førstegangsfilter = () => ({
    label: 'Førstegang.',
    func: (type: OppgaveType) => type === OppgaveType.Førstegangsbehandling,
});

const forlengelsesfilter = () => ({
    label: 'Forlengelse',
    func: (type: OppgaveType) => [OppgaveType.Infotrygdforlengelse, OppgaveType.Forlengelse].includes(type),
});

const overgangFraInfotrygdFilter = () => ({
    label: 'Overgang fra IT',
    func: (type: OppgaveType) => type === OppgaveType.OvergangFraInfotrygd,
});

export const Oversikt = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const { isFetching: isFetchingPersonBySearch } = useContext(PersonContext);
    const { oppgaver, hentOppgaver, isFetchingOppgaver, error: oppgaverContextError } = useContext(OppgaverContext);
    const [defaultFiltrering, setDefaultFiltrering] = useRecoilState(filtreringState);
    const [defaultSortering, setDefaultSortering] = useRecoilState(sorteringState);

    useVarselFilter(Scopes.OVERSIKT);

    useEffect(() => {
        hentOppgaver();
    }, [location.key]);

    const headere = [
        'Søker',
        {
            render: 'Sakstype',
            filtere: [førstegangsfilter(), forlengelsesfilter(), overgangFraInfotrygdFilter()],
        },
        { render: 'Status', sortFunction: sorterTall },
        { render: 'Bokommune', sortFunction: sorterTekstAlfabetisk },
        { render: 'Opprettet', sortFunction: sorterDateString },
        { render: 'Tildelt', sortFunction: sorterTildeltTil },
    ];

    const rader = oppgaver.map(tilOversiktsrad);
    const renderer = oversiktsradRenderer;
    const tabell = useTabell({ rader, headere, renderer, defaultSortering, defaultFiltrering });

    useEffect(() => {
        setDefaultSortering(tabell.sortering);
    }, [tabell.sortering]);

    useEffect(() => {
        setDefaultFiltrering(tabell.filtrering);
    }, [tabell.filtrering]);

    return (
        <>
            <SuksessToast />
            {isFetchingOppgaver && (
                <LasterInnhold>
                    <NavFrontendSpinner type="XS" />
                    Henter personer
                </LasterInnhold>
            )}
            {isFetchingPersonBySearch && (
                <LasterInnhold>
                    <NavFrontendSpinner type="XS" />
                    Henter person
                </LasterInnhold>
            )}
            {oppgaverContextError && <Varsel type={Varseltype.Feil}>{oppgaverContextError.message}</Varsel>}
            <Container border>
                <Undertittel>{t('oversikt.tittel')}</Undertittel>
                <Oversiktstabell beskrivelse="Saker som er klare for behandling" {...tabell} />
            </Container>
        </>
    );
};
