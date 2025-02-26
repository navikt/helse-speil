import { useEffect } from 'react';
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { Maybe } from '@io/graphql';
import { SkjønnsfastsettingFormFields } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm';
import { Skjønnsfastsettingstype } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/skjønnsfastsetting';

const skjønnsfastsettelseFormState = atom<Maybe<SkjønnsfastsettingFormFields>>({
    key: 'skjønnsfastsettelseFormState',
    default: null,
});

export const useSkjønnsfastsettelseFormState = () => useRecoilValue(skjønnsfastsettelseFormState);

export const useSetSkjønnsfastsettelseFormState = () => {
    const [state, setState] = useRecoilState(skjønnsfastsettelseFormState);
    return (årsak: string, begrunnelseFritekst: string, type?: Skjønnsfastsettingstype) => {
        const prevState = state ?? defaultState;
        setState({ ...prevState, type: type, årsak: årsak, begrunnelseFritekst: begrunnelseFritekst });
    };
};

export const useResetSkjønnsfastsettelseFormState = () => {
    const setState = useSetRecoilState(skjønnsfastsettelseFormState);
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
