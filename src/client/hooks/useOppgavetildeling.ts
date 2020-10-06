import { deleteTildeling, postTildeling, SpeilResponse } from '../io/http';
import { capitalizeName, extractNameFromEmail } from '../utils/locale';
import { useUpdateVarsler } from '../state/varslerState';
import { Varseltype } from '@navikt/helse-frontend-varsel';

type TildelingError = {
    feilkode: string;
    kildesystem: string;
    kontekst: {
        tildeltTil: string;
    };
};

const tildelingsvarsel = (message: string) => ({ message, type: Varseltype.Advarsel });

interface Oppgavetildeling {
    tildelOppgave: (oppgavereferanse: string, userId: string) => Promise<SpeilResponse | string>;
    fjernTildeling: (oppgavereferanse: string) => Promise<Response | void>;
}

export const useOppgavetildeling = (): Oppgavetildeling => {
    const { leggTilVarsel, fjernVarsler } = useUpdateVarsler();

    const tildelOppgave = (oppgavereferanse: string, userId: string): Promise<SpeilResponse | string> => {
        fjernVarsler();
        return postTildeling({ oppgavereferanse, userId }).catch(async (error) => {
            const respons: TildelingError = (await JSON.parse(error.message)) as TildelingError;
            const tildeltSaksbehandler = respons.kontekst.tildeltTil;
            if (tildeltSaksbehandler) {
                leggTilVarsel(
                    tildelingsvarsel(
                        `${capitalizeName(extractNameFromEmail(tildeltSaksbehandler))} har allerede tatt saken.`
                    )
                );
            } else {
                leggTilVarsel(tildelingsvarsel('Kunne ikke tildele sak.'));
            }
            return Promise.reject(tildeltSaksbehandler);
        });
    };

    const fjernTildeling = (oppgavereferanse: string) => {
        fjernVarsler();
        return deleteTildeling(oppgavereferanse).catch(() => {
            leggTilVarsel(tildelingsvarsel('Kunne ikke fjerne tildeling av sak.'));
        });
    };

    return {
        tildelOppgave,
        fjernTildeling,
    };
};
