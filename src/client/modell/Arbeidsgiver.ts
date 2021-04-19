import { usePerson } from '../state/person';

export const useArbeidsgivernavn = (orgnr: string): string | undefined =>
    usePerson()?.arbeidsgivere.find((a) => a.organisasjonsnummer === orgnr)?.navn;

export const useArbeidsgiverOrganisasjonsnummer = (vedtaksperiodeId: string): string =>
    usePerson()!.arbeidsgivere.find((a) => a.vedtaksperioder.find((v) => v.id === vedtaksperiodeId))!
        .organisasjonsnummer;
