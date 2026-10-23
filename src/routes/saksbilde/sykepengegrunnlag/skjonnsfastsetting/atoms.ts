import { atom, useAtom } from 'jotai';
import { atomFamily } from 'jotai-family';

import { SkjønnsfastsettingFormFields } from '@saksbilde/sykepengegrunnlag/skjonnsfastsetting/form/skjønnsfastsettingForm/SkjønnsfastsettingForm';
import { usePersonStore } from '@state/contexts/personStore';

const skjemaFamily = atomFamily((_vilkårsgrunnlagId: string) => atom<SkjønnsfastsettingFormFields | null>(null));

export const useAtomSkjemaForVilkårsgrunnlag = (vilkårsgrunnlagId: string) =>
    useAtom(skjemaFamily(vilkårsgrunnlagId), {
        store: usePersonStore(),
    });

const editingFamily = atomFamily((_vilkårsgrunnlagId: string) => atom<boolean>(false));

export const useAtomEditingForVilkårsgrunnlag = (vilkårsgrunnlagId: string) =>
    useAtom(editingFamily(vilkårsgrunnlagId), {
        store: usePersonStore(),
    });
