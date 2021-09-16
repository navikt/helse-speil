import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
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
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Syk} dato={dayjs()} />
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Ferie} dato={dayjs()} />
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Egenmelding} dato={dayjs()} />
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Permisjon} dato={dayjs()} />;
            </>
        );

        expect(screen.getAllByRole('checkbox')).toHaveLength(4);
    });

    it('rendrer ikke checkbox for ikke-overstyrbare dager', () => {
        render(
            <>
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Helg} dato={dayjs()} />
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Avvist} dato={dayjs()} />
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Ubestemt} dato={dayjs()} />
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Arbeidsdag} dato={dayjs()} />;
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Arbeidsgiverperiode} dato={dayjs()} />;
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Foreldet} dato={dayjs()} />;
                <RadmarkeringCheckbox index={0} dagtype={Dagtype.Annullert} dato={dayjs()} />;
            </>
        );

        expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    });
});
