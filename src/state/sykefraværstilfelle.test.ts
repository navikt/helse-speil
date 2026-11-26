import { ApiBeregnetPeriode, ApiPeriode, ApiPeriodetilstand } from '@io/rest/generated/spesialist.schemas';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode, enGhostPeriode, enUberegnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { ActivePeriod } from '@typer/shared';

import { finnSykefraværstilfelle } from './sykefraværstilfelle';

const vilkarsgrunnlagId = '3f1c2a8e-5b7d-4e9a-9c61-2d8f4b7a1e05';
const annetVilkårsgrunnlagId = '8a4e6d21-0c3f-4b8e-a5d7-6f9b2c1e4d38';

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

    describe('uten vilkårsgrunnlag', () => {
        it('gir de uberegnede periodene med samme skjæringstidspunkt når en uberegnet periode er valgt', () => {
            const valgtPeriode = enUberegnetPeriode({ skjaeringstidspunkt: '2020-01-01' });
            const uberegnetISammeTilfelle = enUberegnetPeriode({ skjaeringstidspunkt: '2020-01-01' });
            const uberegnetHosAnnenArbeidsgiver = enUberegnetPeriode({ skjaeringstidspunkt: '2020-01-01' });
            const uberegnetIAnnetTilfelle = enUberegnetPeriode({ skjaeringstidspunkt: '2020-06-01' });
            const beregnetMedSammeSkjæringstidspunkt = enBeregnetPeriode({
                skjaeringstidspunkt: '2020-01-01',
                vilkarsgrunnlagId,
            });
            const person = enPerson({
                arbeidsgivere: [
                    enArbeidsgiverMedBehandlinger([
                        uberegnetIAnnetTilfelle,
                        beregnetMedSammeSkjæringstidspunkt,
                        uberegnetISammeTilfelle,
                        valgtPeriode,
                    ]),
                    enArbeidsgiver({
                        behandlinger: [enBehandling({ perioder: [uberegnetHosAnnenArbeidsgiver] })],
                        ghostPerioder: [enGhostPeriode({ skjaeringstidspunkt: '2020-01-01' })],
                    }),
                ],
            });

            const tilfelle = finnSykefraværstilfelle(person, valgtPeriode);

            expect(idene(tilfelle.perioder)).toEqual(
                idene([valgtPeriode, uberegnetISammeTilfelle, uberegnetHosAnnenArbeidsgiver]),
            );
            expect(tilfelle.vilkarsgrunnlagId).toBeNull();
            expect(tilfelle.status).toBe('ikkeBeregnet');
        });

        it('tar ikke med uberegnede perioder i et beregnet sykefraværstilfelle', () => {
            const valgtPeriode = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-01', vilkarsgrunnlagId });
            const uberegnetMedSammeSkjæringstidspunkt = enUberegnetPeriode({ skjaeringstidspunkt: '2020-01-01' });
            const person = enPerson({
                arbeidsgivere: [
                    enArbeidsgiverMedBehandlinger([valgtPeriode]),
                    enArbeidsgiverMedBehandlinger([uberegnetMedSammeSkjæringstidspunkt]),
                ],
            });

            const tilfelle = finnSykefraværstilfelle(person, valgtPeriode);

            expect(idene(tilfelle.perioder)).toEqual(idene([valgtPeriode]));
        });

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
            const valgtPeriode = enAnnullertPeriode('vedtaksperiode-a');
            const periodeTilAnnullering = enAnnullertPeriode('vedtaksperiode-b', ApiPeriodetilstand.TilAnnullering);
            const person = enPerson({
                arbeidsgivere: [
                    enArbeidsgiver({
                        behandlinger: [
                            enBehandling({ perioder: [periodeTilAnnullering, valgtPeriode] }),
                            enBehandling({
                                perioder: [
                                    enBeregnetPeriode({ vedtaksperiodeId: 'vedtaksperiode-b', vilkarsgrunnlagId }),
                                    enBeregnetPeriode({ vedtaksperiodeId: 'vedtaksperiode-a', vilkarsgrunnlagId }),
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
            const valgtPeriode = enAnnullertPeriode('vedtaksperiode-a');
            const utbetaltPeriode = enBeregnetPeriode({
                vedtaksperiodeId: 'vedtaksperiode-b',
                vilkarsgrunnlagId,
                periodetilstand: ApiPeriodetilstand.Utbetalt,
            });
            const person = enPerson({
                arbeidsgivere: [
                    enArbeidsgiverMedBehandlinger(
                        [utbetaltPeriode, valgtPeriode],
                        [enBeregnetPeriode({ vedtaksperiodeId: 'vedtaksperiode-a', vilkarsgrunnlagId })],
                    ),
                ],
            });

            const tilfelle = finnSykefraværstilfelle(person, valgtPeriode);

            expect(idene(tilfelle.perioder)).toEqual(idene([valgtPeriode, utbetaltPeriode]));
            expect(tilfelle.vilkarsgrunnlagId).toBe(vilkarsgrunnlagId);
            expect(tilfelle.status).toBe('vis');
        });

        it('tar med den annullerte behandlingen, ikke den fra før annulleringen, når en annen periode er valgt', () => {
            const valgtPeriode = enBeregnetPeriode({ vedtaksperiodeId: 'vedtaksperiode-b', vilkarsgrunnlagId });
            const annullertPeriode = enAnnullertPeriode('vedtaksperiode-a');
            const person = enPerson({
                arbeidsgivere: [
                    enArbeidsgiverMedBehandlinger(
                        [valgtPeriode, annullertPeriode],
                        [enBeregnetPeriode({ vedtaksperiodeId: 'vedtaksperiode-a', vilkarsgrunnlagId })],
                    ),
                ],
            });

            const tilfelle = finnSykefraværstilfelle(person, valgtPeriode);

            expect(idene(tilfelle.perioder)).toEqual(idene([valgtPeriode, annullertPeriode]));
        });
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
    return enBeregnetPeriode({ vedtaksperiodeId: 'vedtaksperiode-a', ...overrides });
}

function periodeB(overrides: Partial<ApiBeregnetPeriode>) {
    return enBeregnetPeriode({ vedtaksperiodeId: 'vedtaksperiode-b', ...overrides });
}

// Spleis sender annullerte perioder uten vilkårsgrunnlag
function enAnnullertPeriode(
    vedtaksperiodeId: string,
    periodetilstand: ApiPeriodetilstand = ApiPeriodetilstand.Annullert,
) {
    return enBeregnetPeriode({ vedtaksperiodeId, vilkarsgrunnlagId: null, periodetilstand });
}
