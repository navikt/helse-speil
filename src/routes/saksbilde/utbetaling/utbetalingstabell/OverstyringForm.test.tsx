import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OverstyringForm } from './OverstyringForm';
import { Arbeidsdag, Egenmeldingsdag, Sykedag } from './utbetalingstabelldager';

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

const egenmeldingvalideringstekst =
    'Egenmelding kan kun overstyres i arbeidsgiverperioden eller legges til som en ny dag.';

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
        const overstyrteDager = new Map([['2020-01-01', { dag: Sykedag, dato: '2020-01-01' } as Utbetalingstabelldag]]);
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
        await userEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(screen.getAllByText('Begrunnelse må fylles ut')).toHaveLength(2);
        });
    });

    it('viser feilmelding dersom arbeidsdager ikke er ny dag, innenfor agp og overstyrt fraType Syk', async () => {
        const overstyrteDager = new Map([
            ['2020-01-02', { dag: Arbeidsdag, fraType: 'Syk', dato: '2020-01-02' } as Utbetalingstabelldag],
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
        await userEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(screen.getByText(arbeidsdagvalideringstekst)).toBeInTheDocument();
        });
    });

    it('viser feilmelding dersom arbeidsdager ikke er ny dag, innenfor agp og overstyrt fraType SykHelg', async () => {
        const overstyrteDager = new Map([
            ['2020-01-02', { dag: Arbeidsdag, fraType: 'SykHelg', dato: '2020-01-02' } as Utbetalingstabelldag],
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
        await userEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(screen.getByText(arbeidsdagvalideringstekst)).toBeInTheDocument();
        });
    });

    it('viser feilmelding dersom arbeidsdager ikke er ny dag, innenfor agp og overstyrt fraType Ferie', async () => {
        const overstyrteDager = new Map([
            ['2020-01-02', { dag: Arbeidsdag, fraType: 'Ferie', dato: '2020-01-02' } as Utbetalingstabelldag],
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
        await userEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(screen.getByText(arbeidsdagvalideringstekst)).toBeInTheDocument();
        });
    });

    it('viser ikke feilmelding dersom overstyring til arbeidsdag er ny dag, selv om fraType er Syk', async () => {
        const overstyrteDager = new Map([
            [
                '2020-01-02',
                { dag: Arbeidsdag, fraType: 'Syk', erNyDag: true, dato: '2020-01-02' } as Utbetalingstabelldag,
            ],
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
        await userEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(screen.queryByText(arbeidsdagvalideringstekst)).not.toBeInTheDocument();
        });
    });

    it('viser ikke feilmelding dersom overstyring til arbeidsdag er innenfor AGP, selv om fraType er Syk', async () => {
        const overstyrteDager = new Map([
            [
                '2020-01-02',
                { dag: Arbeidsdag, fraType: 'Syk', erAGP: true, dato: '2020-01-02' } as Utbetalingstabelldag,
            ],
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
        await userEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(screen.queryByText(arbeidsdagvalideringstekst)).not.toBeInTheDocument();
        });
    });

    it('viser ikke feilmelding dersom overstyring til arbeidsdag er i hale av perioden, selv om fraType er Syk', async () => {
        const overstyrteDager = new Map([
            [
                '2020-02-02',
                { dag: Arbeidsdag, fraType: 'Syk', erAGP: false, dato: '2020-02-02' } as Utbetalingstabelldag,
            ],
        ]);
        render(
            <OverstyringForm
                overstyrteDager={overstyrteDager}
                hale="2020-02-02"
                snute="2020-01-01"
                toggleOverstyring={() => null}
                onSubmit={() => null}
            />,
            {
                wrapper: FormWrapper,
            },
        );

        expect(screen.getAllByRole('button')[0]).toBeEnabled();
        await userEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(screen.queryByText(arbeidsdagvalideringstekst)).not.toBeInTheDocument();
        });
    });

    it('viser feilmelding dersom egenmelding ikke er ny dag eller innenfor agp', async () => {
        const overstyrteDager = new Map([
            ['2020-01-02', { dag: Egenmeldingsdag, fraType: 'Syk', dato: '2020-01-02' } as Utbetalingstabelldag],
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
        await userEvent.click(screen.getAllByRole('button')[0]);

        await waitFor(() => {
            expect(screen.getByText(egenmeldingvalideringstekst)).toBeInTheDocument();
        });
    });
});
