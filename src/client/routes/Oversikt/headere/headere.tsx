import React, { Dispatch, SetStateAction } from 'react';
import { Header } from './Header';
import { Oppgavefilter, sorterbareKolonner } from '../oversiktState';
import { FiltrerbarHeader } from './FiltrerbarHeader';
import { Oppgave, OppgaveType } from '../../../../types';
import { SorterbarHeader } from './SorterbarHeader';

export const SøkerHeader = () => <Header widthInPixels={265}>Søker</Header>;

export const StatusHeader = () => <Header widthInPixels={120}>Status</Header>;

export const TildelingHeader = () => <SorterbarHeader tittel="Tildelt" kolonne={sorterbareKolonner.tildelt} />;

interface SakstypeHeaderProps {
    filtere: Oppgavefilter[];
    setFiltere: Dispatch<SetStateAction<Oppgavefilter[]>>;
}

const filterSakstype = (...filtere: OppgaveType[]) => (oppgave: Oppgave) => filtere.includes(oppgave.type);
const filterFørstegangsbehandlinger = filterSakstype(OppgaveType.Førstegangsbehandling);
const filterForlengelser = filterSakstype(OppgaveType.Forlengelse, OppgaveType.Infotrygdforlengelse);
const filterOvergangFraInfotrygd = filterSakstype(OppgaveType.OvergangFraInfotrygd);

export const SakstypeHeader = ({ filtere, setFiltere }: SakstypeHeaderProps) => {
    const sakstypefiltere = [
        {
            label: 'Førstegang.',
            oppgavefilter: filterFørstegangsbehandlinger,
            active: filtere.includes(filterFørstegangsbehandlinger),
        },
        {
            label: 'Forlengelse',
            oppgavefilter: filterForlengelser,
            active: filtere.includes(filterForlengelser),
        },
        {
            label: 'Overgang fra IT',
            oppgavefilter: filterOvergangFraInfotrygd,
            active: filtere.includes(filterOvergangFraInfotrygd),
        },
    ];

    return (
        <FiltrerbarHeader widthInPixels={200} filtere={sakstypefiltere} onSetFiltere={setFiltere}>
            Sakstype
        </FiltrerbarHeader>
    );
};

export const OpprettetHeader = () => (
    <SorterbarHeader tittel="Opprettet" kolonne={sorterbareKolonner.opprettet} widthInPixels={100} />
);
