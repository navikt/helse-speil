import { atom, useRecoilState } from 'recoil';

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
    const [tildelinger, setTildelinger] = useRecoilState(tildelingState);
    const leggTilTildelingsvarsel = useLeggTilTildelingsvarsel();
    const fjernTildelingsvarsel = useFjernTildelingsvarsel();

    return (oppgavereferanse) => {
        fjernTildelingsvarsel();
        return opprettTildeling({ oppgaveId: oppgavereferanse })
            .then((response) => {
                setTildelinger({ ...tildelinger, [oppgavereferanse]: response.opprettTildeling });
                return response.opprettTildeling;
            })
            .catch(async (error: GraphQLRequestError) => {
                if (error.response.errors[0].extensions.code.value === 409) {
                    const { oid, navn, epost, reservert, paaVent } = error.response.errors[0].extensions.tildeling;
                    setTildelinger({
                        ...tildelinger,
                        [oppgavereferanse]: { oid, navn, epost, reservert, paaVent },
                    });
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
    const [tildelinger, setTildelinger] = useRecoilState(tildelingState);
    const leggTilTildelingsvarsel = useLeggTilTildelingsvarsel();
    const fjernTildelingsvarsel = useFjernTildelingsvarsel();

    return (oppgavereferanse) => {
        fjernTildelingsvarsel();
        return fjernTildeling({ oppgaveId: oppgavereferanse })
            .then((result) => {
                setTildelinger({ ...tildelinger, [oppgavereferanse]: null });
                return result;
            })
            .catch(() => {
                leggTilTildelingsvarsel('Kunne ikke fjerne tildeling av sak.');
                return Promise.reject('Kunne ikke fjerne tildeling av sak.');
            });
    };
};
