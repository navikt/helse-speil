import '@testing-library/jest-dom/extend-expect';
import { queries, queryHelpers, render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { AvvistBegrunnelse, Dagtype, Utbetalingsdag } from 'internal-types';
import React from 'react';

import { MerknaderCell } from './MerknaderCell';

const queryByDataTip = queryHelpers.queryByAttribute.bind(null, 'data-tip');

const enUtbetalingsdag: Utbetalingsdag = {
    dato: dayjs(),
    type: Dagtype.Syk,
};

describe('MerknaderCell', () => {
    test('rendrer merknad om siste utbetalingsdag', () => {
        render(<MerknaderCell dag={enUtbetalingsdag} isMaksdato={true} />);
        expect(screen.getByText('Siste utbetalingsdag for sykepenger')).toBeVisible();
    });

    test('rendrer merknad om foreldet dag', () => {
        const screen = render(
            <MerknaderCell dag={{ ...enUtbetalingsdag, type: Dagtype.Foreldet }} isMaksdato={false} />,
            { queries: { queryByDataTip } }
        );
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
        ] as AvvistBegrunnelse[];

        const screen = render(<MerknaderCell dag={{ ...enUtbetalingsdag, avvistÅrsaker }} isMaksdato={false} />, {
            queries: { ...queries, queryByDataTip },
        });

        expect(screen.getByText('Personen er død')).toBeVisible();
        expect(screen.queryByDataTip('Egenmelding utenfor arbeidsgiverperioden')).toBeVisible();
        expect(screen.queryByDataTip('Sykdomsgrad under 20%')).toBeVisible();
        expect(screen.queryByDataTip('Over 70 år')).toBeVisible();
        expect(screen.queryByDataTip('Krav til 4 ukers opptjening er ikke oppfylt')).toBeVisible();
        expect(screen.queryByDataTip('Krav til medlemskap er ikke oppfylt')).toBeVisible();
        expect(screen.queryByDataTip('Maks antall sykepengedager er nådd')).toBeVisible();
    });
});
