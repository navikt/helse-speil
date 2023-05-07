import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OverstyringForm } from './OverstyringForm';

const FormWrapper: React.FC<ChildrenProps> = ({ children }) => {
    const form = useForm();
    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(() => null)}>{children}</form>
        </FormProvider>
    );
};

describe('OverstyringForm', () => {
    it('disabler submit-knappen om det ikke er noen overstyrte dager', () => {
        render(<OverstyringForm overstyrteDager={new Map()} toggleOverstyring={() => null} onSubmit={() => null} />, {
            wrapper: FormWrapper,
        });

        expect(screen.getAllByRole('button')[0]).toBeDisabled();
    });

    it('viser feilmelding om begrunnelse ikke er fylt ut før innsending', async () => {
        const overstyrteDager = new Map([['2020-01-01', { type: 'Syk' } as UtbetalingstabellDag]]);
        render(
            <OverstyringForm overstyrteDager={overstyrteDager} toggleOverstyring={() => null} onSubmit={() => null} />,
            {
                wrapper: FormWrapper,
            }
        );

        expect(screen.getAllByRole('button')[0]).not.toBeDisabled();
        userEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(screen.getAllByText('Begrunnelse må fylles ut')).toHaveLength(1);
        });
    });
});
