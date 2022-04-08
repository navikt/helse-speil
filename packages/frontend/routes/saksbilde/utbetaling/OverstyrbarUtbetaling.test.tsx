import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Kildetype, Utbetaling, Utbetalingstatus, Utbetalingtype } from '@io/graphql';
import { RecoilWrapper } from '@test-wrappers';

import { OverstyrbarUtbetaling } from './OverstyrbarUtbetaling';

let postOverstyringArguments: [UtbetalingstabellDag[], string] | [] = [];

jest.mock('./utbetalingstabell/usePostOverstyring', () => ({
    usePostOverstyring: () => ({
        postOverstyring: (dager: UtbetalingstabellDag[], begrunnelse: string) => {
            postOverstyringArguments = [dager, begrunnelse];
        },
    }),
}));

jest.mock('@hooks/useAlderVedSkjæringstidspunkt', () => ({
    useAlderVedSkjæringstidspunkt: () => 30,
}));

//TODO this is bad, need to make it go faster
jest.setTimeout(7000);

const getUtbetaling = (overrides?: Partial<Utbetaling>): Utbetaling => ({
    arbeidsgiverFagsystemId: '123',
    arbeidsgiverNettoBelop: 30000,
    personFagsystemId: '234',
    personNettoBelop: 0,
    status: Utbetalingstatus.Ubetalt,
    type: Utbetalingtype.Utbetaling,
    ...overrides,
});

const getDag = (dato: DateString, overrides?: Partial<UtbetalingstabellDag>): UtbetalingstabellDag => ({
    dato: dato,
    kilde: { id: '123', type: Kildetype.Inntektsmelding },
    type: 'Syk',
    erAGP: false,
    erAvvist: false,
    erForeldet: false,
    erMaksdato: false,
    ...overrides,
});

const dager = new Map<string, UtbetalingstabellDag>([
    ['2022-01-01', getDag('2022-01-01')],
    ['2022-01-02', getDag('2022-01-02')],
    ['2022-01-03', getDag('2022-01-03')],
    ['2022-01-04', getDag('2022-01-04')],
    ['2022-01-05', getDag('2022-01-05')],
]);

describe('Utbetaling', () => {
    test('overstyrer utbetalingstabell', async () => {
        render(
            <OverstyrbarUtbetaling
                fom="2022-01-01"
                tom="2022-01-31"
                dager={dager}
                skjæringstidspunkt="2022-01-01"
                utbetaling={getUtbetaling()}
                revurderingIsEnabled={false}
                overstyrRevurderingIsEnabled={false}
            />,
            { wrapper: RecoilWrapper },
        );

        userEvent.click(screen.getByText('Endre'));

        const checkboxes = screen.getAllByRole('checkbox');
        userEvent.click(checkboxes[1]);
        userEvent.click(checkboxes[2]);
        userEvent.click(checkboxes[3]);

        expect(screen.getAllByRole('option')).toHaveLength(4);
        expect(screen.getByTestId('dagtypevelger')).not.toBeDisabled();

        userEvent.selectOptions(screen.getByTestId('dagtypevelger'), screen.getAllByRole('option')[0]);
        expect((screen.getByRole('option', { selected: true }) as HTMLOptionElement).selected).toBe(true);

        expect(screen.getByTestId('gradvelger')).not.toBeDisabled();
        userEvent.clear(screen.getByTestId('gradvelger'));
        userEvent.type(screen.getByTestId('gradvelger'), '80');
        expect(screen.getByTestId('gradvelger')).toHaveValue(80);

        userEvent.click(screen.getByTestId('endre'));

        const ferdigButton = screen.getByTestId('oppdater');
        await waitFor(() => {
            expect(ferdigButton).not.toBeDisabled();
        });

        userEvent.type(screen.getByTestId('overstyring-begrunnelse'), 'En begrunnelse');
        userEvent.click(screen.getByTestId('oppdater'));

        await waitFor(() => {
            expect(postOverstyringArguments).toHaveLength(2);
            postOverstyringArguments[0]?.forEach((it) => {
                expect(it.type).toEqual('Syk');
                expect(it.grad).toEqual(80);
            });
        });
    });
});
