import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import { RadmarkeringCheckbox } from './RadmarkeringCheckbox';

describe('RadmarkeringCheckbox', () => {
    it('rendrer ikke checkbox for foreldete dager', () => {
        render(
            <>
                <RadmarkeringCheckbox index={0} />
                <RadmarkeringCheckbox index={0} />
                <RadmarkeringCheckbox index={0} erForeldet />
            </>
        );

        expect(screen.queryAllByRole('checkbox')).toHaveLength(2);
    });
});
