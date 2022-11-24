import { Inntektstype, Periodetilstand, Utbetalingtype } from '@io/graphql';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enGenerasjon } from '@test-data/generasjon';
import { enOppgave } from '@test-data/oppgave';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { enUtbetaling } from '@test-data/utbetaling';
import { defaultUtbetalingToggles } from '@utils/featureToggles';
import { kanOverstyreRevurdering, kanOverstyres, kanRevurderes } from '@utils/overstyring';

jest.mock('@utils/featureToggles');

describe('kanOverstyres', () => {
    it('returnerer false om personen har flere arbeidsgivere', () => {
        const periode = enBeregnetPeriode({ inntektstype: Inntektstype.Flerearbeidsgivere });
        const expected = {
            value: false,
            reason: 'Vi støtter ikke overstyring ved flere arbeidsgivere',
            technical: 'Flere arbeidsgivere',
        };

        expect(kanOverstyres(periode)).toEqual(expected);
    });

    it('returnerer false om perioden venter', () => {
        const periode = enBeregnetPeriode({ periodetilstand: Periodetilstand.VenterPaEnAnnenPeriode });
        const expected = {
            value: false,
            technical: 'Perioden er i feil tilstand',
        };

        expect(kanOverstyres(periode)).toEqual(expected);
    });

    it('returnerer true for beregnede perioder som er til godkjenning', () => {
        const oppgave = enOppgave();
        const periode = enBeregnetPeriode({ periodetilstand: Periodetilstand.TilGodkjenning, oppgave });
        const expected = { value: true };

        expect(kanOverstyres(periode)).toEqual(expected);
    });

    it('returnerer true for beregnede perioder som ikke har utbetaling', () => {
        const periode = enBeregnetPeriode({ periodetilstand: Periodetilstand.IngenUtbetaling });
        const expected = { value: true };

        expect(kanOverstyres(periode)).toEqual(expected);
    });

    it('returnerer true for beregnede perioder som har en feilende utbetaling', () => {
        const periode = enBeregnetPeriode({ periodetilstand: Periodetilstand.UtbetalingFeilet });
        const expected = { value: true };

        expect(kanOverstyres(periode)).toEqual(expected);
    });
});

