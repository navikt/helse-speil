import { nanoid } from 'nanoid';
import React from 'react';

import { Inntektstype, Utbetalingsdagtype } from '@io/graphql';
import { useAktivtInntektsforhold, useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enOppgave } from '@test-data/oppgave';
import { enBeregnetPeriode, enDag } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { enUtbetaling } from '@test-data/utbetaling';
import { render } from '@test-utils';
import { screen } from '@testing-library/react';

import { Utbetaling } from './Utbetaling';

jest.mock('@state/arbeidsgiver');

describe('Utbetaling', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('rendrer revurderbar utbetaling', () => {
        const oppgave = enOppgave();
        const tidslinje = [enDag({ dato: '2020-01-01' }), enDag({ dato: '2020-01-02' }), enDag({ dato: '2020-01-03' })];
        const periode = enBeregnetPeriode({ oppgave, tidslinje });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useAktivtInntektsforhold as jest.Mock).mockReturnValue(arbeidsgiver);
        (useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning as jest.Mock).mockReturnValue(true);

        render(<Utbetaling person={person} periode={periode} />);

        expect(screen.getByText('Revurder dager')).toBeVisible();
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

        (useAktivtInntektsforhold as jest.Mock).mockReturnValue(arbeidsgiver);
        (useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning as jest.Mock).mockReturnValue(true);

        render(<Utbetaling person={person} periode={periode} />);

        expect(screen.getByText('Kan ikke revurdere perioden på grunn av manglende datagrunnlag')).toBeVisible();
    });

    it('rendrer utbetaling for periode med kun AGP', () => {
        const tidslinje = [
            enDag({ dato: '2020-01-01', utbetalingsdagtype: Utbetalingsdagtype.Arbeidsgiverperiodedag }),
        ];
        const periode = enBeregnetPeriode({ tidslinje }).medOppgave().somErTilGodkjenning();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useAktivtInntektsforhold as jest.Mock).mockReturnValue(arbeidsgiver);
        (useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning as jest.Mock).mockReturnValue(true);

        render(<Utbetaling person={person} periode={periode} />);

        expect(screen.getByText('Revurder dager')).toBeVisible();
    });

    it('rendrer utbetaling for periode som har vært delvis behandlet i Infotrygd', () => {
        const periodeA = enBeregnetPeriode().medOppgave().somErTilGodkjenning();
        const periodeB = enBeregnetPeriode().medUtbetaling(enUtbetaling({ arbeidsgiverFagsystemId: nanoid() }));
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeB, periodeA]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useAktivtInntektsforhold as jest.Mock).mockReturnValue(arbeidsgiver);
        (useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning as jest.Mock).mockReturnValue(true);

        render(<Utbetaling person={person} periode={periodeA} />);

        expect(screen.getByText('Revurder dager')).toBeVisible();
    });

    it('rendrer utbetaling for periode som har et tidligere skjæringstidspunkt', () => {
        const periodeA = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-01' }).medOppgave().somErTilGodkjenning();
        const periodeB = enBeregnetPeriode({ skjaeringstidspunkt: '2020-02-01' });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeB, periodeA]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        (useAktivtInntektsforhold as jest.Mock).mockReturnValue(arbeidsgiver);
        (useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning as jest.Mock).mockReturnValue(true);

        render(<Utbetaling person={person} periode={periodeA} />);

        expect(screen.getByText('Revurder dager')).toBeVisible();
    });

    it('rendrer utbetaling for periode som ikke kan overstyres eller revurderes', () => {
        const periodeA = enBeregnetPeriode({ inntektstype: Inntektstype.Flerearbeidsgivere })
            .medOppgave()
            .somErTilGodkjenning();
        const periodeB = enBeregnetPeriode({
            inntektstype: Inntektstype.Flerearbeidsgivere,
            fom: '2024-01-01',
            tom: '2024-01-31',
            skjaeringstidspunkt: '2024-01-01',
        });
        const arbeidsgiverA = enArbeidsgiver().medPerioder([periodeA]);
        const arbeidsgiverB = enArbeidsgiver().medPerioder([periodeB]);
        const person = enPerson().medArbeidsgivere([arbeidsgiverA, arbeidsgiverB]);

        (useAktivtInntektsforhold as jest.Mock).mockReturnValue(arbeidsgiverB);
        (useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning as jest.Mock).mockReturnValue(false);

        render(<Utbetaling person={person} periode={periodeB} />);

        expect(screen.queryByText('Overstyr dager')).not.toBeInTheDocument();
    });
});
