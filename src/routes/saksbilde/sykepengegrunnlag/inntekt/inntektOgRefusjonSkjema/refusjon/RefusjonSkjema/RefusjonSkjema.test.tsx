import { FormProvider, useForm } from 'react-hook-form';

import { RefusjonSkjema } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjonSkjema/refusjon/RefusjonSkjema/RefusjonSkjema';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { Refusjonsopplysning } from '@typer/overstyring';
import { somNorskDato } from '@utils/date';
import { toKronerOgØre } from '@utils/locale';

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
                <form onSubmit={methods.handleSubmit(() => {})}>
                    <RefusjonSkjema
                        fraRefusjonsopplysninger={fraRefusjonsopplysninger ?? []}
                        lokaleRefusjonsopplysninger={lokaleRefusjonsopplysninger ?? []}
                    />
                    <button type="submit">Lagre</button>
                </form>
            </FormProvider>
        );
    };

    it('skal rendre tomt skjema hvis det ikke finnes refusjoner', () => {
        render(<TestRefusjonSkjema />);
        expect(screen.queryByTestId('refusjonsopplysningrad')).toBeNull();
    });

    it('skal rendre skjema hvis det finnes refusjoner', async () => {
        render(<TestRefusjonSkjema fraRefusjonsopplysninger={en_refusjonsopplysning} />);
        expect(await screen.findAllByTestId('refusjonsopplysningrad')).toHaveLength(1);
        expect(screen.queryByLabelText('Fra og med dato')).toHaveValue(somNorskDato(en_refusjonsopplysning[0]?.fom));
        expect(screen.queryByLabelText('Til og med dato')).toHaveValue('');
        expect(screen.queryByLabelText('Månedlig refusjon')).toHaveValue(
            toKronerOgØre(en_refusjonsopplysning[0]?.beløp as number),
        );
        expect(screen.queryByText('IM')).toBeInTheDocument();
    });

    it('skal kunne slette refusjonsopplysninger', async () => {
        render(<TestRefusjonSkjema fraRefusjonsopplysninger={to_refusjonsopplysninger} />);
        expect(screen.queryAllByTestId('refusjonsopplysningrad')).toHaveLength(2);
        const knapper = await screen.findAllByRole('button', { name: 'Slett' });
        await userEvent.click(knapper[0]!);
        expect(screen.queryAllByTestId('refusjonsopplysningrad')).toHaveLength(1);
    });

    it('skal kunne legge til refusjonsopplysninger', async () => {
        render(<TestRefusjonSkjema fraRefusjonsopplysninger={en_refusjonsopplysning} />);
        expect(screen.queryAllByTestId('refusjonsopplysningrad')).toHaveLength(1);
        const knapper = await screen.findAllByRole('button', { name: 'Legg til' });
        await userEvent.click(knapper[0]!);
        expect(screen.queryAllByTestId('refusjonsopplysningrad')).toHaveLength(2);
    });

    it('skal vise feilmelding og beholde verdien når til og med dato har ugyldig format', async () => {
        render(<TestRefusjonSkjema fraRefusjonsopplysninger={to_refusjonsopplysninger} />);
        const tomFelt = (await screen.findAllByLabelText('Til og med dato'))[0]!;
        await userEvent.clear(tomFelt);
        await userEvent.type(tomFelt, '32.13.2020');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Datoen må ha format dd.mm.åååå')).toBeInTheDocument();
        expect(tomFelt).toHaveValue('32.13.2020');
    });
});
