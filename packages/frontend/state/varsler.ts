import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import { SpeilError } from '@utils/error';

export const varslerState = atom<Array<SpeilError>>({
    key: 'varslerState',
    default: [],
});

export const useVarsler = (): Array<SpeilError> => {
    return useRecoilValue(varslerState);
};

export const useAddVarsel = (): ((varsel: SpeilError) => void) => {
    const setVarsler = useSetRecoilState(varslerState);
    const removeVarsel = useRemoveVarsel();

    return (varsel: SpeilError) => {
        setVarsler((varsler) => [...varsler.filter((it) => it.name !== varsel.name), varsel]);
        if (typeof varsel.timeToLiveMS === 'number') {
            setTimeout(() => removeVarsel(varsel.name), varsel.timeToLiveMS);
        }
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
