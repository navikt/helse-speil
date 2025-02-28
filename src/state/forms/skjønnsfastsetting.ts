import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { Maybe } from '@io/graphql';
import { SkjønnsfastsettingFormFields } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm';
import { Skjønnsfastsettingstype } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/skjønnsfastsetting';

const skjønnsfastsettelseFormState = atom<Maybe<SkjønnsfastsettingFormFields>>(null);

export const useSkjønnsfastsettelseFormState = () => useAtomValue(skjønnsfastsettelseFormState);

export const useSetSkjønnsfastsettelseFormState = () => {
    const setState = useSetAtom(skjønnsfastsettelseFormState);
    return (årsak: string, begrunnelseFritekst: string, type?: Skjønnsfastsettingstype) => {
        setState((prevState) => {
            if (prevState) {
                return {
                    ...prevState,
                    type: type,
                    årsak: årsak,
                    begrunnelseFritekst: begrunnelseFritekst,
                } as SkjønnsfastsettingFormFields;
            } else {
                return {
                    ...defaultState,
                    type: type,
                    årsak: årsak,
                    begrunnelseFritekst: begrunnelseFritekst,
                } as SkjønnsfastsettingFormFields;
            }
        });
    };
};

export const useResetSkjønnsfastsettelseFormState = () => {
    const setState = useSetAtom(skjønnsfastsettelseFormState);
    useEffect(() => {
        setState(null);
    }, [setState]);
};

const defaultState: SkjønnsfastsettingFormFields = {
    begrunnelseFritekst: '',
    type: undefined,
    årsak: '',
    arbeidsgivere: [],
};
