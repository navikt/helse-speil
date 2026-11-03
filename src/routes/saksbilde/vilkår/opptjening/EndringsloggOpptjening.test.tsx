import { ApiOpptjeningshistorikkInnslag, ApiUtfall, ApiVilkårskode } from '@io/rest/generated/vilkarsproving.schemas';
import { screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import {
    automatiskIkkeOppfyltArbeidMinst4Uker,
    medId,
    medLikestiltYtelse,
    mockOpptjeningshistorikk,
    overførtFraInfotrygd,
    renderOpptjening,
    saksbehandlerOppfyltArbeidMinst4Uker,
    settOppOpptjeningsmocker,
} from './opptjeningTestoppsett';

vi.mock('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger')>()),
    useGetVilkårsvurderingerForPersonBehandler: vi.fn(),
    useGetOpptjeningshistorikkBehandler: vi.fn(),
    usePostManuellOpptjeningsvurderingBehandler: vi.fn(),
    usePostNyAutomatiskVilkårsvurderingBehandler: vi.fn(),
}));

vi.mock('@state/serverSentEvents', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/serverSentEvents')>()),
    useHåndterNyttEvent: () => {},
}));

vi.mock('@hooks/brukerrolleHooks', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hooks/brukerrolleHooks')>()),
    useErCoachFagkoordinatorEllerSupersaksbehandler: () => true,
}));

const automatiskInnslag: ApiOpptjeningshistorikkInnslag = {
    vurdertTidspunkt: '2025-04-01T10:03:00.000Z',
    opptjeningsvurdering: medId(automatiskIkkeOppfyltArbeidMinst4Uker, 'opptjeningsvurdering-1', {
        id: 'vilkårsvurdering-1',
        vurdertTidspunkt: '2025-04-01T10:03:00.000Z',
    }),
};

const manuellInnslag: ApiOpptjeningshistorikkInnslag = {
    vurdertTidspunkt: '2025-07-25T12:21:00.000Z',
    opptjeningsvurdering: medId(saksbehandlerOppfyltArbeidMinst4Uker, 'opptjeningsvurdering-2', {
        id: 'vilkårsvurdering-2',
        vurdertTidspunkt: '2025-07-25T12:21:00.000Z',
    }),
};

beforeEach(() => {
    settOppOpptjeningsmocker();
});

