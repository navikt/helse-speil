import { nanoid } from 'nanoid';

import { getOppgavereferanse, harBlittUtbetaltTidligere } from '@state/selectors/period';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enGenerasjon } from '@test-data/generasjon';
import { enOppgave } from '@test-data/oppgave';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { enUtbetaling, enVurdering } from '@test-data/utbetaling';

describe('getOppgavereferanse', () => {
    it('returnerer en oppgavereferanse for beregnede perioder som har en oppgave', () => {
        const id = nanoid();
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
    it('returnerer true om det finnes en periode i en tidligere generasjon som deler vedtaksperiode med den gitte perioden som har blitt utbetalt', () => {
        const vedtaksperiodeId = nanoid();
        const ikkeUtbetaltUtbetaling = enUtbetaling({ vurdering: enVurdering({ godkjent: false }) });
        const utbetaltUtbetaling = enUtbetaling({ vurdering: enVurdering({ godkjent: true }) });
        const sistePeriode = enBeregnetPeriode({ vedtaksperiodeId }).medUtbetaling(ikkeUtbetaltUtbetaling);
        const førstePeriode = enBeregnetPeriode({ vedtaksperiodeId }).medUtbetaling(utbetaltUtbetaling);
        const sisteGenerasjon = enGenerasjon({ perioder: [sistePeriode] });
        const førsteGenerasjon = enGenerasjon({ perioder: [førstePeriode] });
        const arbeidsgiver = enArbeidsgiver({ generasjoner: [sisteGenerasjon, førsteGenerasjon] });

        expect(harBlittUtbetaltTidligere(sistePeriode, arbeidsgiver)).toEqual(true);
    });

    it('returnerer false om det ikke finnes en periode i en tidligere generasjon som deler vedtaksperiode med den gitte perioden som har blitt utbetalt', () => {
        const vedtaksperiodeId = nanoid();
        const ikkeUtbetaltUtbetaling = enUtbetaling({ vurdering: enVurdering({ godkjent: false }) });
        const sistePeriode = enBeregnetPeriode({ vedtaksperiodeId }).medUtbetaling(ikkeUtbetaltUtbetaling);
        const førstePeriode = enBeregnetPeriode({ vedtaksperiodeId }).medUtbetaling(ikkeUtbetaltUtbetaling);
        const sisteGenerasjon = enGenerasjon({ perioder: [sistePeriode] });
        const førsteGenerasjon = enGenerasjon({ perioder: [førstePeriode] });
        const arbeidsgiver = enArbeidsgiver({ generasjoner: [sisteGenerasjon, førsteGenerasjon] });

        expect(harBlittUtbetaltTidligere(sistePeriode, arbeidsgiver)).toEqual(false);
    });

    it('returnerer false om det ikke finnes noen tidligere generasjoner', () => {
        const vedtaksperiodeId = nanoid();
        const utbetaltUtbetaling = enUtbetaling({ vurdering: enVurdering({ godkjent: true }) });
        const periode = enBeregnetPeriode({ vedtaksperiodeId }).medUtbetaling(utbetaltUtbetaling);
        const generasjon = enGenerasjon({ perioder: [periode] });
        const arbeidsgiver = enArbeidsgiver({ generasjoner: [generasjon] });

        expect(harBlittUtbetaltTidligere(periode, arbeidsgiver)).toEqual(false);
    });
});
