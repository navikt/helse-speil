import { FormProvider, useForm } from 'react-hook-form';

import {
    InntektOgRefusjonSchema,
    RefusjonsperiodeSchema,
    lagInntektOgRefusjonSchema,
} from '@/form-schemas/inntektOgRefusjonSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { RefusjonSkjema } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/RefusjonSkjema';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { somNorskDato } from '@utils/date';
import { toKronerOgØre } from '@utils/locale';

describe('Refusjonskjema', () => {
    const inntektFom = '2020-01-01';
    const inntektTom = '2020-02-04';

    const enRefusjonsopplysning = {
        fom: inntektFom,
        beløp: 10_000,
        kilde: 'INNTEKTSMELDING',
        tom: inntektTom,
    };

    const toRefusjonsopplysninger = [
        {
            fom: inntektFom,
            beløp: 10_000,
            kilde: 'INNTEKTSMELDING',
            tom: '2020-01-02',
        },
        {
            fom: '2020-01-03',
            beløp: 10_000,
            kilde: 'SAKSBEHANDLER',
            tom: inntektTom,
        },
    ];

    const TestRefusjonSkjema = ({ refusjonsperioder }: { refusjonsperioder: RefusjonsperiodeSchema[] }) => {
        const form = useForm<InntektOgRefusjonSchema>({
            resolver: zodResolver(lagInntektOgRefusjonSchema({ fom: inntektFom, tom: inntektTom }, ['Begrunnelse'])),
            defaultValues: {
                månedsbeløp: 10_000,
                refusjonsperioder: refusjonsperioder,
                notat: '',
                begrunnelse: '',
            },
        });

        return (
            <FormProvider {...form}>
                <RefusjonSkjema inntektFom={inntektFom} inntektTom={inntektTom} />
            </FormProvider>
        );
    };

    it('skal rendre tomt skjema hvis det ikke finnes refusjoner', () => {
        render(<TestRefusjonSkjema refusjonsperioder={[]} />);
        expect(screen.queryByTestId('refusjonsperiode')).toBeNull();
    });
    it('skal rendre skjema hvis det finnes refusjoner', async () => {
        render(<TestRefusjonSkjema refusjonsperioder={[enRefusjonsopplysning]} />);
        expect(await screen.findAllByTestId('refusjonsperiode')).toHaveLength(1);
        expect(screen.queryByLabelText('Fra og med dato')).toHaveValue(somNorskDato(enRefusjonsopplysning?.fom));
        expect(screen.queryByLabelText('Til og med dato')).toHaveValue(somNorskDato(enRefusjonsopplysning?.tom));
        expect(screen.queryByLabelText('Månedlig refusjon')).toHaveValue(
            toKronerOgØre(enRefusjonsopplysning?.beløp as number),
        );
        expect(screen.queryByText('IM')).toBeInTheDocument();
    });

    it('skal kunne slette refusjonsopplysninger', async () => {
        render(<TestRefusjonSkjema refusjonsperioder={toRefusjonsopplysninger} />);
        expect(screen.queryAllByTestId('refusjonsperiode')).toHaveLength(2);
        const knapper = await screen.findAllByRole('button', { name: 'Slett' });
        await userEvent.click(knapper[0]!);
        expect(screen.queryAllByTestId('refusjonsperiode')).toHaveLength(1);
    });

    it('skal kunne legge til refusjonsopplysninger', async () => {
        render(<TestRefusjonSkjema refusjonsperioder={[enRefusjonsopplysning]} />);
        expect(screen.queryAllByTestId('refusjonsperiode')).toHaveLength(1);
        const knapper = await screen.findAllByRole('button', { name: 'Legg til' });
        await userEvent.click(knapper[0]!);
        expect(screen.queryAllByTestId('refusjonsperiode')).toHaveLength(2);
    });
});
