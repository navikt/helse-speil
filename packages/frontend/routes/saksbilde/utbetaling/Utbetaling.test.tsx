import { RecoilWrapper } from '@test-wrappers';
import { nanoid } from 'nanoid';
import React from 'react';

import { Inntektstype, Utbetalingsdagtype } from '@io/graphql';
import { useCurrentArbeidsgiver, useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { useReadonly } from '@state/toggles';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enOppgave } from '@test-data/oppgave';
import { enBeregnetPeriode, enDag } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { enUtbetaling } from '@test-data/utbetaling';
import { render, screen } from '@testing-library/react';

import { Utbetaling } from './Utbetaling';

jest.mock('@state/person');
jest.mock('@state/periode');
jest.mock('@state/arbeidsgiver');
jest.mock('@state/toggles');

describe('Utbetaling', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('rendrer revurderbar utbetaling', () => {
        const oppgave = enOppgave();
        const tidslinje = [enDag({ dato: '2020-01-01' }), enDag({ dato: '2020-01-02' }), enDag({ dato: '2020-01-03' })];
        const periode = enBeregnetPeriode({ oppgave, tidslinje });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useActivePeriod as jest.Mock).mockReturnValue(periode);
        (useCurrentArbeidsgiver as jest.Mock).mockReturnValue(arbeidsgiver);
        (useCurrentPerson as jest.Mock).mockReturnValue(person);
        (useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning as jest.Mock).mockReturnValue(true);

        render(<Utbetaling />, { wrapper: RecoilWrapper });

        screen.debug();
        expect(screen.getByText('Revurder')).toBeVisible();
        expect(screen.getByText('3 dager')).toBeVisible();
        expect(screen.getByText('01.01.2020')).toBeVisible();
        expect(screen.getByText('02.01.2020')).toBeVisible();
        expect(screen.getByText('03.01.2020')).toBeVisible();
        expect(screen.getAllByText('100 %')).toHaveLength(6);
        expect(screen.getAllByText('Syk')).toHaveLength(3);
    });

    it('rendrer utbetaling for forkastet periode', () => {
        const tidslinje = [enDag({ dato: '2020-01-01' })];
        const periode = enBeregnetPeriode({ tidslinje }).medOppgave().somErForkastet().somErTilGodkjenning();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useActivePeriod as jest.Mock).mockReturnValue(periode);
        (useCurrentArbeidsgiver as jest.Mock).mockReturnValue(arbeidsgiver);
        (useCurrentPerson as jest.Mock).mockReturnValue(person);

        render(<Utbetaling />, { wrapper: RecoilWrapper });

        expect(screen.getByText('Kan ikke revurdere perioden på grunn av manglende datagrunnlag')).toBeVisible();
    });

    it('rendrer utbetaling for periode med kun AGP', () => {
        const tidslinje = [
            enDag({ dato: '2020-01-01', utbetalingsdagtype: Utbetalingsdagtype.Arbeidsgiverperiodedag }),
        ];
        const periode = enBeregnetPeriode({ tidslinje }).medOppgave().somErTilGodkjenning();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useActivePeriod as jest.Mock).mockReturnValue(periode);
        (useCurrentArbeidsgiver as jest.Mock).mockReturnValue(arbeidsgiver);
        (useCurrentPerson as jest.Mock).mockReturnValue(person);

        render(<Utbetaling />, { wrapper: RecoilWrapper });

        expect(screen.getByText('Endre')).toBeVisible();
    });

    it('rendrer utbetaling for periode som har vært delvis behandlet i Infotrygd', () => {
        const periodeA = enBeregnetPeriode().medOppgave().somErTilGodkjenning();
        const periodeB = enBeregnetPeriode().medUtbetaling(enUtbetaling({ arbeidsgiverFagsystemId: nanoid() }));
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeB, periodeA]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useActivePeriod as jest.Mock).mockReturnValue(periodeA);
        (useCurrentArbeidsgiver as jest.Mock).mockReturnValue(arbeidsgiver);
        (useCurrentPerson as jest.Mock).mockReturnValue(person);

        render(<Utbetaling />, { wrapper: RecoilWrapper });

        expect(screen.getByText('Endre')).toBeVisible();
    });

    it('rendrer utbetaling for periode som har et tidligere skjæringstidspunkt', () => {
        const periodeA = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-01' }).medOppgave().somErTilGodkjenning();
        const periodeB = enBeregnetPeriode({ skjaeringstidspunkt: '2020-02-01' });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeB, periodeA]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useActivePeriod as jest.Mock).mockReturnValue(periodeA);
        (useCurrentArbeidsgiver as jest.Mock).mockReturnValue(arbeidsgiver);
        (useCurrentPerson as jest.Mock).mockReturnValue(person);
        (useReadonly as jest.Mock).mockReturnValue({ value: false, override: false });

        render(<Utbetaling />, { wrapper: RecoilWrapper });

        expect(screen.getByText('Endre')).toBeVisible();
    });

    it('rendrer utbetaling for periode som har et tidligere skjæringstidspunkt - readonly override satt', () => {
        const periodeA = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-01' }).medOppgave().somErTilGodkjenning();
        const periodeB = enBeregnetPeriode({ skjaeringstidspunkt: '2020-02-01' });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeB, periodeA]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useActivePeriod as jest.Mock).mockReturnValue(periodeA);
        (useCurrentArbeidsgiver as jest.Mock).mockReturnValue(arbeidsgiver);
        (useCurrentPerson as jest.Mock).mockReturnValue(person);
        (useReadonly as jest.Mock).mockReturnValue({ value: true, override: true });

        render(<Utbetaling />, { wrapper: RecoilWrapper });

        expect(screen.queryByText('Endre')).not.toBeInTheDocument();
    });

    it('rendrer utbetaling for periode som ikke kan overstyres eller revurderes', () => {
        const periodeA = enBeregnetPeriode({ inntektstype: Inntektstype.Flerearbeidsgivere })
            .medOppgave()
            .somErTilGodkjenning();
        const periodeB = enBeregnetPeriode({ inntektstype: Inntektstype.Flerearbeidsgivere });
        const arbeidsgiverA = enArbeidsgiver().medPerioder([periodeA]);
        const arbeidsgiverB = enArbeidsgiver().medPerioder([periodeB]);
        const person = enPerson().medArbeidsgivere([arbeidsgiverA, arbeidsgiverB]);

        (useActivePeriod as jest.Mock).mockReturnValue(periodeA);
        (useCurrentArbeidsgiver as jest.Mock).mockReturnValue(arbeidsgiverA);
        (useCurrentPerson as jest.Mock).mockReturnValue(person);

        render(<Utbetaling />, { wrapper: RecoilWrapper });

        expect(screen.queryByText('Endre')).not.toBeInTheDocument();
        expect(screen.queryByText('Revurder')).not.toBeInTheDocument();
    });
});
