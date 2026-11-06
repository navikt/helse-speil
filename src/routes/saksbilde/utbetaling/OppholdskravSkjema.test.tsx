import { Mock } from 'vitest';

import { axe } from '@/test/axe';
import { usePostOppholdskravvurderingBehandler } from '@io/rest/generated/avslagsdager/vurderinger/vurderinger';
import { ApiBegrunnelse } from '@io/rest/generated/spesialist.schemas';
import { visningenOppdateresToastKey } from '@state/oppdateringToasts';
import { getUtbetalingstabellDag } from '@test-data/utbetalingstabell';
import { render, screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { OppholdskravSkjema } from './OppholdskravSkjema';

vi.mock('@io/rest/generated/avslagsdager/vurderinger/vurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/avslagsdager/vurderinger/vurderinger')>()),
    usePostOppholdskravvurderingBehandler: vi.fn(),
}));

vi.mock('next/navigation', async (importOriginal) => ({
    ...(await importOriginal<typeof import('next/navigation')>()),
    useParams: () => ({ personPseudoId: 'en-person' }),
}));

vi.mock('@hooks/brukerrolleHooks', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hooks/brukerrolleHooks')>()),
    useHarSkrivetilgang: () => true,
}));

const addToast = vi.hoisted(() => vi.fn());

vi.mock('@state/toasts', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/toasts')>()),
    useAddToast: () => addToast,
}));

const mutate = vi.fn();
const onLukk = vi.fn();
const onLagret = vi.fn();

const eøsBorger = 'Er personen EØS-borger?';
const oppholdIGodkjentOmråde = 'Oppholdt personen seg i Norge, et annet EØS-land eller et avtaleland?';
const oppholdINorge = 'Oppholdt personen seg i Norge?';
const unntak = 'Gjelder et av unntakene i andre ledd?';
const godkjentOpphold = 'Har Nav godkjent oppholdet utenfor Norge i inntil fire uker?';

beforeEach(() => {
    mutate.mockClear();
    onLukk.mockClear();
    onLagret.mockClear();
    addToast.mockClear();
    mockMutation({});
});

