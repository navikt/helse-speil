import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { Dagtype } from 'internal-types';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { OverstyrbarGradCell } from './OverstyrbarGradCell';

const Wrapper: React.FC = ({ children }) => {
    const form = useForm();
    return <FormProvider {...form}>{children}</FormProvider>;
};

describe('OverstyrbarGradCelle', () => {
    test('Kan revurdere grad', () => {
        const dag = {
            type: Dagtype.Syk,
            dato: dayjs(),
            gradering: 100,
        };
        render(
            <OverstyrbarGradCell erRevurdering={true} onOverstyr={() => null} sykdomsdag={dag} utbetalingsdag={dag} />,
            { wrapper: Wrapper }
        );
        expect(screen.getByTestId('overstyrbar-grad')).toBeVisible();
    });

    test('Kan overstyre grad', () => {
        const dag = {
            type: Dagtype.Syk,
            dato: dayjs(),
            gradering: 100,
        };
        render(
            <OverstyrbarGradCell erRevurdering={false} onOverstyr={() => null} sykdomsdag={dag} utbetalingsdag={dag} />,
            { wrapper: Wrapper }
        );
        expect(screen.getByTestId('overstyrbar-grad')).toBeVisible();
    });
});
