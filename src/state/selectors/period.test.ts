import { getOppgavereferanse, harBlittUtbetaltTidligere } from '@state/selectors/period';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enOppgave } from '@test-data/oppgave';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { enUtbetaling, enVurdering } from '@test-data/utbetaling';
import { generateId } from '@utils/generateId';

describe('getOppgavereferanse', () => {
    it('returnerer en oppgavereferanse for beregnede perioder som har en oppgave', () => {
        const id = generateId();
        const oppgave = enOppgave({ id });
        const periode = enBeregnetPeriode({ oppgave });

        expect(getOppgavereferanse(periode)).toEqual(id);
    });

    it('returnerer null for beregnede perioder som ikke har oppgave', () => {
        const periode = enBeregnetPeriode();

        expect(getOppgavereferanse(periode)).toBeNull();
    });

    it('returnerer null for ghostperioder', () => {
        const periode = enGhostPeriode();

        expect(getOppgavereferanse(periode)).toBeNull();
    });
});

describe('harBlittUtbetaltTidligere', () => {
    it('returnerer true om det finnes en periode i en tidligere behandling som deler vedtaksperiode med den gitte perioden som har blitt utbetalt', () => {
        const vedtaksperiodeId = generateId();
        const ikkeUtbetaltUtbetaling = enUtbetaling({ vurdering: enVurdering({ godkjent: false }) });
        const utbetaltUtbetaling = enUtbetaling({ vurdering: enVurdering({ godkjent: true }) });
        const sistePeriode = enBeregnetPeriode({ vedtaksperiodeId }).medUtbetaling(ikkeUtbetaltUtbetaling);
        const førstePeriode = enBeregnetPeriode({ vedtaksperiodeId }).medUtbetaling(utbetaltUtbetaling);
        const sisteBehandling = enBehandling({ perioder: [sistePeriode] });
        const førsteBehandling = enBehandling({ perioder: [førstePeriode] });
        const arbeidsgiver = enArbeidsgiver({ behandlinger: [sisteBehandling, førsteBehandling] });

        expect(harBlittUtbetaltTidligere(sistePeriode, arbeidsgiver)).toEqual(true);
    });

    it('returnerer false om det ikke finnes en periode i en tidligere behandling som deler vedtaksperiode med den gitte perioden som har blitt utbetalt', () => {
        const vedtaksperiodeId = generateId();
        const ikkeUtbetaltUtbetaling = enUtbetaling({ vurdering: enVurdering({ godkjent: false }) });
        const sistePeriode = enBeregnetPeriode({ vedtaksperiodeId }).medUtbetaling(ikkeUtbetaltUtbetaling);
        const førstePeriode = enBeregnetPeriode({ vedtaksperiodeId }).medUtbetaling(ikkeUtbetaltUtbetaling);
        const sisteBehandling = enBehandling({ perioder: [sistePeriode] });
        const førsteBehanlding = enBehandling({ perioder: [førstePeriode] });
        const arbeidsgiver = enArbeidsgiver({ behandlinger: [sisteBehandling, førsteBehanlding] });

        expect(harBlittUtbetaltTidligere(sistePeriode, arbeidsgiver)).toEqual(false);
    });

    it('returnerer false om det ikke finnes noen tidligere behandlinger', () => {
        const vedtaksperiodeId = generateId();
        const utbetaltUtbetaling = enUtbetaling({ vurdering: enVurdering({ godkjent: true }) });
        const periode = enBeregnetPeriode({ vedtaksperiodeId }).medUtbetaling(utbetaltUtbetaling);
        const behandling = enBehandling({ perioder: [periode] });
        const arbeidsgiver = enArbeidsgiver({ behandlinger: [behandling] });

        expect(harBlittUtbetaltTidligere(periode, arbeidsgiver)).toEqual(false);
    });
});
