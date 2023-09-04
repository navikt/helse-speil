import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { SykepengegrunnlagsgrenseView } from './SykepengegrunnlagsgrenseView';

describe('Sykepengegrunnlagsgrense', () => {
    test('rendrer SykepengegrunnlagsgrenseView med ubegrenset sykepengegrunnlag', () => {
        render(
            <SykepengegrunnlagsgrenseView
                sykepengegrunnlagsgrense={{ grunnbelop: 106399, grense: 638394, virkningstidspunkt: '2021-05-01' }}
                omregnetÅrsinntekt={600_000}
            />,
        );
        expect(screen.queryByText('Grunnbeløp (G) ved skjæringstidspunkt:', { exact: false })).toBeVisible();
        expect(
            screen.queryByText('Sykepengegrunnlaget er begrenset til 6G:', { exact: false }),
        ).not.toBeInTheDocument();
    });
    test('rendrer SykepengegrunnlagsgrenseView med begrenset sykepengegrunnlag', () => {
        render(
            <SykepengegrunnlagsgrenseView
                sykepengegrunnlagsgrense={{ grunnbelop: 106399, grense: 638394, virkningstidspunkt: '2021-05-01' }}
                omregnetÅrsinntekt={650_000}
            />,
        );
        expect(screen.queryByText('Grunnbeløp (G) ved skjæringstidspunkt:', { exact: false })).toBeVisible();
        expect(screen.queryByText('Sykepengegrunnlaget er begrenset til 6G:', { exact: false })).toBeVisible();
    });
});
