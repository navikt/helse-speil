import '@testing-library/jest-dom/extend-expect';
import { queries, queryHelpers, render, screen } from '@testing-library/react';
import React from 'react';

import { MerknaderCell } from './MerknaderCell';
import { Begrunnelse, Kildetype } from '@io/graphql';

const defaultRenderOptions = {
    queries: {
        ...queries,
        queryByDataTip: queryHelpers.queryByAttribute.bind(null, 'data-tip'),
        queryAllByDataTip: queryHelpers.queryAllByAttribute.bind(null, 'data-tip'),
    },
};

const getUtbetalingstabellDag = (overrides?: Partial<UtbetalingstabellDag>): UtbetalingstabellDag => ({
    dato: '2022-01-01',
    kilde: { id: '123', type: Kildetype.Inntektsmelding },
    type: 'Syk',
    erAGP: false,
    erAvvist: false,
    erForeldet: false,
    erMaksdato: false,
    ...overrides,
});

describe('MerknaderCell', () => {
    test('rendrer merknad om siste utbetalingsdag', () => {
        render(<MerknaderCell dag={getUtbetalingstabellDag({ erMaksdato: true })} alderVedSkjæringstidspunkt={30} />);
        expect(screen.getByText('Siste utbetalingsdag for sykepenger')).toBeVisible();
    });

    test('rendrer merknad om foreldet dag', () => {
        const screen = render(
            <MerknaderCell dag={getUtbetalingstabellDag({ erForeldet: true })} alderVedSkjæringstidspunkt={30} />,
            defaultRenderOptions,
        );
        expect(screen.queryByDataTip('Foreldet')).toBeVisible();
    });

    test('rendrer avvisningsårsaker', () => {
        const begrunnelser: Array<Begrunnelse> = [
            Begrunnelse.EtterDodsdato,
            Begrunnelse.EgenmeldingUtenforArbeidsgiverperiode,
            Begrunnelse.MinimumSykdomsgrad,
            Begrunnelse.MinimumInntekt,
            Begrunnelse.MinimumInntektOver_67,
            Begrunnelse.ManglerOpptjening,
            Begrunnelse.ManglerMedlemskap,
            Begrunnelse.SykepengedagerOppbrukt,
            Begrunnelse.SykepengedagerOppbruktOver_67,
            Begrunnelse.Over_70,
        ];

        const screen = render(
            <MerknaderCell dag={getUtbetalingstabellDag({ begrunnelser })} alderVedSkjæringstidspunkt={30} />,
            defaultRenderOptions,
        );

        expect(screen.getByText('Personen er død')).toBeVisible();
        expect(screen.queryByDataTip('Egenmelding utenfor arbeidsgiverperioden')).toBeVisible();
        expect(screen.queryByDataTip('Sykdomsgrad under 20 %')).toBeVisible();
        expect(screen.queryByDataTip('Krav til 4 ukers opptjening er ikke oppfylt')).toBeVisible();
        expect(screen.queryByDataTip('Krav til medlemskap er ikke oppfylt')).toBeVisible();
        expect(screen.queryByDataTip('Personen er 70 år eller eldre')).toBeVisible();

        expect(screen.queryAllByDataTip('Inntekt under krav til minste sykepengegrunnlag')).toHaveLength(2);
        expect(screen.queryAllByDataTip('Maks antall sykepengedager er nådd')).toHaveLength(2);
    });

    test('rendrer riktig for forskjellige varianter av minimum inntekt', () => {
        const screen = render(
            <MerknaderCell
                dag={getUtbetalingstabellDag({ begrunnelser: [Begrunnelse.MinimumInntekt] })}
                alderVedSkjæringstidspunkt={69}
            />,
            defaultRenderOptions,
        );

        expect(screen.queryByDataTip('Inntekt under krav til minste sykepengegrunnlag')).toBeVisible();
        expect(screen.queryByText('§ 8-51')).toBeVisible();

        screen.rerender(
            <MerknaderCell
                dag={getUtbetalingstabellDag({ begrunnelser: [Begrunnelse.MinimumInntekt] })}
                alderVedSkjæringstidspunkt={66}
            />,
        );
        expect(screen.queryByDataTip('Inntekt under krav til minste sykepengegrunnlag')).toBeVisible();
        expect(screen.queryByText('§ 8-3')).toBeVisible();

        screen.rerender(
            <MerknaderCell
                dag={getUtbetalingstabellDag({ begrunnelser: [Begrunnelse.MinimumInntektOver_67] })}
                alderVedSkjæringstidspunkt={69}
            />,
        );
        expect(screen.queryByDataTip('Inntekt under krav til minste sykepengegrunnlag')).toBeVisible();
        expect(screen.queryByText('§ 8-51')).toBeVisible();
    });
});
