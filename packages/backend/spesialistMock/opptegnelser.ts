import { sleep } from '../devHelpers';
import { opptegnelser } from './data/opptegnelser';

let svarPåOpptegnelser = false;

export const hentOpptegnelser = async (nyesteSekvensnummer?: number): Promise<Opptegnelse[]> => {
    await sleep(100);
    if (!svarPåOpptegnelser) {
        return Promise.resolve([]);
    }
    if (nyesteSekvensnummer) {
        const opptegnelse = opptegnelser.find((opptegnelse) => opptegnelse.sekvensnummer > nyesteSekvensnummer);
        return Promise.resolve(opptegnelse ? [opptegnelse] : []);
    }

    return Promise.resolve(opptegnelser.slice(0, 2));
};

export const opprettAbonnement = async (): Promise<boolean> => {
    await sleep(400);
    blokkerSvarPåOpptegnelser();
    return Promise.resolve(true);
};

const blokkerSvarPåOpptegnelser = () => {
    svarPåOpptegnelser = false;
    setTimeout(() => {
        svarPåOpptegnelser = true;
    }, 3000);
};

type OpptegnelseType =
    | 'UTBETALING_ANNULLERING_FEILET'
    | 'FERDIGBEHANDLET_GODKJENNINGSBEHOV'
    | 'UTBETALING_ANNULLERING_OK'
    | 'NY_SAKSBEHANDLEROPPGAVE'
    | 'REVURDERING_FERDIGBEHANDLET'
    | 'REVURDERING_AVVIST'
    | 'PERSONDATA_OPPDATERT';

export type Opptegnelse = {
    aktorId: number;
    sekvensnummer: number;
    type: OpptegnelseType;
    payload: string;
};
