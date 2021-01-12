import { Oppgave, Periodetype } from '../../../types';

export const førstegangsfilter = () => ({
    label: 'Førstegang.',
    func: (type: Periodetype) => type === Periodetype.Førstegangsbehandling,
});

export const forlengelsesfilter = () => ({
    label: 'Forlengelse',
    func: (type: Periodetype) => [Periodetype.Infotrygdforlengelse, Periodetype.Forlengelse].includes(type),
});

export const overgangFraInfotrygdFilter = () => ({
    label: 'Overgang fra IT',
    func: (type: Periodetype) => type === Periodetype.OvergangFraInfotrygd,
});

export const ufordelteOppgaverFilter = () => ({
    label: 'Ufordelte saker',
    func: (oppgave: Oppgave) => !oppgave?.tildeltTil,
});

export const stikkprøveFilter = () => ({
    label: 'Stikkprøver',
    func: (type: Periodetype) => type === Periodetype.Stikkprøve,
});
