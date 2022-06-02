import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { SykepengegrunnlagsgrenseView } from './SykepengegrunnlagsgrenseView';

describe('Sykepengegrunnlagsgrense', () => {
    test('rendrer SykepengegrunnlagsgrenseView med ubegrenset sykepengegrunnlag', () => {
        render(
            <SykepengegrunnlagsgrenseView
                sykepengegrunnlagsgrense={{ grunnbelop: 106399, grense: 638394, virkningstidspunkt: '2021-05-01' }}
                omregnetÅrsinntekt={600_000}
            />,
        );
        expect(screen.getByText('Grunnbeløp (G) ved skjæringstidspunkt: 106 399 kr (01. May 2021)')).toBeVisible();
        expect(screen.queryByText('Sykepengegrunnlaget er begrenset til 6G: 638 394 kr')).toBeNull();
    });
    test('rendrer SykepengegrunnlagsgrenseView med begrenset sykepengegrunnlag', () => {
        render(
            <SykepengegrunnlagsgrenseView
                sykepengegrunnlagsgrense={{ grunnbelop: 106399, grense: 638394, virkningstidspunkt: '2021-05-01' }}
                omregnetÅrsinntekt={650_000}
            />,
        );
        expect(screen.getByText('Grunnbeløp (G) ved skjæringstidspunkt: 106 399 kr (01. May 2021)')).toBeVisible();
        expect(screen.queryByText('Sykepengegrunnlaget er begrenset til 6G: 638 394 kr')).toBeVisible();
    });
});
