import { Mock } from 'vitest';

import { axe } from '@/test/axe';
import { usePostOppholdskravvurderingBehandler } from '@io/rest/generated/avslagsdager/vurderinger/vurderinger';
import { render, screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { OppholdskravDialog } from './OppholdskravDialog';

vi.mock('@io/rest/generated/avslagsdager/vurderinger/vurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/avslagsdager/vurderinger/vurderinger')>()),
    usePostOppholdskravvurderingBehandler: vi.fn(),
}));

vi.mock('@hooks/brukerrolleHooks', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hooks/brukerrolleHooks')>()),
    useHarSkrivetilgang: () => true,
}));

const mutate = vi.fn();
const onLukk = vi.fn();

const eøsBorger = 'Er personen EØS-borger?';
const oppholdIGodkjentOmråde = 'Oppholdt personen seg i Norge, et annet EØS-land eller et avtaleland?';
const oppholdINorge = 'Oppholdt personen seg i Norge?';
const unntak = 'Gjelder et av unntakene i andre ledd?';
const godkjentOpphold = 'Har Nav godkjent oppholdet utenfor Norge i inntil fire uker?';

beforeEach(() => {
    mutate.mockClear();
    onLukk.mockClear();
    mockMutation({});
});

describe('OppholdskravDialog', () => {
    it('viser de valgte dagene', () => {
        renderDialog();

        expect(screen.getByText('15.07.2024, 16.07.2024')).toBeVisible();
    });

    it('viser andre ledd bare når første ledd ikke er oppfylt', async () => {
        renderDialog();

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
        renderDialog();

        await svar(eøsBorger, 'Nei');

        expect(screen.getByRole('radiogroup', { name: oppholdINorge })).toBeVisible();
        expect(screen.queryByRole('radiogroup', { name: oppholdIGodkjentOmråde })).not.toBeInTheDocument();
    });

    it('viser utfallet når alle aktuelle spørsmål er besvart', async () => {
        renderDialog();

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
        renderDialog();

        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findAllByText('Svar ja eller nei')).toHaveLength(2);
        expect(screen.getByText('Fyll inn begrunnelse')).toBeVisible();
        expect(mutate).not.toHaveBeenCalled();
    });

    it('sender vurderingen med skjulte svar som null', async () => {
        renderDialog();

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

    it('lukker etter lagring', async () => {
        (usePostOppholdskravvurderingBehandler as Mock).mockImplementation((options) => ({
            mutate: (variables: unknown) => options?.mutation?.onSuccess?.({ vurderingId: 'id' }, variables),
            isPending: false,
            error: null,
        }));
        renderDialog();

        await svar(eøsBorger, 'Ja');
        await svar(oppholdIGodkjentOmråde, 'Ja');
        await fyllUtBegrunnelse();
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(onLukk).toHaveBeenCalled();
    });

    it('viser feilmeldingen fra sp-avslagsdager', () => {
        mockMutation({ error: { status: 400, info: { title: 'Dager må oppgis' } } });

        renderDialog();

        expect(screen.getByText('Dager må oppgis')).toBeVisible();
    });

    it('viser egen feilmelding når saksbehandler mangler tilgang', () => {
        mockMutation({ error: { status: 403, info: { title: 'Mangler tilgang' } } });

        renderDialog();

        expect(screen.getByText('Du har ikke tilgang til å vurdere oppholdskravet for denne personen.')).toBeVisible();
    });

    it('har ingen tilgjengelighetsfeil', async () => {
        renderDialog();
        await svar(oppholdIGodkjentOmråde, 'Nei');
        await svar(unntak, 'Nei');

        const result = await axe(document.body);
        expect(result.violations).toEqual([]);
    });
});

function renderDialog() {
    return render(
        <OppholdskravDialog
            personPseudoId="en-person"
            behandlingId="en-behandling"
            dager={['2024-07-16', '2024-07-15']}
            onLukk={onLukk}
        />,
    );
}

function mockMutation({ error = null }: { error?: unknown }) {
    (usePostOppholdskravvurderingBehandler as Mock).mockReturnValue({ mutate, isPending: false, error });
}

function svar(spørsmål: string, svar: string) {
    return userEvent.click(
        within(screen.getByRole('radiogroup', { name: spørsmål })).getByRole('radio', { name: svar }),
    );
}

async function fyllUtBegrunnelse() {
    await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Opphold utenfor EØS');
    await userEvent.click(screen.getByRole('radio', { name: 'Saken er godt nok opplyst i Speil' }));
}
