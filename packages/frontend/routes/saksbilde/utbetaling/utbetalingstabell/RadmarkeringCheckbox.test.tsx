import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

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
                <RadmarkeringCheckbox index={0} dagtype="Syk" />
                <RadmarkeringCheckbox index={0} dagtype="Ferie" />
                <RadmarkeringCheckbox index={0} dagtype="Egenmelding" erAGP={false} />
                <RadmarkeringCheckbox index={0} dagtype="Permisjon" erAGP={false} />;
            </>
        );

        expect(screen.getAllByRole('checkbox')).toHaveLength(4);
    });

    it('rendrer ikke checkbox for ikke-overstyrbare dager', () => {
        erUtvikling = false;
        render(
            <>
                <RadmarkeringCheckbox index={0} dagtype="Helg" />
                <RadmarkeringCheckbox index={0} dagtype="Ukjent" />
                <RadmarkeringCheckbox index={0} dagtype="Syk" erAGP />
                <RadmarkeringCheckbox index={0} dagtype="Syk" erForeldet />
            </>
        );

        expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    });

    it('rendrer checkbox for alle dager i dev', () => {
        erUtvikling = true;
        render(
            <>
                <RadmarkeringCheckbox index={0} dagtype="Helg" />
                <RadmarkeringCheckbox index={0} dagtype="Ukjent" />
                <RadmarkeringCheckbox index={0} dagtype="Syk" />
                <RadmarkeringCheckbox index={0} dagtype="Arbeid" />
                <RadmarkeringCheckbox index={0} dagtype="Permisjon" />
                <RadmarkeringCheckbox index={0} dagtype="Ferie" />
                <RadmarkeringCheckbox index={0} dagtype="Egenmelding" />
            </>
        );

        expect(screen.queryAllByRole('checkbox')).toHaveLength(6);
    });
});
