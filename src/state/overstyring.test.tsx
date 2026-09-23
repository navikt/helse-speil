import { Kildetype } from '@io/graphql';
import { lagOverstyrtInntektMetadata } from '@state/overstyring';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enPerson } from '@test-data/person';
import { etVilkårsgrunnlagFraSpleis } from '@test-data/vilkårsgrunnlag';

const skjæringstidspunkt = '2020-01-01';

describe('lagOverstyrtInntektMetadata', () => {
    it('henter refusjonsopplysninger fra vilkårsgrunnlaget med oppgitt id', () => {
        const arbeidsgiver = enArbeidsgiver();
        const gammeltVilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({
            id: 'gammelt',
            arbeidsgiverrefusjoner: [
                enArbeidsgiverrefusjon(arbeidsgiver.organisasjonsnummer, [
                    { fom: '2020-01-01', tom: null, belop: 10000 },
                ]),
            ],
        });
        const gjeldendeVilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({
            id: 'gjeldende',
            arbeidsgiverrefusjoner: [
                enArbeidsgiverrefusjon(arbeidsgiver.organisasjonsnummer, [
                    { fom: '2020-01-01', tom: null, belop: 30000 },
                ]),
            ],
        });
        const person = enPerson({
            arbeidsgivere: [arbeidsgiver],
            vilkarsgrunnlagV2: [gammeltVilkårsgrunnlag, gjeldendeVilkårsgrunnlag],
        });

        const metadata = lagOverstyrtInntektMetadata(person, arbeidsgiver, skjæringstidspunkt, 'gjeldende');

        expect(metadata.fraRefusjonsopplysninger).toEqual([
            { fom: '2020-01-01', tom: null, beløp: 30000, kilde: Kildetype.Saksbehandler },
        ]);
    });

    it('henter kun refusjonsopplysninger for den aktuelle arbeidsgiveren', () => {
        const arbeidsgiver = enArbeidsgiver({ organisasjonsnummer: '987654321' });
        const annenArbeidsgiver = enArbeidsgiver({ organisasjonsnummer: '123456789' });
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({
            id: 'gjeldende',
            arbeidsgiverrefusjoner: [
                enArbeidsgiverrefusjon(annenArbeidsgiver.organisasjonsnummer, [
                    { fom: '2020-01-01', tom: null, belop: 10000 },
                ]),
                enArbeidsgiverrefusjon(arbeidsgiver.organisasjonsnummer, [
                    { fom: '2020-01-01', tom: null, belop: 30000 },
                ]),
            ],
        });
        const person = enPerson({
            arbeidsgivere: [arbeidsgiver, annenArbeidsgiver],
            vilkarsgrunnlagV2: [vilkårsgrunnlag],
        });

        const metadata = lagOverstyrtInntektMetadata(person, arbeidsgiver, skjæringstidspunkt, 'gjeldende');

        expect(metadata.fraRefusjonsopplysninger).toEqual([
            { fom: '2020-01-01', tom: null, beløp: 30000, kilde: Kildetype.Saksbehandler },
        ]);
    });

    it('sorterer refusjonsopplysningene med nyeste først', () => {
        const arbeidsgiver = enArbeidsgiver();
        const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({
            id: 'gjeldende',
            arbeidsgiverrefusjoner: [
                enArbeidsgiverrefusjon(arbeidsgiver.organisasjonsnummer, [
                    { fom: '2020-01-01', tom: '2020-01-31', belop: 10000 },
                    { fom: '2020-02-01', tom: null, belop: 20000 },
                ]),
            ],
        });
        const person = enPerson({ arbeidsgivere: [arbeidsgiver], vilkarsgrunnlagV2: [vilkårsgrunnlag] });

        const metadata = lagOverstyrtInntektMetadata(person, arbeidsgiver, skjæringstidspunkt, 'gjeldende');

        expect(metadata.fraRefusjonsopplysninger.map((it) => it.fom)).toEqual(['2020-02-01', '2020-01-01']);
    });

    it('gir tomme refusjonsopplysninger uten å kaste når vilkårsgrunnlagId mangler', () => {
        const arbeidsgiver = enArbeidsgiver();
        const person = enPerson({
            arbeidsgivere: [arbeidsgiver],
            vilkarsgrunnlagV2: [etVilkårsgrunnlagFraSpleis({ id: 'gjeldende' })],
        });

        expect(
            lagOverstyrtInntektMetadata(person, arbeidsgiver, skjæringstidspunkt, null).fraRefusjonsopplysninger,
        ).toEqual([]);
        expect(
            lagOverstyrtInntektMetadata(person, arbeidsgiver, skjæringstidspunkt, 'finnes-ikke')
                .fraRefusjonsopplysninger,
        ).toEqual([]);
    });

    it('setter skjæringstidspunkt og identer fra argumentene', () => {
        const arbeidsgiver = enArbeidsgiver({ organisasjonsnummer: '987654321' });
        const person = enPerson({
            aktorId: 'en-aktørId',
            fodselsnummer: 'et-fødselsnummer',
            arbeidsgivere: [arbeidsgiver],
            vilkarsgrunnlagV2: [etVilkårsgrunnlagFraSpleis({ id: 'gjeldende' })],
        });

        const metadata = lagOverstyrtInntektMetadata(person, arbeidsgiver, '2021-03-15', 'gjeldende');

        expect(metadata).toMatchObject({
            aktørId: 'en-aktørId',
            fødselsnummer: 'et-fødselsnummer',
            organisasjonsnummer: '987654321',
            skjæringstidspunkt: '2021-03-15',
        });
    });
});

function enArbeidsgiverrefusjon(
    organisasjonsnummer: string,
    refusjonsopplysninger: { fom: string; tom: string | null; belop: number }[],
) {
    return {
        __typename: 'Arbeidsgiverrefusjon' as const,
        arbeidsgiver: organisasjonsnummer,
        refusjonsopplysninger: refusjonsopplysninger.map((it) => ({
            __typename: 'Refusjonselement' as const,
            ...it,
            meldingsreferanseId: 'en-meldingsreferanseId',
        })),
    };
}