describe('kanRevurderes', () => {
    afterEach(() => {
        defaultUtbetalingToggles.overstyreUtbetaltPeriodeEnabled = true;
        defaultUtbetalingToggles.overstyreTidligereSykefraværstilfelle = true;
    });

    describe('brytere', () => {
        it('returnerer false om overstyreUtbetaltPeriodeEnabled er false', () => {
            const periode = enBeregnetPeriode();
            const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
            const person = enPerson().medArbeidsgivere([arbeidsgiver]) as unknown as FetchedPerson;

            defaultUtbetalingToggles.overstyreUtbetaltPeriodeEnabled = false;
            defaultUtbetalingToggles.overstyreTidligereSykefraværstilfelle = true;

            expect(kanRevurderes(person, periode)).toEqual({
                value: false,
                technical: 'Revurdering av utbetalt periode',
            });
        });

        it('returnerer false om overstyreTidligereSykefraværstilfelle er false', () => {
            const tidligereSykefraværstilfelle = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-01' });
            const nyesteSykefraværstilfelle = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-02' });
            const arbeidsgiver = enArbeidsgiver().medPerioder([
                nyesteSykefraværstilfelle,
                tidligereSykefraværstilfelle,
            ]);
            const person = enPerson().medArbeidsgivere([arbeidsgiver]) as unknown as FetchedPerson;

            defaultUtbetalingToggles.overstyreUtbetaltPeriodeEnabled = true;
            defaultUtbetalingToggles.overstyreTidligereSykefraværstilfelle = false;

            expect(kanRevurderes(person, tidligereSykefraværstilfelle)).toEqual({
                value: false,
                reason: 'Vi støtter ikke revurdering av tidligere sykefraværstilfelle',
                technical: 'Revurdering av tidligere sykefravær',
            });
        });

        it('returnerer true for perioder som er i tidligere sykefraværstilfeller', () => {
            const tidligereSykefraværstilfelle = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-01' });
            const nyesteSykefraværstilfelle = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-02' });
            const arbeidsgiver = enArbeidsgiver().medPerioder([
                nyesteSykefraværstilfelle,
                tidligereSykefraværstilfelle,
            ]);
            const person = enPerson().medArbeidsgivere([arbeidsgiver]) as unknown as FetchedPerson;

            defaultUtbetalingToggles.overstyreUtbetaltPeriodeEnabled = true;
            defaultUtbetalingToggles.overstyreTidligereSykefraværstilfelle = false;

            expect(kanRevurderes(person, tidligereSykefraværstilfelle)).toEqual({
                value: false,
                reason: 'Vi støtter ikke revurdering av tidligere sykefraværstilfelle',
                technical: 'Revurdering av tidligere sykefravær',
            });
        });
    });

    it('returnerer false om perioden ikke er godkjent', () => {
        const periode = enBeregnetPeriode({ periodetilstand: Periodetilstand.IngenUtbetaling });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]) as FetchedPerson;
        const expected = {
            value: false,
            reason: 'Vi støtter ikke revurdering av perioder som ikke er godkjente',
            technical: 'Er ikke godkjent',
        };

        expect(kanRevurderes(person, periode)).toEqual(expected);
    });

    it('returnerer false om perioden har overlappende perioder til revurdering', () => {
        const godkjentPeriode = enBeregnetPeriode();
        const periodeTilRevurdering = enBeregnetPeriode({
            periodetilstand: Periodetilstand.TilGodkjenning,
            utbetaling: enUtbetaling({ type: Utbetalingtype.Revurdering }),
        });
        const arbeidsgiverA = enArbeidsgiver().medPerioder([godkjentPeriode]);
        const arbeidsgiverB = enArbeidsgiver().medPerioder([periodeTilRevurdering]);
        const person = enPerson().medArbeidsgivere([arbeidsgiverA, arbeidsgiverB]) as unknown as FetchedPerson;
        const expected = {
            value: false,
            reason: 'Vi støtter ikke revurdering av perioder som har overlappende perioder som revurderes',
            technical: 'Har overlappende revurderinger',
        };

        expect(kanRevurderes(person, godkjentPeriode)).toEqual(expected);
    });

    it('returnerer false om perioden ikke er i siste generasjon', () => {
        const historiskPeriode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver({
            generasjoner: [enGenerasjon(), enGenerasjon({ perioder: [historiskPeriode] })],
        });
        const person = enPerson().medArbeidsgivere([arbeidsgiver]) as unknown as FetchedPerson;
        const expected = {
            value: false,
            technical: 'Arbeidsgiver mangler eller periode er i tidligere generasjon',
        };

        expect(kanRevurderes(person, historiskPeriode)).toEqual(expected);
    });

    it('returnerer true for perioder i tidligere sykefraværstilfeller', () => {
        const periodeA = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-01' });
        const periodeB = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-02' });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeA, periodeB]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]) as unknown as FetchedPerson;
        const expected = { value: true };

        expect(kanRevurderes(person, periodeA)).toEqual(expected);
    });

    it('returnerer false om perioden er forkastet', () => {
        const periode = enBeregnetPeriode({ erForkastet: true });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]) as unknown as FetchedPerson;
        const expected = {
            value: false,
            technical: 'Forkastet periode',
        };

        expect(kanRevurderes(person, periode)).toEqual(expected);
    });
});

describe('kanOverstyreRevurdering', () => {
    afterEach(() => {
        defaultUtbetalingToggles.overstyreUtbetaltPeriodeEnabled = true;
    });

    it('returnerer false om overstyreUtbetaltPeriodeEnabled-togglen er false', () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]) as unknown as FetchedPerson;
        const expected = {
            value: false,
            technical: 'Revurdering av utbetalt periode',
        };

        defaultUtbetalingToggles.overstyreUtbetaltPeriodeEnabled = false;

        expect(kanOverstyreRevurdering(person, periode)).toEqual(expected);
    });

    it('returnerer false om perioden ikke er til revurdering', () => {
        const periode = enBeregnetPeriode();
        const person = enPerson() as unknown as FetchedPerson;
        const expected = {
            value: false,
            technical: 'Kan ikke overstyre revurdering om perioden ikke er til revurdering',
        };

        expect(kanOverstyreRevurdering(person, periode)).toEqual(expected);
    });

    it('returnerer true for perioder i tidligere sykefraværstilfeller', () => {
        const periodeA = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-01' }).somErTilRevurdering();
        const periodeB = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-02' }).somErTilRevurdering();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeA, periodeB]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]) as unknown as FetchedPerson;
        const expected = { value: true };

        expect(kanOverstyreRevurdering(person, periodeA)).toEqual(expected);
    });

    it('returnerer false om det finnes overlappende perioder som ikke er til revurdering', () => {
        const periodeA = enBeregnetPeriode().somErTilRevurdering();
        const periodeB = enBeregnetPeriode();
        const arbeidsgiverA = enArbeidsgiver().medPerioder([periodeA]);
        const arbeidsgiverB = enArbeidsgiver().medPerioder([periodeB]);
        const person = enPerson().medArbeidsgivere([arbeidsgiverA, arbeidsgiverB]) as unknown as FetchedPerson;
        const expected = {
            value: false,
            technical: 'Ikke alle overlappende perioder er til revurdering',
        };

        expect(kanOverstyreRevurdering(person, periodeA)).toEqual(expected);
    });
});
