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

const arbeidsdagvalideringstekst =
    'Du kan ikke overstyre Syk eller Ferie til Arbeidsdag. Arbeidsdag kan legges til i forkant av perioden, i slutten av perioden, eller endres i arbeidsgiverperioden';

describe('OverstyringForm', () => {
    it('disabler submit-knappen om det ikke er noen overstyrte dager', () => {
        render(
            <OverstyringForm
                overstyrteDager={new Map()}
                hale=""
                snute=""
                toggleOverstyring={() => null}
                onSubmit={() => null}
            />,
            {
                wrapper: FormWrapper,
            },
        );

        expect(screen.getAllByRole('button')[0]).toBeDisabled();
    });

    it('viser feilmelding om begrunnelse ikke er fylt ut før innsending', async () => {
        const overstyrteDager = new Map([['2020-01-01', { type: 'Syk' } as UtbetalingstabellDag]]);
        render(
            <OverstyringForm
                overstyrteDager={overstyrteDager}
                hale=""
                snute=""
                toggleOverstyring={() => null}
                onSubmit={() => null}
            />,
            {
                wrapper: FormWrapper,
            },
        );

        expect(screen.getAllByRole('button')[0]).toBeEnabled();
        userEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(screen.getAllByText('Begrunnelse må fylles ut')).toHaveLength(2);
        });
    });

    it('viser feilmelding dersom arbeidsdager ikke er ny dag, innenfor agp og overstyrt fraType Syk', async () => {
        const overstyrteDager = new Map([['2020-01-02', { type: 'Arbeid', fraType: 'Syk' } as UtbetalingstabellDag]]);
        render(
            <OverstyringForm
                overstyrteDager={overstyrteDager}
                hale=""
                snute=""
                toggleOverstyring={() => null}
                onSubmit={() => null}
            />,
            {
                wrapper: FormWrapper,
            },
        );

        expect(screen.getAllByRole('button')[0]).toBeEnabled();
        userEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(screen.getByText(arbeidsdagvalideringstekst)).toBeInTheDocument();
        });
    });
    it('viser feilmelding dersom arbeidsdager ikke er ny dag, innenfor agp og overstyrt fraType SykHelg', async () => {
        const overstyrteDager = new Map([
            ['2020-01-02', { type: 'Arbeid', fraType: 'SykHelg' } as UtbetalingstabellDag],
        ]);
        render(
            <OverstyringForm
                overstyrteDager={overstyrteDager}
                hale=""
                snute=""
                toggleOverstyring={() => null}
                onSubmit={() => null}
            />,
            {
                wrapper: FormWrapper,
            },
        );

        expect(screen.getAllByRole('button')[0]).toBeEnabled();
        userEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(screen.getByText(arbeidsdagvalideringstekst)).toBeInTheDocument();
        });
    });

    it('viser feilmelding dersom arbeidsdager ikke er ny dag, innenfor agp og overstyrt fraType Ferie', async () => {
        const overstyrteDager = new Map([['2020-01-02', { type: 'Arbeid', fraType: 'Ferie' } as UtbetalingstabellDag]]);
        render(
            <OverstyringForm
                overstyrteDager={overstyrteDager}
                hale=""
                snute=""
                toggleOverstyring={() => null}
                onSubmit={() => null}
            />,
            {
                wrapper: FormWrapper,
            },
        );

        expect(screen.getAllByRole('button')[0]).toBeEnabled();
        userEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(screen.getByText(arbeidsdagvalideringstekst)).toBeInTheDocument();
        });
    });

    it('viser ikke feilmelding dersom overstyring til arbeidsdag er ny dag, selv om fraType er Syk', async () => {
        const overstyrteDager = new Map([
            ['2020-01-02', { type: 'Arbeid', fraType: 'Syk', erNyDag: true } as UtbetalingstabellDag],
        ]);
        render(
            <OverstyringForm
                overstyrteDager={overstyrteDager}
                hale=""
                snute=""
                toggleOverstyring={() => null}
                onSubmit={() => null}
            />,
            {
                wrapper: FormWrapper,
            },
        );

        expect(screen.getAllByRole('button')[0]).toBeEnabled();
        userEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(screen.queryByText(arbeidsdagvalideringstekst)).not.toBeInTheDocument();
        });
    });

    it('viser ikke feilmelding dersom overstyring til arbeidsdag er innenfor AGP, selv om fraType er Syk', async () => {
        const overstyrteDager = new Map([
            ['2020-01-02', { type: 'Arbeid', fraType: 'Syk', erAGP: true } as UtbetalingstabellDag],
        ]);
        render(
            <OverstyringForm
                overstyrteDager={overstyrteDager}
                hale=""
                snute=""
                toggleOverstyring={() => null}
                onSubmit={() => null}
            />,
            {
                wrapper: FormWrapper,
            },
        );

        expect(screen.getAllByRole('button')[0]).toBeEnabled();
        userEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(screen.queryByText(arbeidsdagvalideringstekst)).not.toBeInTheDocument();
        });
    });

    it('viser ikke feilmelding dersom overstyring til arbeidsdag er i hale av perioden, selv om fraType er Syk', async () => {
        const overstyrteDager = new Map([
            ['2020-01-02', { type: 'Arbeid', fraType: 'Syk', erAGP: false } as UtbetalingstabellDag],
        ]);
        render(
            <OverstyringForm
                overstyrteDager={overstyrteDager}
                hale="2020-01-02"
                snute=""
                toggleOverstyring={() => null}
                onSubmit={() => null}
            />,
            {
                wrapper: FormWrapper,
            },
        );

        expect(screen.getAllByRole('button')[0]).toBeEnabled();
        userEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(screen.queryByText(arbeidsdagvalideringstekst)).not.toBeInTheDocument();
        });
    });
});
