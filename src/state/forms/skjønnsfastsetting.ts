import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { SkjønnsfastsettingFormFields } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm';
import { Skjønnsfastsettingstype } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/skjønnsfastsetting';

const skjønnsfastsettelseFormState = atom<Map<string, SkjønnsfastsettingFormFields>>(new Map());

export const useSkjønnsfastsettelseFormState = () => useAtomValue(skjønnsfastsettelseFormState);

export const useSetSkjønnsfastsettelseFormState = () => {
    const setState = useSetAtom(skjønnsfastsettelseFormState);
    return (skjæringstidspunkt: string, årsak: string, begrunnelseFritekst: string, type?: Skjønnsfastsettingstype) => {
        setState((prevState) => {
            const newState = new Map(prevState);
            newState.set(skjæringstidspunkt, {
                ...(prevState.get(skjæringstidspunkt) ?? defaultState),
                type: type,
                årsak: årsak,
                begrunnelseFritekst: begrunnelseFritekst,
            } as SkjønnsfastsettingFormFields);
            return newState;
        });
    };
};

export const useResetSkjønnsfastsettelseFormState = () => {
    const setState = useSetAtom(skjønnsfastsettelseFormState);
    useEffect(() => {
        setState(new Map());
    }, [setState]);
};

const defaultState: SkjønnsfastsettingFormFields = {
    begrunnelseFritekst: '',
    type: undefined,
    årsak: '',
    arbeidsgivere: [],
};
