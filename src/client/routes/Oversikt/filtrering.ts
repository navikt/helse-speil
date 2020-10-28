import { Oppgave, OppgaveType } from '../../../types';

export const førstegangsfilter = () => ({
    label: 'Førstegang.',
    func: (type: OppgaveType) => type === OppgaveType.Førstegangsbehandling,
});

export const forlengelsesfilter = () => ({
    label: 'Forlengelse',
    func: (type: OppgaveType) => [OppgaveType.Infotrygdforlengelse, OppgaveType.Forlengelse].includes(type),
});

export const overgangFraInfotrygdFilter = () => ({
    label: 'Overgang fra IT',
    func: (type: OppgaveType) => type === OppgaveType.OvergangFraInfotrygd,
});

export const ufordelteOppgaverFilter = () => ({
    label: 'Ufordelte saker',
    func: (oppgave: Oppgave) => !oppgave?.tildeltTil,
});
