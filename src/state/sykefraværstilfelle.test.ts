import {
    ApiBeregnetPeriode,
    ApiPeriode,
    ApiPeriodetilstand,
    ApiUtbetalingstatus,
} from '@io/rest/generated/spesialist.schemas';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode, enGhostPeriode, enUberegnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { enUtbetaling } from '@test-data/utbetaling';
import { ActivePeriod } from '@typer/shared';

import {
    finnSykefraværstilfelle,
    finnSykefraværstilfelleForSkjæringstidspunkt,
    redigeringISykefraværstilfellet,
} from './sykefraværstilfelle';

const vilkarsgrunnlagId = '3f1c2a8e-5b7d-4e9a-9c61-2d8f4b7a1e05';
const annetVilkårsgrunnlagId = '8a4e6d21-0c3f-4b8e-a5d7-6f9b2c1e4d38';
const vedtaksperiodeIdA = '4868f90a-1055-4003-8aca-a48a7426dcfa';
const vedtaksperiodeIdB = '61dbec93-f4cd-4778-9539-2513b4be67d6';

describe('finnSykefraværstilfelle', () => {
    it('tar med periodene med samme vilkårsgrunnlag hos alle arbeidsgivere', () => {
        const valgtPeriode = enBeregnetPeriode({ vilkarsgrunnlagId });
        const periodeISammeTilfelle = enBeregnetPeriode({ vilkarsgrunnlagId });
        const periodeIAnnetTilfelle = enBeregnetPeriode({ vilkarsgrunnlagId: annetVilkårsgrunnlagId });
        const person = enPerson({
            arbeidsgivere: [
                enArbeidsgiverMedBehandlinger([valgtPeriode, periodeIAnnetTilfelle]),
                enArbeidsgiverMedBehandlinger([periodeISammeTilfelle]),
            ],
        });

        const tilfelle = finnSykefraværstilfelle(person, valgtPeriode);

        expect(idene(tilfelle.perioder)).toEqual(idene([valgtPeriode, periodeISammeTilfelle]));
        expect(tilfelle.vilkarsgrunnlagId).toBe(vilkarsgrunnlagId);
        expect(tilfelle.status).toBe('vis');
    });

    it('tar med periodene for selvstendig næring', () => {
        const valgtPeriode = enBeregnetPeriode({ vilkarsgrunnlagId });
        const selvstendigPeriode = enBeregnetPeriode({ vilkarsgrunnlagId });
        const person = enPerson({
            arbeidsgivere: [enArbeidsgiverMedBehandlinger([valgtPeriode])],
            selvstendigNaering: { behandlinger: [enBehandling({ perioder: [selvstendigPeriode] })] },
        });

        const tilfelle = finnSykefraværstilfelle(person, valgtPeriode);

        expect(idene(tilfelle.perioder)).toEqual(idene([valgtPeriode, selvstendigPeriode]));
    });

    it('tar med ghost-perioder med samme vilkårsgrunnlag, men ikke deaktiverte', () => {
        const valgtPeriode = enBeregnetPeriode({ vilkarsgrunnlagId });
        const ghostPeriode = enGhostPeriode({ vilkarsgrunnlagId });
        const deaktivertGhostPeriode = enGhostPeriode({ vilkarsgrunnlagId, deaktivert: true });
        const ghostPeriodeIAnnetTilfelle = enGhostPeriode({ vilkarsgrunnlagId: annetVilkårsgrunnlagId });
        const person = enPerson({
            arbeidsgivere: [
                enArbeidsgiverMedBehandlinger([valgtPeriode]),
                enArbeidsgiver({ ghostPerioder: [ghostPeriode, deaktivertGhostPeriode, ghostPeriodeIAnnetTilfelle] }),
            ],
        });

        const tilfelle = finnSykefraværstilfelle(person, valgtPeriode);

        expect(idene(tilfelle.perioder)).toEqual(idene([valgtPeriode, ghostPeriode]));
    });

    it('finner sykefraværstilfellet når en ghost-periode er valgt', () => {
        const periode = enBeregnetPeriode({ vilkarsgrunnlagId });
        const valgtGhostPeriode = enGhostPeriode({ vilkarsgrunnlagId });
        const person = enPerson({
            arbeidsgivere: [
                enArbeidsgiverMedBehandlinger([periode]),
                enArbeidsgiver({ ghostPerioder: [valgtGhostPeriode] }),
            ],
        });

        const tilfelle = finnSykefraværstilfelle(person, valgtGhostPeriode);

        expect(idene(tilfelle.perioder)).toEqual(idene([periode, valgtGhostPeriode]));
        expect(tilfelle.vilkarsgrunnlagId).toBe(vilkarsgrunnlagId);
        expect(tilfelle.status).toBe('vis');
    });

    describe('med flere behandlingsnivåer', () => {
        it('tar med hver vedtaksperiode én gang, fra den nyeste behandlingen med samme vilkårsgrunnlag', () => {
            const nyesteA = periodeA({ vilkarsgrunnlagId });
            const nyesteB = periodeB({ vilkarsgrunnlagId });
            const person = enPerson({
                arbeidsgivere: [
                    enArbeidsgiverMedBehandlinger(
                        [nyesteB, nyesteA],
                        [periodeB({ vilkarsgrunnlagId }), periodeA({ vilkarsgrunnlagId })],
                    ),
                ],
            });

            const tilfelle = finnSykefraværstilfelle(person, nyesteA);

            expect(idene(tilfelle.perioder)).toEqual(idene([nyesteA, nyesteB]));
        });

        it('viser periodene som hørte til grunnlaget den gangen når en eldre behandling er valgt', () => {
            const eldreA = periodeA({ vilkarsgrunnlagId });
            const eldreB = periodeB({ vilkarsgrunnlagId });
            const person = enPerson({
                arbeidsgivere: [
                    enArbeidsgiverMedBehandlinger(
                        [
                            periodeB({ vilkarsgrunnlagId: annetVilkårsgrunnlagId }),
                            periodeA({ vilkarsgrunnlagId: annetVilkårsgrunnlagId }),
                        ],
                        [eldreB, eldreA],
                    ),
                ],
            });

            const tilfelle = finnSykefraværstilfelle(person, eldreA);

            expect(idene(tilfelle.perioder)).toEqual(idene([eldreA, eldreB]));
            expect(tilfelle.vilkarsgrunnlagId).toBe(vilkarsgrunnlagId);
        });

        it('bruker den valgte perioden for dens egen vedtaksperiode, også i en eldre behandling', () => {
            const nyesteB = periodeB({ vilkarsgrunnlagId });
            const eldreA = periodeA({ vilkarsgrunnlagId });
            const person = enPerson({
                arbeidsgivere: [enArbeidsgiverMedBehandlinger([nyesteB, periodeA({ vilkarsgrunnlagId })], [eldreA])],
            });

            const tilfelle = finnSykefraværstilfelle(person, eldreA);

            expect(idene(tilfelle.perioder)).toEqual(idene([eldreA, nyesteB]));
        });
    });

    describe('med uberegnede perioder', () => {
        it('tar med uberegnede perioder med samme skjæringstidspunkt hos alle arbeidsgivere når en beregnet periode er valgt', () => {
            const valgtPeriode = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-01', vilkarsgrunnlagId });
            const uberegnetHosSammeArbeidsgiver = enUberegnetPeriode({ skjaeringstidspunkt: '2020-01-01' });
            const uberegnetHosAnnenArbeidsgiver = enUberegnetPeriode({ skjaeringstidspunkt: '2020-01-01' });
            const uberegnetIAnnetTilfelle = enUberegnetPeriode({ skjaeringstidspunkt: '2020-06-01' });
            const person = enPerson({
                arbeidsgivere: [
                    enArbeidsgiverMedBehandlinger([
                        uberegnetIAnnetTilfelle,
                        uberegnetHosSammeArbeidsgiver,
                        valgtPeriode,
                    ]),
                    enArbeidsgiverMedBehandlinger([uberegnetHosAnnenArbeidsgiver]),
                ],
            });

            const tilfelle = finnSykefraværstilfelle(person, valgtPeriode);

            expect(idene(tilfelle.perioder)).toEqual(
                idene([valgtPeriode, uberegnetHosSammeArbeidsgiver, uberegnetHosAnnenArbeidsgiver]),
            );
            expect(tilfelle.vilkarsgrunnlagId).toBe(vilkarsgrunnlagId);
            expect(tilfelle.status).toBe('vis');
        });

        it('gir det nyeste grunnlaget og periodene som bruker det når en uberegnet periode er valgt', () => {
            const valgtPeriode = enUberegnetPeriode({ skjaeringstidspunkt: '2020-01-01' });
            const uberegnetHosAnnenArbeidsgiver = enUberegnetPeriode({ skjaeringstidspunkt: '2020-01-01' });
            const beregnetMedSammeSkjæringstidspunkt = enBeregnetPeriode({
                skjaeringstidspunkt: '2020-01-01',
                vilkarsgrunnlagId,
            });
            const ghostPeriode = enGhostPeriode({ skjaeringstidspunkt: '2020-01-01', vilkarsgrunnlagId });
            const beregnetIAnnetTilfelle = enBeregnetPeriode({
                skjaeringstidspunkt: '2020-06-01',
                vilkarsgrunnlagId: annetVilkårsgrunnlagId,
            });
            const person = enPerson({
                arbeidsgivere: [
                    enArbeidsgiverMedBehandlinger([
                        beregnetIAnnetTilfelle,
                        valgtPeriode,
                        beregnetMedSammeSkjæringstidspunkt,
                    ]),
                    enArbeidsgiver({
                        behandlinger: [enBehandling({ perioder: [uberegnetHosAnnenArbeidsgiver] })],
                        ghostPerioder: [ghostPeriode],
                    }),
                ],
            });

            const tilfelle = finnSykefraværstilfelle(person, valgtPeriode);

            expect(idene(tilfelle.perioder)).toEqual(
                idene([valgtPeriode, beregnetMedSammeSkjæringstidspunkt, uberegnetHosAnnenArbeidsgiver, ghostPeriode]),
            );
            expect(tilfelle.vilkarsgrunnlagId).toBe(vilkarsgrunnlagId);
            expect(tilfelle.status).toBe('vis');
        });

        it('gir bare de uberegnede periodene når ingen perioder med skjæringstidspunktet er beregnet', () => {
            const valgtPeriode = enUberegnetPeriode({ skjaeringstidspunkt: '2020-06-01' });
            const uberegnetHosSammeArbeidsgiver = enUberegnetPeriode({ skjaeringstidspunkt: '2020-06-01' });
            const uberegnetHosAnnenArbeidsgiver = enUberegnetPeriode({ skjaeringstidspunkt: '2020-06-01' });
            const beregnetIAnnetTilfelle = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-01', vilkarsgrunnlagId });
            const person = enPerson({
                arbeidsgivere: [
                    enArbeidsgiverMedBehandlinger([
                        uberegnetHosSammeArbeidsgiver,
                        valgtPeriode,
                        beregnetIAnnetTilfelle,
                    ]),
                    enArbeidsgiver({
                        behandlinger: [enBehandling({ perioder: [uberegnetHosAnnenArbeidsgiver] })],
                        ghostPerioder: [enGhostPeriode({ skjaeringstidspunkt: '2020-01-01', vilkarsgrunnlagId })],
                    }),
                ],
            });

            const tilfelle = finnSykefraværstilfelle(person, valgtPeriode);

            expect(idene(tilfelle.perioder)).toEqual(
                idene([valgtPeriode, uberegnetHosSammeArbeidsgiver, uberegnetHosAnnenArbeidsgiver]),
            );
            expect(tilfelle.vilkarsgrunnlagId).toBeNull();
            expect(tilfelle.status).toBe('ikkeBeregnet');
        });

        it('tar ikke med uberegnede perioder i klyngen til et eldre grunnlag', () => {
            const nyesteA = periodeA({ vilkarsgrunnlagId: annetVilkårsgrunnlagId });
            const eldreA = periodeA({ vilkarsgrunnlagId });
            const uberegnetB = enUberegnetPeriode({ vedtaksperiodeId: vedtaksperiodeIdB });
            const person = enPerson({
                arbeidsgivere: [enArbeidsgiverMedBehandlinger([uberegnetB, nyesteA], [eldreA])],
            });

            expect(idene(finnSykefraværstilfelle(person, eldreA).perioder)).toEqual(idene([eldreA]));
            expect(idene(finnSykefraværstilfelle(person, nyesteA).perioder)).toEqual(idene([nyesteA, uberegnetB]));
            expect(finnSykefraværstilfelle(person, uberegnetB).vilkarsgrunnlagId).toBe(annetVilkårsgrunnlagId);
        });

        it('tar med den uberegnede behandlingen når den er den nyeste for vedtaksperioden', () => {
            const nyesteB = periodeB({ vilkarsgrunnlagId });
            const uberegnetA = enUberegnetPeriode({ vedtaksperiodeId: vedtaksperiodeIdA });
            const person = enPerson({
                arbeidsgivere: [
                    enArbeidsgiverMedBehandlinger(
                        [nyesteB, uberegnetA],
                        [periodeB({ vilkarsgrunnlagId }), periodeA({ vilkarsgrunnlagId })],
                    ),
                ],
            });

            const tilfelle = finnSykefraværstilfelle(person, nyesteB);

            expect(idene(tilfelle.perioder)).toEqual(idene([nyesteB, uberegnetA]));
        });
    });

    describe('uten vilkårsgrunnlag', () => {
        it('gir bare den valgte perioden når en beregnet periode mangler vilkårsgrunnlag', () => {
            const valgtPeriode = enBeregnetPeriode({ vilkarsgrunnlagId: null });
            const annenPeriodeUtenGrunnlag = enBeregnetPeriode({ vilkarsgrunnlagId: null });
            const person = enPerson({
                arbeidsgivere: [enArbeidsgiverMedBehandlinger([valgtPeriode, annenPeriodeUtenGrunnlag])],
            });

            const tilfelle = finnSykefraværstilfelle(person, valgtPeriode);

            expect(idene(tilfelle.perioder)).toEqual(idene([valgtPeriode]));
            expect(tilfelle.vilkarsgrunnlagId).toBeNull();
            expect(tilfelle.status).toBe('ikkeBeregnet');
        });
    });

    describe('med annullerte perioder', () => {
        it('er annullert når alle periodene er annullert eller til annullering', () => {
            const valgtPeriode = enAnnullertPeriode(vedtaksperiodeIdA);
            const periodeTilAnnullering = enAnnullertPeriode(vedtaksperiodeIdB, ApiPeriodetilstand.TilAnnullering);
            const person = enPerson({
                arbeidsgivere: [
                    enArbeidsgiver({
                        behandlinger: [
                            enBehandling({ perioder: [periodeTilAnnullering, valgtPeriode] }),
                            enBehandling({
                                perioder: [
                                    enBeregnetPeriode({ vedtaksperiodeId: vedtaksperiodeIdB, vilkarsgrunnlagId }),
                                    enBeregnetPeriode({ vedtaksperiodeId: vedtaksperiodeIdA, vilkarsgrunnlagId }),
                                ],
                            }),
                        ],
                        ghostPerioder: [enGhostPeriode({ vilkarsgrunnlagId })],
                    }),
                ],
            });

            const tilfelle = finnSykefraværstilfelle(person, valgtPeriode);

            expect(tilfelle.status).toBe('annullert');
            expect(tilfelle.vilkarsgrunnlagId).toBe(vilkarsgrunnlagId);
        });

        it('viser grunnlaget når bare noen av periodene er annullert', () => {
            const valgtPeriode = enAnnullertPeriode(vedtaksperiodeIdA);
            const utbetaltPeriode = enBeregnetPeriode({
                vedtaksperiodeId: vedtaksperiodeIdB,
                vilkarsgrunnlagId,
                periodetilstand: ApiPeriodetilstand.Utbetalt,
            });
            const person = enPerson({
                arbeidsgivere: [
                    enArbeidsgiverMedBehandlinger(
                        [utbetaltPeriode, valgtPeriode],
                        [enBeregnetPeriode({ vedtaksperiodeId: vedtaksperiodeIdA, vilkarsgrunnlagId })],
                    ),
                ],
            });

            const tilfelle = finnSykefraværstilfelle(person, valgtPeriode);

            expect(idene(tilfelle.perioder)).toEqual(idene([valgtPeriode, utbetaltPeriode]));
            expect(tilfelle.vilkarsgrunnlagId).toBe(vilkarsgrunnlagId);
            expect(tilfelle.status).toBe('vis');
        });

        it('tar med den annullerte behandlingen, ikke den fra før annulleringen, når en annen periode er valgt', () => {
            const valgtPeriode = enBeregnetPeriode({ vedtaksperiodeId: vedtaksperiodeIdB, vilkarsgrunnlagId });
            const annullertPeriode = enAnnullertPeriode(vedtaksperiodeIdA);
            const person = enPerson({
                arbeidsgivere: [
                    enArbeidsgiverMedBehandlinger(
                        [valgtPeriode, annullertPeriode],
                        [enBeregnetPeriode({ vedtaksperiodeId: vedtaksperiodeIdA, vilkarsgrunnlagId })],
                    ),
                ],
            });

            const tilfelle = finnSykefraværstilfelle(person, valgtPeriode);

            expect(idene(tilfelle.perioder)).toEqual(idene([valgtPeriode, annullertPeriode]));
        });
    });
});

