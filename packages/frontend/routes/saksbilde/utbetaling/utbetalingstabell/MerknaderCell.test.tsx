import '@testing-library/jest-dom/extend-expect';
import { queries, queryHelpers, render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';

import { useAlderVedSkjæringstidspunkt } from '../../../../state/person';

import { MerknaderCell } from './MerknaderCell';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

jest.mock('../../../../state/person', () => ({ useAlderVedSkjæringstidspunkt: jest.fn() }));
const mockUseAlderVedSkjæringstidspunkt = useAlderVedSkjæringstidspunkt as jest.Mock;

const queryByDataTip = queryHelpers.queryByAttribute.bind(null, 'data-tip');

const enUtbetalingsdag: UtbetalingstabellDag = {
    isMaksdato: false,
    sykdomsdag: { kilde: undefined, type: 'Syk' },
    dato: dayjs(),
    type: 'Syk',
};

describe('MerknaderCell', () => {
    test('rendrer merknad om siste utbetalingsdag', () => {
        render(<MerknaderCell dag={enUtbetalingsdag} isMaksdato={true} />);
        expect(screen.getByText('Siste utbetalingsdag for sykepenger')).toBeVisible();
    });

    test('rendrer merknad om foreldet dag', () => {
        const screen = render(<MerknaderCell dag={{ ...enUtbetalingsdag, type: 'Foreldet' }} isMaksdato={false} />, {
            queries: { queryByDataTip },
        });
        expect(screen.queryByDataTip('Foreldet')).toBeVisible();
    });

    test('rendrer avvisningsårsaker', () => {
        const avvistÅrsaker = [
            { tekst: 'EtterDødsdato' },
            { tekst: 'EgenmeldingUtenforArbeidsgiverperiode' },
            { tekst: 'MinimumSykdomsgrad' },
            { tekst: 'MinimumInntekt' },
            { tekst: 'ManglerOpptjening' },
            { tekst: 'ManglerMedlemskap' },
            { tekst: 'SykepengedagerOppbrukt' },
        ] as Avvisning[];

        const screen = render(<MerknaderCell dag={{ ...enUtbetalingsdag, avvistÅrsaker }} isMaksdato={false} />, {
            queries: { ...queries, queryByDataTip },
        });

        expect(screen.getByText('Personen er død')).toBeVisible();
        expect(screen.queryByDataTip('Egenmelding utenfor arbeidsgiverperioden')).toBeVisible();
        expect(screen.queryByDataTip('Sykdomsgrad under 20%')).toBeVisible();
        expect(screen.queryByDataTip('Inntekt under krav til minste sykepengegrunnlag')).toBeVisible();
        expect(screen.queryByDataTip('Krav til 4 ukers opptjening er ikke oppfylt')).toBeVisible();
        expect(screen.queryByDataTip('Krav til medlemskap er ikke oppfylt')).toBeVisible();
        expect(screen.queryByDataTip('Maks antall sykepengedager er nådd')).toBeVisible();
    });

    test('rendrer riktig paragraf ved minimum inntekt når person er over 67 år', () => {
        mockUseAlderVedSkjæringstidspunkt.mockImplementation(() => 69);
        const avvistÅrsaker = [{ tekst: 'MinimumInntekt' }] as Avvisning[];

        const screen = render(<MerknaderCell dag={{ ...enUtbetalingsdag, avvistÅrsaker }} isMaksdato={false} />, {
            queries: { ...queries, queryByDataTip },
        });
        expect(screen.queryByDataTip('Inntekt under krav til minste sykepengegrunnlag')).toBeVisible();
        expect(screen.queryByText('§ 8-51')).toBeVisible();
    });

    test('rendrer riktig paragraf ved minimum inntekt når person er under 67 år', () => {
        mockUseAlderVedSkjæringstidspunkt.mockImplementation(() => 66);
        const avvistÅrsaker = [{ tekst: 'MinimumInntekt' }] as Avvisning[];

        const screen = render(<MerknaderCell dag={{ ...enUtbetalingsdag, avvistÅrsaker }} isMaksdato={false} />, {
            queries: { ...queries, queryByDataTip },
        });
        expect(screen.queryByDataTip('Inntekt under krav til minste sykepengegrunnlag')).toBeVisible();
        expect(screen.queryByText('§ 8-3')).toBeVisible();
    });
});
