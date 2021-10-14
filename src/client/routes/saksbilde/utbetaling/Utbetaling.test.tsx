import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import React from 'react';
import { RecoilRoot } from 'recoil';

import { Utbetaling } from './Utbetaling';
import { UtbetalingstabellDag } from './utbetalingstabell/Utbetalingstabell.types';

let postOverstyringArguments: [UtbetalingstabellDag[], string] | [] = [];

jest.mock('./utbetalingstabell/usePostOverstyring', () => ({
    usePostOverstyring: () => ({
        postOverstyring: (dager: UtbetalingstabellDag[], begrunnelse: string) => {
            postOverstyringArguments = [dager, begrunnelse];
        },
    }),
}));

jest.mock('../../../hooks/useOverstyringIsEnabled', () => ({
    useOverstyringIsEnabled: () => true,
}));

jest.mock('../../../hooks/revurdering', () => ({
    useRevurderingIsEnabled: () => false,
    useOverstyrRevurderingIsEnabled: () => false,
}));

jest.mock('../../../modell/utbetalingshistorikkelement', () => ({
    useMaksdato: () => dayjs(),
    useGjenståendeDager: () => 100,
}));

jest.mock('../../../state/tidslinje', () => ({
    useMaybeAktivPeriode: () => {},
    useVedtaksperiode: () => ({ erForkastet: false }),
}));

const wrapper: React.FC = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;

const enDag = (overrides?: Partial<Dag>): Dag => ({
    type: overrides?.type ?? 'Syk',
    dato: overrides?.dato ?? dayjs(),
    gradering: overrides?.gradering ?? 100,
});

const enPeriode = (): Tidslinjeperiode =>
    ({
        fom: dayjs(),
        tom: dayjs(),
        utbetalingstidslinje: [
            enDag({ dato: dayjs('2021-01-01') }),
            enDag({ dato: dayjs('2021-01-02'), type: 'Egenmelding' }),
            enDag({ dato: dayjs('2021-01-03'), type: 'Ferie' }),
        ] as Utbetalingsdag[],
        sykdomstidslinje: [
            enDag({ dato: dayjs('2021-01-01') }),
            enDag({ dato: dayjs('2021-01-02') }),
            enDag({ dato: dayjs('2021-01-03') }),
        ] as Sykdomsdag[],
    } as Tidslinjeperiode);

describe('Utbetaling', () => {
    beforeEach(() => {
        postOverstyringArguments = [];
    });
    test('overstyrer utbetalingstabell', async () => {
        render(<Utbetaling periode={enPeriode()} overstyringer={[]} />, { wrapper });

        userEvent.click(screen.getByText('Endre'));
        userEvent.click(screen.getAllByRole('checkbox')[0]);
        userEvent.click(screen.getAllByRole('checkbox')[1]);
        userEvent.click(screen.getAllByRole('checkbox')[2]);

        expect(screen.getAllByRole('option')).toHaveLength(4);
        expect(screen.getByTestId('dagtypevelger')).not.toBeDisabled();

        userEvent.selectOptions(screen.getByTestId('dagtypevelger'), screen.getAllByRole('option')[0]);
        expect((screen.getByRole('option', { selected: true }) as HTMLOptionElement).selected).toBe(true);

        expect(screen.getByTestId('gradvelger')).not.toBeDisabled();
        userEvent.clear(screen.getByTestId('gradvelger'));
        userEvent.type(screen.getByTestId('gradvelger'), '80');
        expect(screen.getByTestId('gradvelger')).toHaveValue('80');

        userEvent.click(screen.getByTestId('endre'));

        await waitFor(() => {
            expect(screen.getByTestId('oppdater')).not.toBeDisabled();
        });

        userEvent.type(screen.getAllByRole('textbox')[1], 'En begrunnelse');
        userEvent.click(screen.getByTestId('oppdater'));

        await waitFor(() => {
            expect(postOverstyringArguments).toHaveLength(2);
            postOverstyringArguments[0]?.forEach((it) => {
                expect(it.type).toEqual('Syk');
                expect(it.gradering).toEqual(80);
            });
        });
    });
});
