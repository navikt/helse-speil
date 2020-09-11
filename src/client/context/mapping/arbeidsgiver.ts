import { SpesialistArbeidsgiver, SpesialistPerson } from './types.external';
import { Arbeidsgiver, Vedtaksperiode } from '../types.internal';
import dayjs from 'dayjs';
import { mapUferdigVedtaksperiode, mapVedtaksperiode } from './vedtaksperiode';

type PartialMappingResult = {
    unmapped: SpesialistArbeidsgiver;
    partial: Partial<Arbeidsgiver>;
};

const reversert = (a: Vedtaksperiode, b: Vedtaksperiode) => dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();

const appendUnmappedData = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        navn: unmapped.navn,
        id: unmapped.id,
        organisasjonsnummer: unmapped.organisasjonsnummer,
    },
});

const appendVedtaksperioder = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        vedtaksperioder: await Promise.all(
            unmapped.vedtaksperioder.map((periode) =>
                periode.fullstendig
                    ? mapVedtaksperiode({
                          ...periode,
                          organisasjonsnummer: unmapped.organisasjonsnummer,
                          risikovurderingerForArbeidsgiver: unmapped.risikovurderinger ?? [],
                          overstyringer: unmapped.overstyringer,
                      })
                    : mapUferdigVedtaksperiode(periode)
            )
        ),
    },
});

const sortVedtaksperioder = async ({ unmapped, partial }: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        vedtaksperioder: partial.vedtaksperioder?.sort(reversert),
    },
});

const finalize = (partialResult: PartialMappingResult): Arbeidsgiver => partialResult.partial as Arbeidsgiver;

const mapArbeidsgiver = async (arbeidsgiver: SpesialistArbeidsgiver) =>
    appendUnmappedData({ unmapped: arbeidsgiver, partial: {} })
        .then(appendVedtaksperioder)
        .then(sortVedtaksperioder)
        .then(finalize);

export const mapArbeidsgivere = async (person: SpesialistPerson): Promise<Arbeidsgiver[]> =>
    Promise.all(person.arbeidsgivere.map(mapArbeidsgiver));
