import { SpesialistArbeidsgiver } from 'external-types';
import { Arbeidsgiver, UfullstendigVedtaksperiode, Vedtaksperiode } from 'internal-types';
import dayjs from 'dayjs';
import { mapUferdigVedtaksperiode, mapVedtaksperiode } from './vedtaksperiode';

type PartialMappingResult = {
    unmapped: SpesialistArbeidsgiver;
    partial: Partial<Arbeidsgiver>;
    problems: Error[];
};

const reversert = (a: Vedtaksperiode, b: Vedtaksperiode) => dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();

const appendUnmappedData = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        navn: unmapped.navn,
        id: unmapped.id,
        organisasjonsnummer: unmapped.organisasjonsnummer,
    },
    problems: problems,
});

type MapVedtaksperioderResult = {
    vedtaksperioder: (Vedtaksperiode | UfullstendigVedtaksperiode)[];
    problems: Error[];
};

const mapVedtaksperioder = async (arbeidsgiver: SpesialistArbeidsgiver): Promise<MapVedtaksperioderResult> =>
    Promise.all(
        arbeidsgiver.vedtaksperioder.map((periode) =>
            periode.fullstendig
                ? mapVedtaksperiode({
                      ...periode,
                      organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                      overstyringer: arbeidsgiver.overstyringer,
                  })
                : mapUferdigVedtaksperiode(periode)
        )
    ).then((results) => ({
        vedtaksperioder: results.map(({ vedtaksperiode }) => vedtaksperiode),
        problems: results.map(({ problems }) => problems).flat(),
    }));

const appendVedtaksperioder = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => {
    const { vedtaksperioder, problems: vedtaksperioderProblems } = await mapVedtaksperioder(unmapped);
    return {
        unmapped,
        partial: {
            ...partial,
            vedtaksperioder: vedtaksperioder,
        },
        problems: [...problems, ...vedtaksperioderProblems],
    };
};

const sortVedtaksperioder = async ({
    unmapped,
    partial,
    problems,
}: PartialMappingResult): Promise<PartialMappingResult> => ({
    unmapped,
    partial: {
        ...partial,
        vedtaksperioder: partial.vedtaksperioder?.sort(reversert),
    },
    problems: problems,
});

const finalize = (partialResult: PartialMappingResult): { arbeidsgiver: Arbeidsgiver; problems: Error[] } => ({
    arbeidsgiver: partialResult.partial as Arbeidsgiver,
    problems: partialResult.problems,
});

type MapArbeidsgiverResult = {
    arbeidsgiver: Arbeidsgiver;
    problems: Error[];
};

const mapArbeidsgiver = async (arbeidsgiver: SpesialistArbeidsgiver): Promise<MapArbeidsgiverResult> =>
    appendUnmappedData({ unmapped: arbeidsgiver, partial: {}, problems: [] })
        .then(appendVedtaksperioder)
        .then(sortVedtaksperioder)
        .then(finalize);

type MapArbeidsgivereResult = {
    arbeidsgivere: Arbeidsgiver[];
    problems: Error[];
};

export const mapArbeidsgivere = async (arbeidsgivere: SpesialistArbeidsgiver[]): Promise<MapArbeidsgivereResult> =>
    Promise.all(arbeidsgivere.map(mapArbeidsgiver)).then((results) => ({
        arbeidsgivere: results.map((result) => result.arbeidsgiver),
        problems: results.map((result) => result.problems).flat(),
    }));
