import { atom, useSetRecoilState } from 'recoil';

import { Maybe, Tildeling } from '@io/graphql';
import { fjernTildeling, opprettTildeling } from '@io/graphql/tildeling/endreTildeling';
import { useAddVarsel, useRemoveVarsel } from '@state/varsler';
import { InfoAlert } from '@utils/error';

type TildelingStateType = { [id: string]: Maybe<Tildeling> | undefined };

export const tildelingState = atom<TildelingStateType>({
    key: 'tildelingState',
    default: {},
});

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

export const useOpprettTildeling = (): ((oppgavereferanse: string) => Promise<Tildeling>) => {
    const setTildelinger = useSetRecoilState(tildelingState);
    const leggTilTildelingsvarsel = useLeggTilTildelingsvarsel();
    const fjernTildelingsvarsel = useFjernTildelingsvarsel();

    return (oppgavereferanse) => {
        fjernTildelingsvarsel();
        return opprettTildeling({ oppgaveId: oppgavereferanse })
            .then((response) => {
                setTildelinger({ [oppgavereferanse]: response.opprettTildeling });
                return response.opprettTildeling;
            })
            .catch(async (error: GraphQLRequestError) => {
                if (error.response.errors[0].extensions.code.value === 409) {
                    const { oid, navn, epost, reservert } = error.response.errors[0].extensions.tildeling;
                    setTildelinger((it) => ({
                        ...it,
                        [oppgavereferanse]: { oid, navn, epost, reservert },
                    }));
                    leggTilTildelingsvarsel(
                        `${error.response.errors[0].extensions.tildeling.navn} har allerede tatt saken.`,
                    );
                    return Promise.reject(oppgavereferanse);
                } else {
                    leggTilTildelingsvarsel('Kunne ikke tildele sak.');
                    return Promise.reject('Kunne ikke tildele sak.');
                }
            });
    };
};

type GraphQLRequestError = {
    response: { errors: [{ message: string; extensions: { code: { value: number }; tildeling: Tildeling } }] };
};

export const useFjernTildeling = (): ((oppgavereferanse: string) => Promise<boolean>) => {
    const setTildelinger = useSetRecoilState(tildelingState);
    const leggTilTildelingsvarsel = useLeggTilTildelingsvarsel();
    const fjernTildelingsvarsel = useFjernTildelingsvarsel();

    return (oppgavereferanse) => {
        fjernTildelingsvarsel();
        return fjernTildeling({ oppgaveId: oppgavereferanse })
            .then((result) => {
                setTildelinger({ [oppgavereferanse]: undefined });
                return result;
            })
            .catch(() => {
                leggTilTildelingsvarsel('Kunne ikke fjerne tildeling av sak.');
                return Promise.reject('Kunne ikke fjerne tildeling av sak.');
            });
    };
};