describe('finnSykefraværstilfelleForSkjæringstidspunkt', () => {
    it('gir det nyeste grunnlaget for skjæringstidspunktet, med de uberegnede periodene', () => {
        const nyesteA = periodeA({ vilkarsgrunnlagId: annetVilkårsgrunnlagId });
        const uberegnetB = enUberegnetPeriode({ vedtaksperiodeId: vedtaksperiodeIdB });
        const ghostPeriode = enGhostPeriode({ vilkarsgrunnlagId: annetVilkårsgrunnlagId });
        const person = enPerson({
            arbeidsgivere: [
                enArbeidsgiverMedBehandlinger([uberegnetB, nyesteA], [periodeA({ vilkarsgrunnlagId })]),
                enArbeidsgiver({ ghostPerioder: [ghostPeriode] }),
            ],
        });

        const tilfelle = finnSykefraværstilfelleForSkjæringstidspunkt(person, '2020-01-01');

        expect(idene(tilfelle.perioder)).toEqual(idene([nyesteA, uberegnetB, ghostPeriode]));
        expect(tilfelle.vilkarsgrunnlagId).toBe(annetVilkårsgrunnlagId);
        expect(tilfelle.status).toBe('vis');
    });

    it('gir de uberegnede periodene når ingen perioder med skjæringstidspunktet er beregnet', () => {
        const uberegnet = enUberegnetPeriode({ skjaeringstidspunkt: '2020-06-01' });
        const person = enPerson({
            arbeidsgivere: [enArbeidsgiverMedBehandlinger([uberegnet, enBeregnetPeriode({ vilkarsgrunnlagId })])],
        });

        const tilfelle = finnSykefraværstilfelleForSkjæringstidspunkt(person, '2020-06-01');

        expect(idene(tilfelle.perioder)).toEqual(idene([uberegnet]));
        expect(tilfelle.vilkarsgrunnlagId).toBeNull();
        expect(tilfelle.status).toBe('ikkeBeregnet');
    });

    it('gir ingen perioder for et ukjent skjæringstidspunkt', () => {
        const person = enPerson({ arbeidsgivere: [enArbeidsgiverMedBehandlinger([enBeregnetPeriode()])] });

        expect(finnSykefraværstilfelleForSkjæringstidspunkt(person, '2019-01-01').perioder).toEqual([]);
    });
});

