import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';

import { Maybe } from '@io/graphql';
import { SkjønnsfastsettingFormFields } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm';
import { Skjønnsfastsettingstype } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/skjønnsfastsetting';

const skjemaFamily = atomFamily((_skjæringstidspunkt: string) => atom<Maybe<SkjønnsfastsettingFormFields>>(null));

export const useSkjønnsfastsettelseFormState = (skjæringstidspunkt: string) =>
    useAtomValue(skjemaFamily(skjæringstidspunkt));

export const useSetSkjønnsfastsettelseFormState = (skjæringstidspunkt: string) => {
    const setState = useSetAtom(skjemaFamily(skjæringstidspunkt));
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

const defaultState: SkjønnsfastsettingFormFields = {
    begrunnelseFritekst: '',
    type: undefined,
    årsak: '',
    arbeidsgivere: [],
};
