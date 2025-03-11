import { atom, useAtom } from 'jotai/index';
import { atomFamily } from 'jotai/utils';

import { Maybe } from '@io/graphql';
import { SkjønnsfastsettingFormFields } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm';
import { usePersonStore } from '@state/contexts/personStore';

const skjemaFamily = atomFamily((_skjæringstidspunkt: string) => atom<Maybe<SkjønnsfastsettingFormFields>>(null));

export const useAtomSkjemaForPersonOgSkjæringstidspunkt = (skjaeringstidspunkt: string) =>
    useAtom(skjemaFamily(skjaeringstidspunkt), {
        store: usePersonStore(),
    });

const editingFamily = atomFamily((_skjæringstidspunkt: string) => atom<boolean>(false));

export const useAtomEditingForPersonOgSkjæringstidspunkt = (skjaeringstidspunkt: string) =>
    useAtom(editingFamily(skjaeringstidspunkt), {
        store: usePersonStore(),
    });