describe('redigeringISykefraværstilfellet', () => {
    it('kan redigere det nyeste grunnlaget for skjæringstidspunktet', () => {
        const person = enPerson({
            arbeidsgivere: [enArbeidsgiverMedBehandlinger([periodeA({ vilkarsgrunnlagId })])],
        });

        expect(redigeringISykefraværstilfellet(person, vilkarsgrunnlagId, false)).toEqual({
            kanRedigere: true,
            erEldreGrunnlag: false,
            erRevurdering: true,
        });
    });

    it('kan ikke redigere et eldre grunnlag', () => {
        const person = enPerson({
            arbeidsgivere: [
                enArbeidsgiverMedBehandlinger(
                    [periodeA({ vilkarsgrunnlagId: annetVilkårsgrunnlagId })],
                    [periodeA({ vilkarsgrunnlagId })],
                ),
            ],
        });

        expect(redigeringISykefraværstilfellet(person, vilkarsgrunnlagId, false)).toMatchObject({
            kanRedigere: false,
            erEldreGrunnlag: true,
        });
    });

    it('kan ikke redigere når totrinnsvurderingen venter på beslutter', () => {
        const person = enPerson({
            arbeidsgivere: [enArbeidsgiverMedBehandlinger([periodeA({ vilkarsgrunnlagId })])],
        });

        expect(redigeringISykefraværstilfellet(person, vilkarsgrunnlagId, true).kanRedigere).toBe(false);
    });

    it('kan ikke redigere når alle periodene er annullert', () => {
        const person = enPerson({
            arbeidsgivere: [
                enArbeidsgiverMedBehandlinger(
                    [enAnnullertPeriode(vedtaksperiodeIdA)],
                    [periodeA({ vilkarsgrunnlagId })],
                ),
            ],
        });

        expect(redigeringISykefraværstilfellet(person, vilkarsgrunnlagId, false)).toEqual({
            kanRedigere: false,
            erEldreGrunnlag: false,
            erRevurdering: false,
        });
    });

    it('kan redigere når bare noen av periodene er annullert', () => {
        const person = enPerson({
            arbeidsgivere: [
                enArbeidsgiverMedBehandlinger(
                    [periodeB({ vilkarsgrunnlagId }), enAnnullertPeriode(vedtaksperiodeIdA)],
                    [periodeA({ vilkarsgrunnlagId })],
                ),
            ],
        });

        expect(redigeringISykefraværstilfellet(person, vilkarsgrunnlagId, false).kanRedigere).toBe(true);
    });

    it('kan ikke redigere uten vilkårsgrunnlag', () => {
        const person = enPerson({ arbeidsgivere: [enArbeidsgiverMedBehandlinger([enUberegnetPeriode()])] });

        expect(redigeringISykefraværstilfellet(person, null, false)).toEqual({
            kanRedigere: false,
            erEldreGrunnlag: false,
            erRevurdering: false,
        });
    });

    it('er ikke en revurdering når den første perioden i sykefraværstilfellet ikke er utbetalt', () => {
        const person = enPerson({
            arbeidsgivere: [
                enArbeidsgiverMedBehandlinger([
                    periodeB({ vilkarsgrunnlagId, fom: '2020-02-01', tom: '2020-02-29' }),
                    periodeA({ vilkarsgrunnlagId, fom: '2020-01-01', tom: '2020-01-31' }).medUtbetaling(
                        enUtbetaling({ status: ApiUtbetalingstatus.IKKEGODKJENT }),
                    ),
                ]),
            ],
        });

        expect(redigeringISykefraværstilfellet(person, vilkarsgrunnlagId, false).erRevurdering).toBe(false);
    });

    it('er en revurdering når den første perioden i sykefraværstilfellet er utbetalt', () => {
        const person = enPerson({
            arbeidsgivere: [
                enArbeidsgiverMedBehandlinger([
                    periodeB({ vilkarsgrunnlagId, fom: '2020-02-01', tom: '2020-02-29' }).medUtbetaling(
                        enUtbetaling({ status: ApiUtbetalingstatus.IKKEGODKJENT }),
                    ),
                    periodeA({ vilkarsgrunnlagId, fom: '2020-01-01', tom: '2020-01-31' }),
                ]),
            ],
        });

        expect(redigeringISykefraværstilfellet(person, vilkarsgrunnlagId, false).erRevurdering).toBe(true);
    });
});

function idene(perioder: ActivePeriod[]): string[] {
    return perioder.map((periode) => periode.id).sort();
}

// Behandlingene ligger nyeste først, som fra Spesialist
function enArbeidsgiverMedBehandlinger(...behandlinger: ApiPeriode[][]) {
    return enArbeidsgiver({ behandlinger: behandlinger.map((perioder) => enBehandling({ perioder })) });
}

function periodeA(overrides: Partial<ApiBeregnetPeriode>) {
    return enBeregnetPeriode({ vedtaksperiodeId: vedtaksperiodeIdA, ...overrides });
}

function periodeB(overrides: Partial<ApiBeregnetPeriode>) {
    return enBeregnetPeriode({ vedtaksperiodeId: vedtaksperiodeIdB, ...overrides });
}

// Spleis sender annullerte perioder uten vilkårsgrunnlag
function enAnnullertPeriode(
    vedtaksperiodeId: string,
    periodetilstand: ApiPeriodetilstand = ApiPeriodetilstand.Annullert,
) {
    return enBeregnetPeriode({ vedtaksperiodeId, vilkarsgrunnlagId: null, periodetilstand });
}
