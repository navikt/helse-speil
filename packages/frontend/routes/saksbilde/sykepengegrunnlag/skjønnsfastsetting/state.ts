import { Lovhjemmel } from '../overstyring/overstyring.types';
import { atom } from 'recoil';

export type ArbeidsforholdMal = 'EN_ARBEIDSGIVER' | 'FLERE_ARBEIDSGIVERE';

export interface SkjønnsfastsettingMal {
    _id: string;
    begrunnelse: string;
    konklusjon: string;
    arsak: string;
    iProd: boolean;
    lovhjemmel: Lovhjemmel;
    arbeidsforholdMal: ArbeidsforholdMal[];
}

export const skjønnsfastsettingMaler = atom<SkjønnsfastsettingMal[]>({
    key: 'skjønnsfastsettingMaler',
    default: [],
});
