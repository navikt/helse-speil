import { SpesialistArbeidsgiver, SpesialistPerson, SpesialistVedtaksperiode } from './types.external';
import { Arbeidsgiver, Overstyring, UferdigVedtaksperiode, Vedtaksperiode } from '../types.internal';
import { tilOverstyringMap } from './overstyring';
import dayjs from 'dayjs';
import { mapUferdigVedtaksperiode, mapVedtaksperiode } from './vedtaksperiode';

const reversert = (a: Vedtaksperiode, b: Vedtaksperiode) => dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();

const _tilVedtaksperiode = async (
    periode: SpesialistVedtaksperiode,
    arbeidsgiver: SpesialistArbeidsgiver
): Promise<UferdigVedtaksperiode | Vedtaksperiode> =>
    periode.fullstendig
        ? await mapVedtaksperiode(periode, arbeidsgiver.organisasjonsnummer, arbeidsgiver.risikovurderinger ?? [])
        : mapUferdigVedtaksperiode(periode);

const tilArbeidsgiver = async (arbeidsgiver: SpesialistArbeidsgiver) => {
    const tilVedtaksperiode = async (periode: SpesialistVedtaksperiode) =>
        await _tilVedtaksperiode(periode, arbeidsgiver);
    const vedtaksperioder = await Promise.all(arbeidsgiver.vedtaksperioder.map(tilVedtaksperiode));
    return {
        navn: arbeidsgiver.navn,
        id: arbeidsgiver.id,
        organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
        vedtaksperioder: vedtaksperioder.sort(reversert),
        overstyringer: arbeidsgiver.overstyringer.reduce(tilOverstyringMap, new Map<string, Overstyring>()),
    };
};

export const tilArbeidsgivere = async (person: SpesialistPerson): Promise<Arbeidsgiver[]> =>
    Promise.all(person.arbeidsgivere.map(tilArbeidsgiver));
