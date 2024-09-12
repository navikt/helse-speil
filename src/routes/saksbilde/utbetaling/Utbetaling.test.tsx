import { nanoid } from 'nanoid';
import React from 'react';

import { Inntektstype, Utbetalingsdagtype } from '@io/graphql';
import { useCurrentArbeidsgiverOld, useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useReadonly } from '@state/toggles';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enOppgave } from '@test-data/oppgave';
import { enBeregnetPeriode, enDag } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { enUtbetaling } from '@test-data/utbetaling';
import { ApolloWrapper, RecoilWrapper } from '@test-wrappers';
import { render, screen } from '@testing-library/react';

import { Utbetaling } from './Utbetaling';

jest.mock('@state/person');
jest.mock('@state/periode');
jest.mock('@state/arbeidsgiver');
jest.mock('@state/toggles');
jest.mock('@utils/featureToggles', () => ({
    kanOverstyreMinimumSykdomsgrad: false,
}));

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
        (useCurrentArbeidsgiverOld as jest.Mock).mockReturnValue(arbeidsgiver);
        (useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning as jest.Mock).mockReturnValue(true);
        (useReadonly as jest.Mock).mockReturnValue({ value: false, override: false });

        render(<Utbetaling person={person} />, { wrapper: ApolloWrapper });

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
        (useCurrentArbeidsgiverOld as jest.Mock).mockReturnValue(arbeidsgiver);
        (useReadonly as jest.Mock).mockReturnValue({ value: false, override: false });

        render(<Utbetaling person={person} />, { wrapper: ApolloWrapper });

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
        (useCurrentArbeidsgiverOld as jest.Mock).mockReturnValue(arbeidsgiver);
        (useReadonly as jest.Mock).mockReturnValue({ value: false, override: false });

        render(<Utbetaling person={person} />, { wrapper: ApolloWrapper });

        expect(screen.getByText('Endre')).toBeVisible();
    });

    it('rendrer utbetaling for periode som har vært delvis behandlet i Infotrygd', () => {
        const periodeA = enBeregnetPeriode().medOppgave().somErTilGodkjenning();
        const periodeB = enBeregnetPeriode().medUtbetaling(enUtbetaling({ arbeidsgiverFagsystemId: nanoid() }));
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeB, periodeA]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useActivePeriod as jest.Mock).mockReturnValue(periodeA);
        (useCurrentArbeidsgiverOld as jest.Mock).mockReturnValue(arbeidsgiver);

        render(<Utbetaling person={person} />, { wrapper: ApolloWrapper });

        expect(screen.getByText('Endre')).toBeVisible();
    });

    it('rendrer utbetaling for periode som har et tidligere skjæringstidspunkt', () => {
        const periodeA = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-01' }).medOppgave().somErTilGodkjenning();
        const periodeB = enBeregnetPeriode({ skjaeringstidspunkt: '2020-02-01' });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeB, periodeA]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useActivePeriod as jest.Mock).mockReturnValue(periodeA);
        (useCurrentArbeidsgiverOld as jest.Mock).mockReturnValue(arbeidsgiver);
        (useReadonly as jest.Mock).mockReturnValue({ value: false, override: false });

        render(<Utbetaling person={person} />, { wrapper: ApolloWrapper });

        expect(screen.getByText('Endre')).toBeVisible();
    });

    it('rendrer utbetaling for periode som har et tidligere skjæringstidspunkt - readonly override satt', () => {
        const periodeA = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-01' }).medOppgave().somErTilGodkjenning();
        const periodeB = enBeregnetPeriode({ skjaeringstidspunkt: '2020-02-01' });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeB, periodeA]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useActivePeriod as jest.Mock).mockReturnValue(periodeA);
        (useCurrentArbeidsgiverOld as jest.Mock).mockReturnValue(arbeidsgiver);
        (useReadonly as jest.Mock).mockReturnValue({ value: true, override: true });

        render(<Utbetaling person={person} />, { wrapper: RecoilWrapper });

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
        (useCurrentArbeidsgiverOld as jest.Mock).mockReturnValue(arbeidsgiverA);

        render(<Utbetaling person={person} />, { wrapper: RecoilWrapper });

        expect(screen.queryByText('Endre')).not.toBeInTheDocument();
        expect(screen.queryByText('Revurder')).not.toBeInTheDocument();
    });
});
