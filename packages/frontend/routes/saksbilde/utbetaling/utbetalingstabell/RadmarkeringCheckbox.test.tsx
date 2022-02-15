import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import React from 'react';

import { RadmarkeringCheckbox } from './RadmarkeringCheckbox';

jest.mock('@utils/featureToggles', () => ({
    overstyrPermisjonsdagerEnabled: true,
}));

describe('RadmarkeringCheckbox', () => {
    it('rendrer checkbox for overstyrbare dager', () => {
        render(
            <>
                <RadmarkeringCheckbox index={0} dagtype="Syk" dato={dayjs()} skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} dagtype="Ferie" dato={dayjs()} skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} dagtype="Egenmelding" dato={dayjs()} skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} dagtype="Permisjon" dato={dayjs()} skjæringstidspunkt="" />;
            </>
        );

        expect(screen.getAllByRole('checkbox')).toHaveLength(4);
    });

    it('rendrer ikke checkbox for ikke-overstyrbare dager', () => {
        render(
            <>
                <RadmarkeringCheckbox index={0} dagtype="Helg" dato={dayjs()} skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} dagtype="Avslått" dato={dayjs()} skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} dagtype="Ubestemt" dato={dayjs()} skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} dagtype="Arbeidsdag" dato={dayjs()} skjæringstidspunkt="" />;
                <RadmarkeringCheckbox index={0} dagtype="Arbeidsgiverperiode" dato={dayjs()} skjæringstidspunkt="" />;
                <RadmarkeringCheckbox index={0} dagtype="Foreldet" dato={dayjs()} skjæringstidspunkt="" />;
                <RadmarkeringCheckbox index={0} dagtype="Annullert" dato={dayjs()} skjæringstidspunkt="" />;
            </>
        );

        expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    });

    it('kan ikke sjekkes om dato er lik skjæringstidspunkt', () => {
        render(
            <RadmarkeringCheckbox index={0} dagtype="Syk" dato={dayjs('2021-01-01')} skjæringstidspunkt="2021-01-01" />
        );
        userEvent.click(screen.getByRole('checkbox'));
        expect(screen.getAllByText('Kan foreløpig ikke endres. Mangler støtte for skjæringstidspunkt')).toHaveLength(2);
    });
});