describe('Endringslogg for opptjening', () => {
    it('viser ikke endringslogg når det bare finnes én opptjeningsvurdering', () => {
        mockOpptjeningshistorikk([automatiskInnslag]);

        renderOpptjening(true);

        expect(endringsloggknapp()).not.toBeInTheDocument();
    });

    it('viser alle vurderingene, nyeste først, når det finnes flere opptjeningsvurderinger', async () => {
        mockOpptjeningshistorikk([automatiskInnslag, manuellInnslag]);

        renderOpptjening(true);
        await userEvent.click(endringsloggknapp()!);

        const [nyeste, eldste] = endringsloggrader();
        expect(endringsloggrader()).toHaveLength(2);
        expect(within(nyeste!).getByText(/^25.07.2025/)).toBeVisible();
        expect(within(nyeste!).getByText('Opptjeningstid')).toBeVisible();
        expect(within(nyeste!).getByText('Oppfylt')).toBeVisible();
        expect(within(nyeste!).getByText('Har likestilt ytelse')).toBeVisible();
        expect(within(nyeste!).getByText('S123456')).toBeVisible();
        expect(within(eldste!).getByText('Ikke oppfylt')).toBeVisible();
        expect(within(eldste!).getByText('Automatisk')).toBeVisible();
    });

    it('viser én endringsloggrad for en vurdering av likestilt ytelse', async () => {
        mockOpptjeningshistorikk([automatiskInnslag, likestiltInnslag()]);

        renderOpptjening(true);
        await userEvent.click(endringsloggknapp()!);

        expect(endringsloggrader()).toHaveLength(2);
        expect(within(endringsloggrader()[0]!).getByText('Opptjeningstid')).toBeVisible();
    });

    it('viser svarene og hjemmelen når likestilt ytelse-raden ekspanderes', async () => {
        mockOpptjeningshistorikk([automatiskInnslag, likestiltInnslag()]);

        renderOpptjening(false);
        await userEvent.click(endringsloggknapp()!);
        const dialog = screen.getByRole('dialog');
        await userEvent.click(within(endringsloggrader()[0]!).getByRole('button'));

        const detaljer = within(dialog);
        expect(detaljer.getByText('Foreldrepenger')).toBeVisible();
        expect(detaljer.getByText('Foreldrepenger opptjent på AAP').nextSibling).toHaveTextContent('Ja');
        expect(detaljer.getByText('Yrkesaktiv 4 uker før uttak').nextSibling).toHaveTextContent('Ja');
        expect(detaljer.getByText('§ 8-2 andre ledd tredje punktum')).toBeVisible();
        expect(detaljer.getByText('Hadde FP etter jobb', { selector: 'dd' })).toBeVisible();
    });

    it('viser begrunnelsen til en manuell vurdering når raden ekspanderes', async () => {
        mockOpptjeningshistorikk([automatiskInnslag, manuellInnslag]);

        renderOpptjening(false);
        await userEvent.click(endringsloggknapp()!);
        const dialog = screen.getByRole('dialog');
        await userEvent.click(within(endringsloggrader()[0]!).getByRole('button'));

        expect(within(dialog).getByText('Begrunnelse', { selector: 'dt' }).nextSibling).toHaveTextContent(
            'Har likestilt ytelse',
        );
    });

    it('viser vilkårsvurderingen uten vurder vilkår-knapp når raden ekspanderes', async () => {
        mockOpptjeningshistorikk([automatiskInnslag, manuellInnslag]);

        renderOpptjening(false);
        await userEvent.click(endringsloggknapp()!);
        const dialog = screen.getByRole('dialog');
        await userEvent.click(within(endringsloggrader()[1]!).getByRole('button'));

        expect(within(dialog).getByText(/^Vurdert automatisk/)).toBeVisible();
        expect(within(dialog).queryByRole('button', { name: 'Vurder vilkår', hidden: true })).not.toBeInTheDocument();
    });

    it('kan ikke ekspandere opptjeningsvurderinger fra Infotrygd', async () => {
        mockOpptjeningshistorikk([
            manuellInnslag,
            { vurdertTidspunkt: '2020-01-01T10:00:00.000Z', opptjeningsvurdering: overførtFraInfotrygd.krav[0]! },
        ]);

        renderOpptjening(true);
        await userEvent.click(endringsloggknapp()!);

        expect(within(endringsloggrader()[0]!).getByRole('button')).toBeEnabled();
        expect(within(endringsloggrader()[1]!).queryByRole('button')).not.toBeInTheDocument();
    });

    it('viser en videreført vilkårsvurdering bare én gang', async () => {
        const videreført: ApiOpptjeningshistorikkInnslag = {
            ...manuellInnslag,
            opptjeningsvurdering: { ...manuellInnslag.opptjeningsvurdering, id: 'opptjeningsvurdering-3' },
        };
        mockOpptjeningshistorikk([videreført, manuellInnslag]);

        renderOpptjening(true);
        await userEvent.click(endringsloggknapp()!);

        expect(endringsloggrader()).toHaveLength(1);
    });

    it('viser opptjeningsvurderinger fra Infotrygd uten enkeltvurderinger', async () => {
        mockOpptjeningshistorikk([
            manuellInnslag,
            { vurdertTidspunkt: '2020-01-01T10:00:00.000Z', opptjeningsvurdering: overførtFraInfotrygd.krav[0]! },
        ]);

        renderOpptjening(true);
        await userEvent.click(endringsloggknapp()!);

        const infotrygdrad = endringsloggrader()[1]!;
        expect(within(infotrygdrad).getByText('Opptjeningstid')).toBeVisible();
        expect(within(infotrygdrad).getByText('Infotrygd')).toBeVisible();
    });
});

function endringsloggknapp() {
    return screen.queryByRole('button', { name: 'Vis endringslogg for opptjeningstid' });
}

function endringsloggrader() {
    return within(screen.getByRole('dialog')).getAllByRole('row').slice(1);
}

function likestiltInnslag(): ApiOpptjeningshistorikkInnslag {
    const krav = medLikestiltYtelse([
        [ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER, ApiUtfall.OPPFYLT],
        [ApiVilkårskode.OPPTJENING_FORELDREPENGER_IKKE_OPPTJENT_PA_AAP, ApiUtfall.IKKE_OPPFYLT],
        [ApiVilkårskode.OPPTJENING_YRKESAKTIV_MINST_4_UKER_FOR_UTTAK_AV_FORELDREPENGER, ApiUtfall.OPPFYLT],
    ]).krav[0]!;
    if (!('vurderinger' in krav)) throw new Error('Forventet krav med enkeltvurderinger');
    return {
        vurdertTidspunkt: '2025-07-25T12:21:00.000Z',
        opptjeningsvurdering: {
            ...krav,
            id: 'opptjeningsvurdering-likestilt',
            vurderinger: krav.vurderinger.map((vurdering) => ({
                ...vurdering,
                vurdertTidspunkt: '2025-07-25T12:21:00.000Z',
            })),
        },
    };
}
