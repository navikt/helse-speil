import React, { PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { render, screen } from '@test-utils';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { OverstyringForm } from './OverstyringForm';
import { Arbeidsdag, Egenmeldingsdag, Sykedag } from './utbetalingstabelldager';

const FormWrapper = ({ children }: PropsWithChildren) => {
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
    'Egenmelding kan kun overstyres i eller før arbeidsgiverperioden eller legges til som en ny dag.';

describe('OverstyringForm', () => {
    const alleDager = new Map([
        [
            '2020-01-01',
            {
                dag: Sykedag,
                dato: '2020-01-01',
            } as Utbetalingstabelldag,
        ],
        ['2020-01-02', { dag: Sykedag, dato: '2020-01-02' } as Utbetalingstabelldag],
    ]);

    it('disabler submit-knappen om det ikke er noen overstyrte dager', () => {
        render(
            <FormWrapper>
                <OverstyringForm
                    overstyrteDager={new Map()}
                    alleDager={alleDager}
                    toggleOverstyring={() => null}
                    onSubmit={() => null}
                />
            </FormWrapper>,
        );

        expect(screen.getByRole('button', { name: /Ferdig/i })).toBeDisabled();
    });

    it('viser feilmelding om begrunnelse ikke er fylt ut før innsending', async () => {
        const overstyrteDager = new Map([['2020-01-01', { dag: Sykedag, dato: '2020-01-01' } as Utbetalingstabelldag]]);
        render(
            <FormWrapper>
                <OverstyringForm
                    overstyrteDager={overstyrteDager}
                    alleDager={alleDager}
                    toggleOverstyring={() => null}
                    onSubmit={() => null}
                />
            </FormWrapper>,
        );

        expect(screen.getByRole('button', { name: /Ferdig/i })).toBeEnabled();
        await userEvent.click(screen.getByRole('button', { name: /Ferdig/i }));

        expect(await screen.findAllByText('Begrunnelse må fylles ut')).toHaveLength(2);
    });

    it('viser feilmelding dersom arbeidsdager ikke er ny dag, innenfor agp, ikke i hale og overstyrt fraType Syk', async () => {
        const overstyrteDager = new Map([
            ['2020-01-01', { dag: Arbeidsdag, fraType: 'Ferie', dato: '2020-01-01' } as Utbetalingstabelldag],
        ]);
        render(
            <FormWrapper>
                <OverstyringForm
                    overstyrteDager={overstyrteDager}
                    alleDager={alleDager}
                    toggleOverstyring={() => null}
                    onSubmit={() => null}
                />
            </FormWrapper>,
        );

        expect(screen.getByRole('button', { name: /Ferdig/i })).toBeEnabled();
        await userEvent.click(screen.getByRole('button', { name: /Ferdig/i }));

        expect(await screen.findByText(arbeidsdagvalideringstekst)).toBeInTheDocument();
    });

    it('viser feilmelding dersom arbeidsdager ikke er ny dag, innenfor agp, ikke i hale og overstyrt fraType SykHelg', async () => {
        const overstyrteDager = new Map([
            ['2020-01-01', { dag: Arbeidsdag, fraType: 'SykHelg', dato: '2020-01-01' } as Utbetalingstabelldag],
        ]);
        render(
            <FormWrapper>
                <OverstyringForm
                    overstyrteDager={overstyrteDager}
                    alleDager={alleDager}
                    toggleOverstyring={() => null}
                    onSubmit={() => null}
                />
            </FormWrapper>,
        );

        expect(screen.getByRole('button', { name: /Ferdig/i })).toBeEnabled();
        await userEvent.click(screen.getByRole('button', { name: /Ferdig/i }));

        expect(await screen.findByText(arbeidsdagvalideringstekst)).toBeInTheDocument();
    });

    it('viser feilmelding dersom arbeidsdager ikke er ny dag, innenfor agp, ikke i hale og overstyrt fraType Ferie', async () => {
        const overstyrteDager = new Map([
            ['2020-01-01', { dag: Arbeidsdag, fraType: 'Ferie', dato: '2020-01-01' } as Utbetalingstabelldag],
        ]);
        render(
            <FormWrapper>
                <OverstyringForm
                    overstyrteDager={overstyrteDager}
                    alleDager={alleDager}
                    toggleOverstyring={() => null}
                    onSubmit={() => null}
                />
            </FormWrapper>,
        );

        expect(screen.getByRole('button', { name: /Ferdig/i })).toBeEnabled();
        await userEvent.click(screen.getByRole('button', { name: /Ferdig/i }));

        expect(await screen.findByText(arbeidsdagvalideringstekst)).toBeInTheDocument();
    });

    it('viser ikke feilmelding dersom overstyring til arbeidsdag er ny dag, selv om fraType er Syk', async () => {
        const overstyrteDager = new Map([
            [
                '2020-01-02',
                { dag: Arbeidsdag, fraType: 'Syk', erNyDag: true, dato: '2020-01-02' } as Utbetalingstabelldag,
            ],
        ]);
        render(
            <FormWrapper>
                <OverstyringForm
                    overstyrteDager={overstyrteDager}
                    alleDager={alleDager}
                    toggleOverstyring={() => null}
                    onSubmit={() => null}
                />
            </FormWrapper>,
        );

        expect(screen.getByRole('button', { name: /Ferdig/i })).toBeEnabled();
        await userEvent.click(screen.getByRole('button', { name: /Ferdig/i }));

        expect(screen.queryByText(arbeidsdagvalideringstekst)).not.toBeInTheDocument();
    });

    it('viser ikke feilmelding dersom overstyring til arbeidsdag er innenfor AGP, selv om fraType er Syk', async () => {
        const overstyrteDager = new Map([
            [
                '2020-01-02',
                { dag: Arbeidsdag, fraType: 'Syk', erAGP: true, dato: '2020-01-02' } as Utbetalingstabelldag,
            ],
        ]);
        render(
            <FormWrapper>
                <OverstyringForm
                    overstyrteDager={overstyrteDager}
                    alleDager={alleDager}
                    toggleOverstyring={() => null}
                    onSubmit={() => null}
                />
            </FormWrapper>,
        );

        expect(screen.getByRole('button', { name: /Ferdig/i })).toBeEnabled();
        await userEvent.click(screen.getByRole('button', { name: /Ferdig/i }));

        expect(screen.queryByText(arbeidsdagvalideringstekst)).not.toBeInTheDocument();
    });

    it('viser ikke feilmelding dersom overstyring til arbeidsdag er i hale av perioden, selv om fraType er Syk', async () => {
        const overstyrteDager = new Map([
            [
                '2020-01-02',
                { dag: Arbeidsdag, fraType: 'Syk', erAGP: false, dato: '2020-01-02' } as Utbetalingstabelldag,
            ],
        ]);
        render(
            <FormWrapper>
                <OverstyringForm
                    overstyrteDager={overstyrteDager}
                    alleDager={alleDager}
                    toggleOverstyring={() => null}
                    onSubmit={() => null}
                />
            </FormWrapper>,
        );

        expect(screen.getByRole('button', { name: /Ferdig/i })).toBeEnabled();
        await userEvent.click(screen.getByRole('button', { name: /Ferdig/i }));

        expect(screen.queryByText(arbeidsdagvalideringstekst)).not.toBeInTheDocument();
    });

    it('viser feilmelding dersom egenmelding ikke er ny dag, innenfor eller før agp ', async () => {
        const overstyrteDager = new Map([
            ['2020-01-02', { dag: Egenmeldingsdag, fraType: 'Syk', dato: '2020-01-02' } as Utbetalingstabelldag],
        ]);
        render(
            <FormWrapper>
                <OverstyringForm
                    overstyrteDager={overstyrteDager}
                    alleDager={alleDager}
                    toggleOverstyring={() => null}
                    onSubmit={() => null}
                />
            </FormWrapper>,
        );

        expect(screen.getByRole('button', { name: /Ferdig/i })).toBeEnabled();
        await userEvent.click(screen.getByRole('button', { name: /Ferdig/i }));

        expect(await screen.findByText(egenmeldingvalideringstekst)).toBeInTheDocument();
    });
});
