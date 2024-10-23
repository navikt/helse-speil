import React from 'react';

import { Periodetype } from '@io/graphql';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { getUtbetalingstabellDag } from '@test-data/utbetalingstabell';
import { RecoilWrapper } from '@test-wrappers';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { OverstyrbarUtbetaling } from './OverstyrbarUtbetaling';

let postOverstyringArguments: [Utbetalingstabelldag[], string] | [] = [];

jest.mock('./utbetalingstabell/useOverstyrDager', () => ({
    useOverstyrDager: () => ({
        postOverstyring: (
            dager: Utbetalingstabelldag[],
            overstyrteDager: Utbetalingstabelldag[],
            begrunnelse: string,
        ) => {
            postOverstyringArguments = [overstyrteDager, begrunnelse];
        },
    }),
}));

jest.mock('./utbetalingstabell/useAlderVedSkjæringstidspunkt', () => ({
    useAlderVedSkjæringstidspunkt: () => 30,
}));

//TODO this is bad, need to make it go faster
jest.setTimeout(15000);

const dager = new Map<string, Utbetalingstabelldag>([
    ['2022-01-01', getUtbetalingstabellDag({ dato: '2022-01-01' })],
    ['2022-01-02', getUtbetalingstabellDag({ dato: '2022-01-02' })],
    ['2022-01-03', getUtbetalingstabellDag({ dato: '2022-01-03' })],
    ['2022-01-04', getUtbetalingstabellDag({ dato: '2022-01-04' })],
    ['2022-01-05', getUtbetalingstabellDag({ dato: '2022-01-05' })],
]);

describe('OverstyrbarUtbetaling', () => {
    test('overstyrer utbetalingstabell', async () => {
        const person = enPerson();
        const periode = enBeregnetPeriode({
            fom: '2022-01-01',
            tom: '2022-01-31',
        }).medSkjæringstidspunkt('2022-01-01');
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        render(<OverstyrbarUtbetaling arbeidsgiver={arbeidsgiver} person={person} dager={dager} periode={periode} />, {
            wrapper: RecoilWrapper,
        });

        await userEvent.click(screen.getByText('Overstyr dager'));
        expect(screen.getByText('+ Legg til dager i tabellen')).toBeVisible();

        const checkboxes = screen.getAllByRole('checkbox');
        await userEvent.click(checkboxes[1]);
        await userEvent.click(checkboxes[2]);
        await userEvent.click(checkboxes[3]);

        expect(screen.getAllByRole('option')).toHaveLength(13);
        expect(screen.getByTestId('dagtypevelger')).toBeEnabled();

        await userEvent.selectOptions(screen.getByTestId('dagtypevelger'), screen.getAllByRole('option')[0]);
        expect((screen.getByRole('option', { selected: true }) as HTMLOptionElement).selected).toBe(true);

        expect(screen.getByTestId('gradvelger')).toBeEnabled();
        await userEvent.clear(screen.getByTestId('gradvelger'));
        await userEvent.type(screen.getByTestId('gradvelger'), '80');
        expect(screen.getByTestId('gradvelger')).toHaveValue(80);

        await userEvent.click(screen.getByTestId('endre'));

        await waitFor(() => {
            expect(screen.getByTestId('oppdater')).toBeEnabled();
        });

        await userEvent.type(screen.getByTestId('overstyring-begrunnelse'), 'En begrunnelse');
        await userEvent.click(screen.getByTestId('oppdater'));

        await waitFor(() => {
            expect(postOverstyringArguments).toHaveLength(2);
            postOverstyringArguments[0]?.forEach((overstyrtDag) => {
                expect(overstyrtDag.dag.speilDagtype).toEqual('Syk');
                expect(overstyrtDag.grad).toEqual(80);
            });
        });
    });

    test('Legg til dager vises ikke for forlengelser', async () => {
        const person = enPerson();
        const arbeidsgiver = enArbeidsgiver();
        const periode = enBeregnetPeriode({ periodetype: Periodetype.Forlengelse });
        render(<OverstyrbarUtbetaling arbeidsgiver={arbeidsgiver} person={person} dager={dager} periode={periode} />, {
            wrapper: RecoilWrapper,
        });

        await userEvent.click(screen.getByText('Overstyr dager'));
        expect(screen.queryByText('+ Legg til dager')).not.toBeInTheDocument();
    });
});
