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

const eøsBorger = 'Er personen EU-/EØS-borger?';
const oppfyllerKravet = 'Oppfyller medlemmet oppholdskravet?';
const grunnForOppfylt = 'Begrunnelse for godkjent opphold';
const grunnForIkkeOppfylt = 'Begrunnelse for ikke godkjent opphold';
const oppholdIGodkjentOmråde = 'Har oppholdt seg i Norge, EU/EØS eller et land med trygdeavtale';

beforeEach(() => {
    mutate.mockClear();
    onLukk.mockClear();
    onLagret.mockClear();
    addToast.mockClear();
    mockMutation({});
});

describe('OppholdskravSkjema', () => {
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

        expect(mutate).toHaveBeenCalledWith(
            expect.objectContaining({ data: expect.objectContaining({ dager: ['2024-07-15', '2024-07-17'] }) }),
        );
    });

    it('ber om å markere dager når ingen er markert', async () => {
        renderSkjema([]);
        await fyllUtOppfyltVurdering();
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

    it('viser begrunnelsene for utfallet som er valgt', async () => {
        renderSkjema();

        expect(screen.queryByRole('radiogroup', { name: grunnForOppfylt })).not.toBeInTheDocument();
        expect(screen.queryByRole('radiogroup', { name: grunnForIkkeOppfylt })).not.toBeInTheDocument();

        await svar(oppfyllerKravet, 'Ja');
        expect(screen.getByRole('radiogroup', { name: grunnForOppfylt })).toBeVisible();
        expect(screen.queryByRole('radiogroup', { name: grunnForIkkeOppfylt })).not.toBeInTheDocument();

        await svar(oppfyllerKravet, 'Nei');
        expect(screen.getByRole('radiogroup', { name: grunnForIkkeOppfylt })).toBeVisible();
        expect(screen.queryByRole('radiogroup', { name: grunnForOppfylt })).not.toBeInTheDocument();
    });

    it('har begrunnelsene fra skissen', async () => {
        renderSkjema();

        await svar(oppfyllerKravet, 'Ja');
        expect(radioer(grunnForOppfylt)).toEqual([
            'Innvilget søknad om utenlandsopphold utenfor EU/EØS',
            'Medlem etter §§ 2-5, 2-6 eller 2-8',
            'Godkjent opphold på helseinstitusjon i utlandet',
            'Sykefraværet skyldes en godkjent yrkesskade',
            oppholdIGodkjentOmråde,
        ]);

        await svar(oppfyllerKravet, 'Nei');
        expect(radioer(grunnForIkkeOppfylt)).toEqual([
            'Nav-kontoret har avslått søknaden',
            'Sykmeldt har ikke sendt søknad om å beholde sykepenger utenfor EU/EØS',
        ]);
    });

    it('nevner bare opphold i Norge når personen ikke er EU-/EØS-borger', async () => {
        renderSkjema();

        await svar(eøsBorger, 'Nei');
        await svar(oppfyllerKravet, 'Ja');

        expect(radioer(grunnForOppfylt)).toContain('Har oppholdt seg i Norge');
        expect(radioer(grunnForOppfylt)).not.toContain(oppholdIGodkjentOmråde);
    });

    it('krever begrunnelse for utfallet', async () => {
        renderSkjema();

        await svar(eøsBorger, 'Ja');
        await svar(oppfyllerKravet, 'Nei');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Velg begrunnelse')).toBeVisible();
        expect(mutate).not.toHaveBeenCalled();
    });

    it('viser feil og sender ingenting når svar mangler', async () => {
        renderSkjema();

        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findAllByText('Svar ja eller nei')).toHaveLength(2);
        expect(screen.getByText('Fyll inn begrunnelse')).toBeVisible();
        expect(mutate).not.toHaveBeenCalled();
    });

    it('sender vurderingen etter leddene i § 8-9', async () => {
        renderSkjema();

        await svar(eøsBorger, 'Ja');
        await svar(oppfyllerKravet, 'Ja');
        await svar(grunnForOppfylt, 'Godkjent opphold på helseinstitusjon i utlandet');
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

    it('sender et krav som ikke er oppfylt', async () => {
        renderSkjema();

        await svar(eøsBorger, 'Nei');
        await svar(oppfyllerKravet, 'Nei');
        await svar(grunnForIkkeOppfylt, 'Nav-kontoret har avslått søknaden');
        await fyllUtBegrunnelse();
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    eøsBorger: false,
                    oppholdIGodkjentOmråde: false,
                    unntakAndreLedd: 'INGEN',
                    godkjentOppholdInntilFireUker: false,
                }),
            }),
        );
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
        await svar(oppfyllerKravet, 'Nei');

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
    await svar(oppfyllerKravet, 'Ja');
    await svar(grunnForOppfylt, oppholdIGodkjentOmråde);
    await fyllUtBegrunnelse();
}

async function fyllUtBegrunnelse() {
    await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Opphold utenfor EØS');
    await userEvent.click(screen.getByRole('radio', { name: 'Saken er godt nok opplyst i Speil' }));
}

function radioer(gruppe: string): string[] {
    return within(screen.getByRole('radiogroup', { name: gruppe }))
        .getAllByRole('radio')
        .map((radio) => (radio as HTMLInputElement).labels?.[0]?.textContent ?? '');
}
