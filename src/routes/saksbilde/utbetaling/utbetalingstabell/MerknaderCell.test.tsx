import React from 'react';

import { ApiBegrunnelse } from '@io/rest/generated/spesialist.schemas';
import { getUtbetalingstabellDag } from '@test-data/utbetalingstabell';
import { TestCellWrapper } from '@test-wrappers';
import { render, screen } from '@testing-library/react';

import { MerknaderCell } from './MerknaderCell';

describe('MerknaderCell', () => {
    test('rendrer merknad om siste utbetalingsdag', () => {
        render(
            <TestCellWrapper>
                <MerknaderCell dag={getUtbetalingstabellDag({ erMaksdato: true })} alderVedSkjæringstidspunkt={30} />
            </TestCellWrapper>,
        );
        expect(screen.getByText('Siste utbetalingsdag for sykepenger')).toBeVisible();
    });

    test('rendrer merknad om foreldet dag', () => {
        render(
            <TestCellWrapper>
                <MerknaderCell dag={getUtbetalingstabellDag({ erForeldet: true })} alderVedSkjæringstidspunkt={30} />
            </TestCellWrapper>,
        );
        expect(screen.queryByTestId('Foreldet')).toBeVisible();
    });

    test('rendrer avvisningsårsaker', () => {
        const begrunnelser: ApiBegrunnelse[] = [
            ApiBegrunnelse.ETTER_DODSDATO,
            ApiBegrunnelse.EGENMELDING_UTENFOR_ARBEIDSGIVERPERIODE,
            ApiBegrunnelse.MINIMUM_SYKDOMSGRAD,
            ApiBegrunnelse.MINIMUM_INNTEKT,
            ApiBegrunnelse.MINIMUM_INNTEKT_OVER_67,
            ApiBegrunnelse.MANGLER_OPPTJENING,
            ApiBegrunnelse.MANGLER_MEDLEMSKAP,
            ApiBegrunnelse.SYKEPENGEDAGER_OPPBRUKT,
            ApiBegrunnelse.SYKEPENGEDAGER_OPPBRUKT_OVER_67,
            ApiBegrunnelse.OVER_70,
        ];

        render(
            <TestCellWrapper>
                <MerknaderCell dag={getUtbetalingstabellDag({ begrunnelser })} alderVedSkjæringstidspunkt={30} />
            </TestCellWrapper>,
        );

        expect(screen.getByText('Personen er død')).toBeVisible();
        expect(screen.queryByTestId('Egenmelding utenfor arbeidsgiverperioden')).toBeVisible();
        expect(screen.queryByTestId('Sykdomsgrad under 20 %')).toBeVisible();
        expect(screen.queryByTestId('Krav til 4 ukers opptjening er ikke oppfylt')).toBeVisible();
        expect(screen.queryByTestId('Krav til medlemskap er ikke oppfylt')).toBeVisible();
        expect(screen.queryByTestId('Personen er 70 år eller eldre')).toBeVisible();

        expect(screen.queryAllByTestId('Inntekt under krav til minste sykepengegrunnlag')).toHaveLength(2);
        expect(screen.queryAllByTestId('Maks antall sykepengedager er nådd')).toHaveLength(2);

        expect(screen.queryByText('§ 8-7, 1. avsnitt')).toBeVisible();
    });

    test('rendrer riktig for forskjellige varianter av minimum inntekt', () => {
        const { rerender } = render(
            <TestCellWrapper>
                <MerknaderCell
                    dag={getUtbetalingstabellDag({ begrunnelser: [ApiBegrunnelse.MINIMUM_INNTEKT] })}
                    alderVedSkjæringstidspunkt={69}
                />
            </TestCellWrapper>,
        );

        expect(screen.queryByTestId('Inntekt under krav til minste sykepengegrunnlag')).toBeVisible();
        expect(screen.queryByText('§ 8-51')).toBeVisible();

        rerender(
            <TestCellWrapper>
                <MerknaderCell
                    dag={getUtbetalingstabellDag({ begrunnelser: [ApiBegrunnelse.MINIMUM_INNTEKT] })}
                    alderVedSkjæringstidspunkt={66}
                />
            </TestCellWrapper>,
        );
        expect(screen.queryByTestId('Inntekt under krav til minste sykepengegrunnlag')).toBeVisible();
        expect(screen.queryByText('§ 8-3')).toBeVisible();

        rerender(
            <TestCellWrapper>
                <MerknaderCell
                    dag={getUtbetalingstabellDag({ begrunnelser: [ApiBegrunnelse.MINIMUM_INNTEKT_OVER_67] })}
                    alderVedSkjæringstidspunkt={69}
                />
            </TestCellWrapper>,
        );
        expect(screen.queryByTestId('Inntekt under krav til minste sykepengegrunnlag')).toBeVisible();
        expect(screen.queryByText('§ 8-51')).toBeVisible();
    });
});