describe('OppholdskravSkjema', () => {
    it('viser de valgte dagene', () => {
        renderSkjema();

        expect(screen.getByText('15.07.2024, 16.07.2024')).toBeVisible();
    });

    it('følger dagene som markeres', async () => {
        const { rerender } = renderSkjema([dag('2024-07-15')]);
        await fyllUtOppfyltVurdering();

        rerender(
            <OppholdskravSkjema
                behandlingId="en-behandling"
                markerteDager={
                    new Map([
                        ['2024-07-15', dag('2024-07-15')],
                        ['2024-07-17', dag('2024-07-17')],
                    ])
                }
                onLukk={onLukk}
                onLagret={onLagret}
            />,
        );
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(screen.getByText('15.07.2024, 17.07.2024')).toBeVisible();
        expect(mutate).toHaveBeenCalledWith(
            expect.objectContaining({ data: expect.objectContaining({ dager: ['2024-07-15', '2024-07-17'] }) }),
        );
    });

    it('ber om å markere dager når ingen er markert', async () => {
        renderSkjema([]);
        await fyllUtOppfyltVurdering();

        expect(screen.getByText('Marker dagene som skal vurderes.')).toBeVisible();
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Velg minst én dag')).toBeVisible();
        expect(mutate).not.toHaveBeenCalled();
    });

    it('lagrer ikke når en markert dag er avslått fordi melding til Nav kom for sent', async () => {
        renderSkjema([dag('2024-07-15'), dag('2024-07-16', [ApiBegrunnelse.AVSLATT_MELDING_TIL_NAV_DAG])]);
        await fyllUtOppfyltVurdering();

        expect(
            screen.getByText(
                'En dag kan bare ha én avslagsårsak. 16.07.2024 er avslått fordi melding til Nav kom for sent. Endre dagen før du vurderer oppholdskravet.',
            ),
        ).toBeVisible();
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).not.toHaveBeenCalled();
    });

    it('viser andre ledd bare når første ledd ikke er oppfylt', async () => {
        renderSkjema();

        expect(screen.queryByRole('radiogroup', { name: unntak })).not.toBeInTheDocument();
        await svar(oppholdIGodkjentOmråde, 'Nei');
        expect(screen.getByRole('radiogroup', { name: unntak })).toBeVisible();
        expect(screen.queryByRole('radiogroup', { name: godkjentOpphold })).not.toBeInTheDocument();

        await svar(unntak, 'Nei');
        expect(screen.getByRole('radiogroup', { name: godkjentOpphold })).toBeVisible();

        await svar(oppholdIGodkjentOmråde, 'Ja');
        expect(screen.queryByRole('radiogroup', { name: unntak })).not.toBeInTheDocument();
        expect(screen.queryByRole('radiogroup', { name: godkjentOpphold })).not.toBeInTheDocument();
    });

    it('spør bare om opphold i Norge når personen ikke er EØS-borger', async () => {
        renderSkjema();

        await svar(eøsBorger, 'Nei');

        expect(screen.getByRole('radiogroup', { name: oppholdINorge })).toBeVisible();
        expect(screen.queryByRole('radiogroup', { name: oppholdIGodkjentOmråde })).not.toBeInTheDocument();
    });

    it('viser utfallet når alle aktuelle spørsmål er besvart', async () => {
        renderSkjema();

        await svar(eøsBorger, 'Ja');
        await svar(oppholdIGodkjentOmråde, 'Nei');
        await svar(unntak, 'Nei');
        expect(screen.queryByText(/Vilkåret er/)).not.toBeInTheDocument();

        await svar(godkjentOpphold, 'Nei');
        expect(screen.getByText('Vilkåret er ikke oppfylt')).toBeVisible();

        await svar(godkjentOpphold, 'Ja');
        expect(screen.getByText('Vilkåret er oppfylt')).toBeVisible();
        expect(screen.queryByText('Vilkåret er ikke oppfylt')).not.toBeInTheDocument();
    });

    it('viser feil og sender ingenting når svar mangler', async () => {
        renderSkjema();

        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findAllByText('Svar ja eller nei')).toHaveLength(2);
        expect(screen.getByText('Fyll inn begrunnelse')).toBeVisible();
        expect(mutate).not.toHaveBeenCalled();
    });

    it('sender vurderingen med skjulte svar som null', async () => {
        renderSkjema();

        await svar(eøsBorger, 'Ja');
        await svar(oppholdIGodkjentOmråde, 'Nei');
        await svar(unntak, 'Nei');
        await svar(godkjentOpphold, 'Ja');
        await svar(unntak, 'Innlagt i helseinstitusjon');
        await fyllUtBegrunnelse();
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).toHaveBeenCalledWith({
            personId: 'en-person',
            data: {
                behandlingId: 'en-behandling',
                dager: ['2024-07-15', '2024-07-16'],
                eøsBorger: true,
                oppholdIGodkjentOmråde: false,
                unntakAndreLedd: 'INNLAGT_I_HELSEINSTITUSJON',
                godkjentOppholdInntilFireUker: null,
                fritekstbegrunnelse: 'Opphold utenfor EØS',
                journalpostId: [],
            },
        });
    });

    it('melder fra at visningen oppdateres etter lagring', async () => {
        (usePostOppholdskravvurderingBehandler as Mock).mockImplementation((options) => ({
            mutate: (variables: unknown) => options?.mutation?.onSuccess?.({ vurderingId: 'id' }, variables),
            isPending: false,
            error: null,
        }));
        renderSkjema();

        await fyllUtOppfyltVurdering();
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ key: visningenOppdateresToastKey }));
        expect(onLagret).toHaveBeenCalled();
    });

    it('melder ikke fra om oppdatering når lagringen ikke er ferdig', async () => {
        renderSkjema();

        await fyllUtOppfyltVurdering();
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).toHaveBeenCalled();
        expect(addToast).not.toHaveBeenCalled();
        expect(onLagret).not.toHaveBeenCalled();
    });

    it('lukker uten å lagre ved avbryt', async () => {
        renderSkjema();

        await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }));

        expect(onLukk).toHaveBeenCalled();
        expect(onLagret).not.toHaveBeenCalled();
    });

    it('viser feilmeldingen fra sp-avslagsdager', () => {
        mockMutation({ error: { status: 400, info: { title: 'Dager må oppgis' } } });

        renderSkjema();

        expect(screen.getByText('Dager må oppgis')).toBeVisible();
    });

    it('viser egen feilmelding når saksbehandler mangler tilgang', () => {
        mockMutation({ error: { status: 403, info: { title: 'Mangler tilgang' } } });

        renderSkjema();

        expect(screen.getByText('Du har ikke tilgang til å vurdere oppholdskravet for denne personen.')).toBeVisible();
    });

    it('har ingen tilgjengelighetsfeil', async () => {
        const { container } = renderSkjema();
        await svar(oppholdIGodkjentOmråde, 'Nei');
        await svar(unntak, 'Nei');

        const result = await axe(container);
        expect(result.violations).toEqual([]);
    });
});

function renderSkjema(markerteDager: Utbetalingstabelldag[] = [dag('2024-07-16'), dag('2024-07-15')]) {
    return render(
        <OppholdskravSkjema
            behandlingId="en-behandling"
            markerteDager={new Map(markerteDager.map((dag) => [dag.dato, dag]))}
            onLukk={onLukk}
            onLagret={onLagret}
        />,
    );
}

function dag(dato: string, begrunnelser: ApiBegrunnelse[] = []): Utbetalingstabelldag {
    return getUtbetalingstabellDag({ dato, begrunnelser });
}

function mockMutation({ error = null }: { error?: unknown }) {
    (usePostOppholdskravvurderingBehandler as Mock).mockReturnValue({ mutate, isPending: false, error });
}

function svar(spørsmål: string, svar: string) {
    return userEvent.click(
        within(screen.getByRole('radiogroup', { name: spørsmål })).getByRole('radio', { name: svar }),
    );
}

async function fyllUtOppfyltVurdering() {
    await svar(eøsBorger, 'Ja');
    await svar(oppholdIGodkjentOmråde, 'Ja');
    await fyllUtBegrunnelse();
}

async function fyllUtBegrunnelse() {
    await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Opphold utenfor EØS');
    await userEvent.click(screen.getByRole('radio', { name: 'Saken er godt nok opplyst i Speil' }));
}
