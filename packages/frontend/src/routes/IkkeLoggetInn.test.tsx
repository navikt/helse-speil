import { axe } from 'jest-axe';
import React from 'react';

import { render } from '@testing-library/react';

import { IkkeLoggetInn } from './IkkeLoggetInn';

describe('IkkeLoggetInn', () => {
    it('rendrer uten violations', async () => {
        const { container } = render(<IkkeLoggetInn />);

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });
});
