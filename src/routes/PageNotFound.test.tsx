import { axe } from 'jest-axe';
import React from 'react';

import { render } from '@testing-library/react';

import { PageNotFound } from './PageNotFound';

describe('PageNotFound', () => {
    it('rendrer uten violations', async () => {
        const { container } = render(<PageNotFound />);

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });
});
