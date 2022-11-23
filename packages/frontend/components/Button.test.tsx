import { axe } from 'jest-axe';
import React from 'react';

import { Button } from '@components/Button';
import { render } from '@testing-library/react';

describe('Button', () => {
    it('rendrer uten violations', async () => {
        const { container } = render(<Button>Klikk meg!</Button>);

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });

    it('får a11y-violation når det mangler name/children', async () => {
        const { container } = render(<Button />);

        const result = await axe(container);

        expect(result).not.toHaveNoViolations();
    });
});
