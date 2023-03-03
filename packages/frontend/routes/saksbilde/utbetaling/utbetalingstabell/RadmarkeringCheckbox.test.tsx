import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RadmarkeringCheckbox } from './RadmarkeringCheckbox';

let erUtvikling: boolean = false;

jest.mock('@utils/featureToggles', () => ({
    overstyrPermisjonsdagerEnabled: true,
    erUtvikling: () => erUtvikling,
    erCoachEllerSuper: () => false, // Spiller ingen rolle hva denne er, den over som er avgjørende
}));

describe('RadmarkeringCheckbox', () => {
    it('rendrer checkbox for overstyrbare dager', () => {
        erUtvikling = false;
        render(
            <>
                <RadmarkeringCheckbox index={0} dagtype="Syk" dato="2021-01-01" skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} dagtype="Ferie" dato="2021-01-01" skjæringstidspunkt="" />
                <RadmarkeringCheckbox
                    index={0}
                    dagtype="Egenmelding"
                    dato="2021-01-01"
                    skjæringstidspunkt=""
                    erAGP={false}
                />
                <RadmarkeringCheckbox
                    index={0}
                    dagtype="Permisjon"
                    dato="2021-01-01"
                    skjæringstidspunkt=""
                    erAGP={false}
                />
                ;
            </>
        );

        expect(screen.getAllByRole('checkbox')).toHaveLength(4);
    });

    it('rendrer ikke checkbox for ikke-overstyrbare dager', () => {
        erUtvikling = false;
        render(
            <>
                <RadmarkeringCheckbox index={0} dagtype="Helg" dato="2021-01-01" skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} dagtype="Ukjent" dato="2021-01-01" skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} dagtype="Syk" dato="2021-01-01" skjæringstidspunkt="" erAGP />
                <RadmarkeringCheckbox index={0} dagtype="Syk" dato="2021-01-01" skjæringstidspunkt="" erForeldet />
                <RadmarkeringCheckbox index={0} dagtype="Syk" dato="2021-01-01" skjæringstidspunkt="" erAvvist />
            </>
        );

        expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    });

    it('rendrer checkbox for alle dager i dev', () => {
        erUtvikling = true;
        render(
            <>
                <RadmarkeringCheckbox index={0} dagtype="Helg" dato="2021-01-01" skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} dagtype="Ukjent" dato="2021-01-01" skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} dagtype="Syk" dato="2021-01-01" skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} dagtype="Arbeid" dato="2021-01-01" skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} dagtype="Permisjon" dato="2021-01-01" skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} dagtype="Ferie" dato="2021-01-01" skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} dagtype="Egenmelding" dato="2021-01-01" skjæringstidspunkt="" />
                <RadmarkeringCheckbox index={0} dagtype="Syk" dato="2021-01-01" skjæringstidspunkt="2021-01-01" />
            </>
        );

        expect(screen.queryAllByRole('checkbox')).toHaveLength(7);
    });

    it('kan avhukes om dato er lik skjæringstidspunkt i dev', () => {
        erUtvikling = true;
        render(<RadmarkeringCheckbox index={0} dagtype="Syk" dato="2021-01-01" skjæringstidspunkt="2021-01-01" />);
        userEvent.click(screen.getByRole('checkbox'));
        expect(screen.queryAllByText('Kan foreløpig ikke endres. Mangler støtte for skjæringstidspunkt')).toHaveLength(
            0
        );
    });

    it('kan ikke sjekkes om dato er lik skjæringstidspunkt', () => {
        erUtvikling = false;
        render(<RadmarkeringCheckbox index={0} dagtype="Syk" dato="2021-01-01" skjæringstidspunkt="2021-01-01" />);
        userEvent.click(screen.getByRole('checkbox'));
        expect(screen.getAllByText('Kan foreløpig ikke endres. Mangler støtte for skjæringstidspunkt')).toHaveLength(2);
    });
});
