import { usePerson } from '../state/person';

export const useArbeidsgivernavn = (orgnr: string): string | undefined =>
    usePerson()?.arbeidsgivere.find((a) => a.organisasjonsnummer === orgnr)?.navn;
