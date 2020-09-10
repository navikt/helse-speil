import { Person } from '../context/types.internal';
import { getOppgavereferanse } from './http';

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms));

export const pollEtterNyOppgave = async (fødselsnummer: string, oppgavereferanse: string): Promise<Person | void> => {
    for (let _ = 0; _ < 10; _++) {
        await delay(1000);
        const nyOppgavereferanse = await getOppgavereferanse(fødselsnummer)
            .then((response) => response.data.oppgavereferanse)
            .catch((error) => {
                if (error.statusCode >= 500) {
                    console.error(error);
                }
            });

        if (nyOppgavereferanse && nyOppgavereferanse !== oppgavereferanse) {
            return Promise.resolve();
        }
    }
    return Promise.reject();
};
