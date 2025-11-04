import dayjs from 'dayjs';

import { BehandledeOppgaver, BehandletOppgave } from '../schemaTypes';
import { behandledeOppgaver } from './behandledeOppgaver';
import { tilfeldigeBehandledeOppgaver } from './mockDataGenerator';

export const behandledeOppgaverliste = (
    offset: number,
    limit: number,
    fom: string,
    tom: string,
): BehandledeOppgaver => {
    const behandledeOppgaverliste = behandledeOppgaver.concat(tilfeldigeBehandledeOppgaver);
    const filtrertList = filtrerBehandlede(behandledeOppgaverliste, fom, tom);

    const oppgaverEtterOffset =
        offset === 0 ? filtrertList.slice(0, limit) : filtrertList.slice(offset).slice(0, limit);

    return {
        oppgaver: oppgaverEtterOffset,
        // Dette er sånn spesialist fungerer pt dessverre. Skulle egentlig hatt antallet filtrerte oppgaver
        // før offset er applied, selvom det er 0 oppgaver på den siste siden
        totaltAntallOppgaver: oppgaverEtterOffset.length > 0 ? filtrertList.length : 0,
    } as BehandledeOppgaver;
};

const filtrerBehandlede = (oppgaver: BehandletOppgave[], fom: string, tom: string): BehandletOppgave[] => {
    return oppgaver.filter((oppgave) => {
        const ferdigstiltDato = dayjs(oppgave.ferdigstiltTidspunkt);
        return ferdigstiltDato.isSameOrAfter(dayjs(fom), 'day') && ferdigstiltDato.isSameOrBefore(dayjs(tom), 'day');
    });
};
