import { useDeleteTildeling, usePutTildeling } from '@io/rest/generated/personer/personer';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { InfoAlert } from '@utils/error';

class TildelingAlert extends InfoAlert {
    name = 'tildeling';
}

const useFjernTildelingsvarsel = () => {
    const removeVarsel = useRemoveVarsel();
    return () => removeVarsel('tildeling');
};

const useLeggTilTildelingsvarsel = () => {
    const addVarsel = useAddVarsel();
    return (message: string) => addVarsel(new TildelingAlert(message));
};

export const useTildel = (): [
    (personPseudoId: string, onUtført: () => void) => Promise<void>,
    { loading: boolean },
] => {
    const { mutate, isPending } = usePutTildeling();
    const saksbehandler = useInnloggetSaksbehandler();
    const leggTilTildelingsvarsel = useLeggTilTildelingsvarsel();
    const fjernTildelingsvarsel = useFjernTildelingsvarsel();

    const tildel = async (personPseudoId: string, onUtført: () => void) => {
        fjernTildelingsvarsel();
        return mutate(
            {
                pseudoId: personPseudoId,
                data: {
                    navident: saksbehandler.ident,
                },
            },
            {
                onError: (error) => {
                    const code = error.response.data.code;
                    if (code === 'OPPGAVE_TILDELT_ANNEN_SAKSBEHANDLER') {
                        leggTilTildelingsvarsel(`Oppgaven er allerede tildelt en annen saksbehandler.`);
                    } else if (code === 'MANGLER_TILGANG_TIL_PERSON') {
                        leggTilTildelingsvarsel(`Du har ikke tilgang til personen.`);
                    } else if (code === 'MANGLER_TILGANG_TIL_OPPGAVE') {
                        leggTilTildelingsvarsel(`Du har ikke tilgang til oppgaven.`);
                    } else if (code === 'PERSON_PSEUDO_ID_IKKE_FUNNET') {
                        leggTilTildelingsvarsel(`Systemet fant ikke personen du prøver å tildele oppgave for.`);
                    } else {
                        leggTilTildelingsvarsel('Kunne ikke tildele oppgave.');
                    }
                },
                onSettled: onUtført,
            },
        );
    };
    return [tildel, { loading: isPending }];
};
export const useAvmeld = (): [
    (personPseudoId: string, onUtført: () => void) => Promise<void>,
    { loading: boolean },
] => {
    const { mutate, isPending } = useDeleteTildeling();

    const leggTilTildelingsvarsel = useLeggTilTildelingsvarsel();
    const fjernTildelingsvarsel = useFjernTildelingsvarsel();

    const avmeld = async (personPseudoId: string, onUtført: () => void) => {
        fjernTildelingsvarsel();
        return mutate(
            {
                pseudoId: personPseudoId,
            },
            {
                onError: (error) => {
                    const code = error.response.data.code;
                    if (code === 'MANGLER_TILGANG_TIL_PERSON') {
                        leggTilTildelingsvarsel(`Du har ikke tilgang til personen.`);
                    } else if (code === 'OPPGAVE_IKKE_FUNNET') {
                        leggTilTildelingsvarsel(`Systemet fant ikke oppgaven du forsøkte å avmelde`);
                    } else {
                        leggTilTildelingsvarsel('Kunne ikke avmelde oppgave.');
                    }
                },
                onSettled: onUtført,
            },
        );
    };
    return [avmeld, { loading: isPending }];
};
