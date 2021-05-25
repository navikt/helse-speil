import { Arbeidsforhold } from 'internal-types';

import { usePerson } from '../state/person';

export const useArbeidsgivernavn = (organisasjonsnummer: string): string | undefined =>
    usePerson()?.arbeidsgivere.find((a) => a.organisasjonsnummer === organisasjonsnummer)?.navn;

export const useOrganisasjonsnummer = (vedtaksperiodeId: string): string =>
    usePerson()!.arbeidsgivere.find((a) => a.vedtaksperioder.find((v) => v.id === vedtaksperiodeId))
        ?.organisasjonsnummer!;

export const useArbeidsforhold = (organisasjonsnummer: string): Arbeidsforhold[] | undefined =>
    usePerson()?.arbeidsgivere.find((a) => a.organisasjonsnummer === organisasjonsnummer)?.arbeidsforhold;
