import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { SparsomAktivitet, SparsomAktiviteterRequest, SparsomAktiviteterResponse } from '@io/rest/sparsom';
import { lesTestpersonfiler } from '@spesialist-mock/storage/person';

export async function stub(request: NextRequest) {
    const { ident }: Partial<SparsomAktiviteterRequest> = await request.json();
    if (ident == null) return new Response(null, { status: 400 });

    const person = lesTestpersonfiler().find((fil) => fil.data.person.fodselsnummer === ident)?.data.person;
    const vedtaksperioder =
        person?.arbeidsgivere.flatMap((arbeidsgiver) =>
            arbeidsgiver.behandlinger
                .flatMap((behandling) => behandling.perioder)
                .map((periode) => ({
                    organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                    vedtaksperiodeId: periode.vedtaksperiodeId,
                })),
        ) ?? [];
    const unikeVedtaksperioder = vedtaksperioder.filter(
        (periode, index) =>
            vedtaksperioder.findIndex((it) => it.vedtaksperiodeId === periode.vedtaksperiodeId) === index,
    );

    let id = 0;
    const aktiviteter = unikeVedtaksperioder.flatMap(
        ({ organisasjonsnummer, vedtaksperiodeId }): SparsomAktivitet[] => {
            const søknad = { meldingsreferanseId: uuidv4(), fødselsnummer: ident, organisasjonsnummer };
            const inntektsmelding = { meldingsreferanseId: uuidv4(), fødselsnummer: ident, organisasjonsnummer };
            const påminnelse = { meldingsreferanseId: uuidv4(), fødselsnummer: ident, organisasjonsnummer };
            const vedtaksperiode = { vedtaksperiodeId, tilstand: 'AVVENTER_GODKJENNING' };
            return [
                {
                    id: id++,
                    tidsstempel: '2026-02-01T10:00:00.000',
                    nivå: 'INFO',
                    tekst: 'Søknad mottatt',
                    kontekster: { Søknad: søknad, Vedtaksperiode: vedtaksperiode },
                },
                {
                    id: id++,
                    tidsstempel: '2026-02-01T10:00:01.000',
                    nivå: 'BEHOV',
                    tekst: 'Trenger inntektsmelding',
                    kontekster: { Søknad: søknad, Vedtaksperiode: vedtaksperiode },
                },
                {
                    id: id++,
                    tidsstempel: '2026-02-03T08:30:00.000',
                    nivå: 'VARSEL',
                    tekst: 'Arbeidsgiver er ikke registrert i Aa-registeret.',
                    kontekster: { Inntektsmelding: inntektsmelding, Vedtaksperiode: vedtaksperiode },
                },
                {
                    id: id++,
                    tidsstempel: '2026-02-04T06:00:00.000',
                    nivå: 'INFO',
                    tekst: 'Forsøker å gjenoppta behandling',
                    kontekster: { Påminnelse: påminnelse, Vedtaksperiode: vedtaksperiode },
                },
            ];
        },
    );

    return Response.json({ aktiviteter } satisfies SparsomAktiviteterResponse, { status: 200 });
}
