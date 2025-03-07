import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { useEffect } from 'react';

import { Maybe } from '@io/graphql';
import { SkjønnsfastsettingFormFields } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm';
import { Skjønnsfastsettingstype } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/skjønnsfastsetting';

const skjemaFamily = atomFamily(
    // _ er skjæringstidspunkt som brukes som key til skjemaFamily
    (_: string) => atom<Maybe<SkjønnsfastsettingFormFields>>(null),
    (a, b) => a === b,
);

export const useSkjønnsfastsettelseFormState = (skjæringstidspunkt: string) =>
    useAtomValue(skjemaFamily(skjæringstidspunkt));

export const useSetSkjønnsfastsettelseFormState = (skjæringstispunkt: string) => {
    const setState = useSetAtom(skjemaFamily(skjæringstispunkt));
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
    useEffect(() => {
        skjemaFamily.setShouldRemove(() => true);
        skjemaFamily.setShouldRemove(null);
    }, []);
};

const defaultState: SkjønnsfastsettingFormFields = {
    begrunnelseFritekst: '',
    type: undefined,
    årsak: '',
    arbeidsgivere: [],
};
