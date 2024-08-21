import dayjs from 'dayjs';
import { FormProvider, useForm } from 'react-hook-form';

import { Refusjon } from '@saksbilde/sykepengegrunnlag/inntekt/Refusjon';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Refusjonsopplysning } from '@typer/overstyring';
import { NORSK_DATOFORMAT } from '@utils/date';

describe('Refusjonskjema', () => {
    const refusjonsopplysninger: Refusjonsopplysning[] = [
        {
            fom: '2020-01-01',
            beløp: 10000,
            kilde: 'IM',
        },
    ];

    const TestRefusjon = ({
        fraRefusjonsopplysninger,
        lokaleRefusjonsopplysninger,
    }: {
        fraRefusjonsopplysninger?: Refusjonsopplysning[];
        lokaleRefusjonsopplysninger?: Refusjonsopplysning[];
    }) => {
        const methods = useForm();
        return (
            <FormProvider {...methods}>
                <Refusjon
                    fraRefusjonsopplysninger={fraRefusjonsopplysninger ?? []}
                    lokaleRefusjonsopplysninger={lokaleRefusjonsopplysninger ?? []}
                />
            </FormProvider>
        );
    };

    it('skal rendre tomt skjema hvis det ikke finnes refusjoner', () => {
        render(<TestRefusjon />);
        expect(screen.queryByTestId('refusjonsopplysningrad')).toBeNull();
    });

    it('skal rendre skjema hvis det finnes refusjoner', () => {
        render(<TestRefusjon fraRefusjonsopplysninger={refusjonsopplysninger} />);
        expect(screen.queryAllByTestId('refusjonsopplysningrad')).toHaveLength(1);
        expect(screen.queryByLabelText('fom')).toHaveValue(
            dayjs(refusjonsopplysninger[0].fom).format(NORSK_DATOFORMAT),
        );
        expect(screen.queryByLabelText('tom')).toHaveValue('');
        expect(screen.queryByLabelText('Månedlig refusjon')).toHaveValue(refusjonsopplysninger[0].beløp);
    });
});
