import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { Dagtype } from 'internal-types';
import React from 'react';

import { RadmarkeringCheckbox } from './RadmarkeringCheckbox';

jest.mock('../../../../featureToggles', () => ({
    overstyrPermisjonsdagerEnabled: true,
}));

describe('RadmarkeringCheckbox', () => {
    it('rendrer checkbox for overstyrbare dager', () => {
        render(
            <>
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Syk} />
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Ferie} />
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Egenmelding} />
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Permisjon} />;
            </>
        );

        expect(screen.getAllByRole('checkbox')).toHaveLength(4);
    });

    it('rendrer ikke checkbox for ikke-overstyrbare dager', () => {
        render(
            <>
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Helg} />
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Avvist} />
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Ubestemt} />
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Arbeidsdag} />;
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Arbeidsgiverperiode} />;
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Foreldet} />;
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Annullert} />;
            </>
        );

        expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    });
});
