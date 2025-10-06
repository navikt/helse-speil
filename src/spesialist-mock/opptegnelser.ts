import { Opptegnelse } from '@io/graphql';
import { opptegnelser } from '@spesialist-mock/data/opptegnelser';

import { sleep } from './constants';

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

    return Promise.resolve(opptegnelser.slice());
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
