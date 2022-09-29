import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { SpeilError } from '@utils/error';
import { personState } from '@state/person';

const varslerState = atom<Array<SpeilError>>({
    key: 'varslerState',
    default: [],
});

const derivedVarsler = selector<Array<SpeilError>>({
    key: 'derivedVarsler',
    get: ({ get }) => {
        const personStateErrors = get(personState).errors;
        return get(varslerState).concat(personStateErrors);
    },
});

export const useVarsler = (): Array<SpeilError> => {
    return useRecoilValue(derivedVarsler);
};

export const useAddVarsel = (): ((varsel: SpeilError) => void) => {
    const setVarsler = useSetRecoilState(varslerState);

    return (varsel: SpeilError) => {
        setVarsler((varsler) => [...varsler.filter((it) => it.name !== varsel.name), varsel]);
    };
};

export const useOperationErrorHandler = (operasjon: string) => {
    const varsel: SpeilError = new SpeilError(`Det oppstod en feil. Handlingen som ikke ble utført: ${operasjon}`);

    const setVarsler = useSetRecoilState(varslerState);

    return (ex: Error) => {
        console.log(`Feil ved ${operasjon}. ${ex.message}`);
        setVarsler((varsler) => [...varsler.filter((it) => it.name !== varsel.name), varsel]);
    };
};

export const useRemoveVarsel = () => {
    const setVarsler = useSetRecoilState(varslerState);

    return (name: string) => {
        setVarsler((varsler) => varsler.filter((it) => it.name !== name));
    };
};

export const useSetVarsler = () => {
    return useSetRecoilState(varslerState);
};
