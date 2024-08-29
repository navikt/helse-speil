import dayjs from 'dayjs';
import { FormProvider, useForm } from 'react-hook-form';

import { RefusjonSkjema } from '@saksbilde/sykepengegrunnlag/inntekt/editableInntekt/refusjon/RefusjonSkjema';
import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Refusjonsopplysning } from '@typer/overstyring';
import { NORSK_DATOFORMAT } from '@utils/date';

describe('Refusjonskjema', () => {
    const en_refusjonsopplysning: Refusjonsopplysning[] = [
        {
            fom: '2020-01-01',
            beløp: 10000,
            kilde: 'INNTEKTSMELDING',
        },
    ];

    const to_refusjonsopplysninger: Refusjonsopplysning[] = [
        {
            fom: '2020-01-01',
            beløp: 10000,
            kilde: 'INNTEKTSMELDING',
        },
        {
            fom: '2020-01-01',
            tom: '2020-02-01',
            beløp: 30000,
            kilde: 'SAKSBEHANDLER',
        },
    ];

    const TestRefusjonSkjema = ({
        fraRefusjonsopplysninger,
        lokaleRefusjonsopplysninger,
    }: {
        fraRefusjonsopplysninger?: Refusjonsopplysning[];
        lokaleRefusjonsopplysninger?: Refusjonsopplysning[];
    }) => {
        const methods = useForm();
        return (
            <FormProvider {...methods}>
                <RefusjonSkjema
                    fraRefusjonsopplysninger={fraRefusjonsopplysninger ?? []}
                    lokaleRefusjonsopplysninger={lokaleRefusjonsopplysninger ?? []}
                />
            </FormProvider>
        );
    };

    it('skal rendre tomt skjema hvis det ikke finnes refusjoner', () => {
        render(<TestRefusjonSkjema />);
        expect(screen.queryByTestId('refusjonsopplysningrad')).toBeNull();
    });

    it('skal rendre skjema hvis det finnes refusjoner', () => {
        render(<TestRefusjonSkjema fraRefusjonsopplysninger={en_refusjonsopplysning} />);
        screen.debug();
        expect(screen.queryAllByTestId('refusjonsopplysningrad')).toHaveLength(1);
        expect(screen.queryByLabelText('Fra og med dato')).toHaveValue(
            dayjs(en_refusjonsopplysning[0].fom).format(NORSK_DATOFORMAT),
        );
        expect(screen.queryByLabelText('Til og med dato')).toHaveValue('');
        expect(screen.queryByLabelText('Månedlig refusjon')).toHaveValue(en_refusjonsopplysning[0].beløp.toString());
        expect(screen.queryByText('IM')).toBeInTheDocument();
    });

    it('skal kunne slette refusjonsopplysninger', async () => {
        render(<TestRefusjonSkjema fraRefusjonsopplysninger={to_refusjonsopplysninger} />);
        expect(screen.queryAllByTestId('refusjonsopplysningrad')).toHaveLength(2);
        const knapper = await waitFor(() => screen.findAllByRole('button', { name: 'Slett' }));
        await act(() => fireEvent.click(knapper[0]));
        expect(screen.queryAllByTestId('refusjonsopplysningrad')).toHaveLength(1);
    });

    it('skal kunne legge til refusjonsopplysninger', async () => {
        render(<TestRefusjonSkjema fraRefusjonsopplysninger={en_refusjonsopplysning} />);
        expect(screen.queryAllByTestId('refusjonsopplysningrad')).toHaveLength(1);
        const knapper = await waitFor(() => screen.findAllByRole('button', { name: '+ Legg til' }));
        await act(() => fireEvent.click(knapper[0]));
        expect(screen.queryAllByTestId('refusjonsopplysningrad')).toHaveLength(2);
    });
});
