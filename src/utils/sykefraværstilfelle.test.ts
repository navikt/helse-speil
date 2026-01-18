import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode, enGhostPeriode, enUberegnetPeriode } from '@test-data/periode';
import { finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt } from '@utils/sykefraværstilfelle';

describe('Finn vedtaksperiodeId for første periode i sykefraværstilfellet', () => {
    it('finner id med en beregnet vedtaksperiode', () => {
        const vedtaksperiodeId = 'en_vedtaksperiode_id';
        const skjæringstidspunkt = '2024-01-01';
        const beregnetPeriode = enBeregnetPeriode({
            vedtaksperiodeId: vedtaksperiodeId,
            fom: '2024-01-01',
            skjaeringstidspunkt: skjæringstidspunkt,
        });
        const arbeidsgiver = enArbeidsgiver({
            ghostPerioder: [],
            behandlinger: [enBehandling({ perioder: [beregnetPeriode] })],
        });
        const arbeidsgivere = [arbeidsgiver];

        const id = finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt(arbeidsgivere, beregnetPeriode);
        expect(id).toEqual(vedtaksperiodeId);
    });

    it('finner id med en _u_beregnet vedtaksperiode', () => {
        const vedtaksperiodeId = 'en_vedtaksperiode_id';
        const skjæringstidspunkt = '2024-01-01';
        const _u_beregnetPeriode = enUberegnetPeriode({
            vedtaksperiodeId: vedtaksperiodeId,
            fom: '2024-01-01',
            skjaeringstidspunkt: skjæringstidspunkt,
        });
        const arbeidsgiver = enArbeidsgiver({
            ghostPerioder: [],
            behandlinger: [enBehandling({ perioder: [_u_beregnetPeriode] })],
        });
        const arbeidsgivere = [arbeidsgiver];

        const id = finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt(arbeidsgivere, _u_beregnetPeriode);
        expect(id).toEqual(vedtaksperiodeId);
    });

    it('finn vedtaksperiodeId for beregnet periode når aktiv periode er en ghost', () => {
        const vedtaksperiodeId = 'en_vedtaksperiode_id';
        const skjæringstidspunkt = '2024-01-01';
        const ghostPeriode = enGhostPeriode({ fom: '2024-01-02', skjaeringstidspunkt: skjæringstidspunkt });

        const beregnetPeriode = enBeregnetPeriode({
            vedtaksperiodeId: vedtaksperiodeId,
            fom: '2024-01-01',
            skjaeringstidspunkt: skjæringstidspunkt,
        });
        const arbeidsgiver = enArbeidsgiver({
            ghostPerioder: [ghostPeriode],
            behandlinger: [enBehandling({ perioder: [beregnetPeriode] })],
        });
        const arbeidsgivere = [arbeidsgiver];

        const id = finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt(arbeidsgivere, ghostPeriode);
        expect(id).toEqual(vedtaksperiodeId);
    });

    it('finn vedtaksperiodeId for _u_beregnet periode når aktiv periode er en ghost', () => {
        const vedtaksperiodeId = 'en_vedtaksperiode_id';
        const skjæringstidspunkt = '2024-01-01';
        const ghostPeriode = enGhostPeriode({ fom: '2024-01-02', skjaeringstidspunkt: skjæringstidspunkt });

        const _u_beregnetPeriode = enUberegnetPeriode({
            vedtaksperiodeId: vedtaksperiodeId,
            fom: '2024-01-01',
            skjaeringstidspunkt: skjæringstidspunkt,
        });
        const arbeidsgiver = enArbeidsgiver({
            ghostPerioder: [ghostPeriode],
            behandlinger: [enBehandling({ perioder: [_u_beregnetPeriode] })],
        });
        const arbeidsgivere = [arbeidsgiver];

        const id = finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt(arbeidsgivere, ghostPeriode);
        expect(id).toEqual(vedtaksperiodeId);
    });

    it('finn vedtaksperiodeId for første periode med flere arbeidsgivere', () => {
        const vedtaksperiodeId = 'en_vedtaksperiode_id';
        const skjæringstidspunkt = '2024-01-01';

        const beregnetPeriodeAg1 = enBeregnetPeriode({
            vedtaksperiodeId: vedtaksperiodeId,
            fom: '2024-01-01',
            skjaeringstidspunkt: skjæringstidspunkt,
        });

        const beregnetPeriodeAg2 = enBeregnetPeriode({
            fom: '2024-01-02',
            skjaeringstidspunkt: skjæringstidspunkt,
        });
        const ag1 = enArbeidsgiver({
            ghostPerioder: [],
            behandlinger: [enBehandling({ perioder: [beregnetPeriodeAg1] })],
        });
        const ag2 = enArbeidsgiver({
            ghostPerioder: [],
            behandlinger: [enBehandling({ perioder: [beregnetPeriodeAg2] })],
        });
        const arbeidsgivere = [ag1, ag2];

        const id = finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt(arbeidsgivere, beregnetPeriodeAg2);
        expect(id).toEqual(vedtaksperiodeId);
    });

    it('finn vedtaksperiodeId for første periode med flere arbeidsgivere 2', () => {
        const vedtaksperiodeId = 'en_vedtaksperiode_id';
        const skjæringstidspunkt = '2024-01-01';

        const ghostAg1 = enGhostPeriode({
            fom: '2024-01-01',
            tom: '2024-01-31',
            skjaeringstidspunkt: skjæringstidspunkt,
        });

        const beregnetPeriode1Ag2 = enBeregnetPeriode({
            vedtaksperiodeId: vedtaksperiodeId,
            fom: '2024-01-01',
            tom: '2024-01-31',
            skjaeringstidspunkt: skjæringstidspunkt,
        });

        const ag1 = enArbeidsgiver({
            ghostPerioder: [ghostAg1],
            behandlinger: [],
        });
        const ag2 = enArbeidsgiver({
            ghostPerioder: [],
            behandlinger: [enBehandling({ perioder: [beregnetPeriode1Ag2] })],
        });
        const arbeidsgivere = [ag1, ag2];

        const id = finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt(arbeidsgivere, beregnetPeriode1Ag2);
        expect(id).toEqual(vedtaksperiodeId);
    });
});
