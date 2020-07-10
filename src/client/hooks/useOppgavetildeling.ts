import { deleteTildeling, postTildeling, SpeilResponse } from '../io/http';
import { capitalizeName, extractNameFromEmail } from '../utils/locale';
import { useUpdateVarsler } from '../state/varslerState';
import { Varseltype } from '@navikt/helse-frontend-varsel';

interface Oppgavetildeling {
    tildelOppgave: (oppgavereferanse: string, userId: string) => Promise<SpeilResponse | string>;
    fjernTildeling: (oppgavereferanse: string) => Promise<Response | void>;
}

export const useOppgavetildeling = (): Oppgavetildeling => {
    const { leggTilVarsel, fjernVarsler } = useUpdateVarsler();

    const tildelOppgave = (oppgavereferanse: string, userId: string): Promise<SpeilResponse | string> => {
        fjernVarsler();
        return postTildeling({ oppgavereferanse, userId }).catch((error) => {
            let assignedUser;
            try {
                assignedUser = JSON.parse(error.message).alreadyAssignedTo;
            } catch {
                assignedUser = error.message?.alreadyAssignedTo;
            }
            if (assignedUser) {
                leggTilVarsel({
                    message: `${capitalizeName(extractNameFromEmail(assignedUser))} har allerede tatt saken.`,
                    type: Varseltype.Advarsel,
                });
            } else {
                leggTilVarsel({ message: 'Kunne ikke tildele sak.', type: Varseltype.Advarsel });
            }
            return Promise.reject(assignedUser);
        });
    };

    const fjernTildeling = (oppgavereferanse: string) => {
        fjernVarsler();
        return deleteTildeling(oppgavereferanse).catch((error) => {
            leggTilVarsel({ message: 'Kunne ikke fjerne tildeling av sak.', type: Varseltype.Advarsel });
            console.error(error);
        });
    };

    return {
        tildelOppgave,
        fjernTildeling,
    };
};
