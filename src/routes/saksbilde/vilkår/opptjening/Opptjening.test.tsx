import { ApiUtfall, ApiVilkårskode } from '@io/rest/generated/vilkarsproving.schemas';
import { useGetOpptjeningshistorikkBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import {
    automatiskIkkeOppfyltArbeidMinst4Uker,
    automatiskVurdertArbeidMinst4Uker,
    ingenAutomatiskeVurderinger,
    medLikestiltYtelse,
    medOpptjening,
    mockVilkårsvurderinger,
    opptjeningsvilkår,
    overførtFraInfotrygd,
    overførtFraSpleis,
    refetch,
    renderOpptjening,
    saksbehandlerOppfyltArbeidMinst4Uker,
    settOppOpptjeningsmocker,
    startVurdering,
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

const brukerrolleMock = vi.hoisted(() => ({
    erCoachFagkoordinatorEllerSupersaksbehandler: true,
}));

vi.mock('@hooks/brukerrolleHooks', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hooks/brukerrolleHooks')>()),
    useErCoachFagkoordinatorEllerSupersaksbehandler: () => brukerrolleMock.erCoachFagkoordinatorEllerSupersaksbehandler,
}));

beforeEach(() => {
    brukerrolleMock.erCoachFagkoordinatorEllerSupersaksbehandler = true;
    settOppOpptjeningsmocker();
});

describe('Opptjening', () => {
    it('henter historikk først når opptjeningsvurderingen er hentet', () => {
        mockVilkårsvurderinger(undefined, { isLoading: true, isFetching: true });
        const { rerender } = renderOpptjening(false);

        expect(useGetOpptjeningshistorikkBehandler).toHaveBeenLastCalledWith(
            'en-person',
            { skjæringstidspunkt: '2024-01-01' },
            { query: { enabled: false } },
        );

        mockVilkårsvurderinger(automatiskIkkeOppfyltArbeidMinst4Uker);
        rerender(medOpptjening(false));

        expect(useGetOpptjeningshistorikkBehandler).toHaveBeenLastCalledWith(
            'en-person',
            { skjæringstidspunkt: '2024-01-01' },
            { query: { enabled: true } },
        );
    });

    it('venter med historikk mens opptjeningsvurderingen hentes på nytt', () => {
        mockVilkårsvurderinger(automatiskIkkeOppfyltArbeidMinst4Uker, { isFetching: true });
        renderOpptjening(false);

        expect(useGetOpptjeningshistorikkBehandler).toHaveBeenLastCalledWith(
            'en-person',
            { skjæringstidspunkt: '2024-01-01' },
            { query: { enabled: false } },
        );
    });

    it('henter ikke historikk når opptjeningsvurderingen feiler', () => {
        mockVilkårsvurderinger(automatiskIkkeOppfyltArbeidMinst4Uker, { isError: true });
        renderOpptjening(false);

        expect(useGetOpptjeningshistorikkBehandler).toHaveBeenLastCalledWith(
            'en-person',
            { skjæringstidspunkt: '2024-01-01' },
            { query: { enabled: false } },
        );
    });

    it('viser grunnlagsdata for automatisk vurdering', () => {
        renderOpptjening(true);

        expect(within(opptjeningsvilkår()).getByText('Opptjening fra')).toBeVisible();
        expect(within(opptjeningsvilkår()).getByText('01.01.2023 (120 dager)')).toBeVisible();
        const automatiskVurdering = within(opptjeningsvilkår()).getByText(/Vurdert automatisk/, { selector: 'span' });
        expect(automatiskVurdering).toBeVisible();
        expect(automatiskVurdering).not.toHaveAttribute('data-sensitive');
    });

    it('skjuler vurderingsknappene når saksbehandler ikke er coach, fagkoordinator eller supersaksbehandler', () => {
        brukerrolleMock.erCoachFagkoordinatorEllerSupersaksbehandler = false;

        renderOpptjening(false);

        expect(screen.queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Vurder automatisk på nytt' })).not.toBeInTheDocument();
    });

    it('skjuler vurder vilkår-knappen når vilkåret er automatisk oppfylt', () => {
        mockVilkårsvurderinger(automatiskVurdertArbeidMinst4Uker);

        renderOpptjening(false);

        expect(within(opptjeningsvilkår()).queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
    });

    it('skjuler vurder vilkår-knappen når vilkåret er overført fra Spleis som oppfylt', () => {
        mockVilkårsvurderinger(overførtFraSpleis);

        renderOpptjening(false);

        expect(within(opptjeningsvilkår()).queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
    });

    it('viser vurder vilkår-knappen når saksbehandler har vurdert vilkåret som oppfylt', () => {
        mockVilkårsvurderinger(saksbehandlerOppfyltArbeidMinst4Uker);

        renderOpptjening(false);

        expect(within(opptjeningsvilkår()).getByRole('button', { name: 'Vurder vilkår' })).toBeVisible();
        expect(within(opptjeningsvilkår()).getByText('S123456')).toHaveAttribute('data-sensitive');
    });

    it('markerer vilkåret som vurderes', async () => {
        renderOpptjening(false);

        expect(opptjeningsvilkår()).not.toHaveClass('bg-ax-bg-accent-soft');

        await startVurdering();

        expect(opptjeningsvilkår()).toHaveClass('bg-ax-bg-accent-soft');
    });

    it('viser vurder vilkår-knappen ved siden av vurder automatisk på nytt uten egen vilkårsrad', () => {
        mockVilkårsvurderinger(ingenAutomatiskeVurderinger);
        renderOpptjening(false);

        const knapper = within(opptjeningsvilkår()).getAllByRole('button');
        const vurderVilkår = within(opptjeningsvilkår()).getByRole('button', { name: 'Vurder vilkår' });
        const vurderPåNytt = within(opptjeningsvilkår()).getByRole('button', { name: /Vurder automatisk på nytt/ });
        expect(knapper.indexOf(vurderVilkår)).toBe(knapper.indexOf(vurderPåNytt) + 1);
        expect(within(opptjeningsvilkår()).queryByRole('list')).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Arbeid og likestilte ytelser' })).not.toBeInTheDocument();
    });

    it('viser vilkåret som ikke vurdert når ingenting er vurdert', () => {
        mockVilkårsvurderinger(ingenAutomatiskeVurderinger);

        renderOpptjening(false);

        expect(within(opptjeningsvilkår()).getByText('Ikke vurdert', { selector: 'span' })).toBeVisible();
    });

    it('skjuler vurderingsknappene når saken er read only', () => {
        renderOpptjening(true);

        expect(screen.queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Vurder automatisk på nytt' })).not.toBeInTheDocument();
    });

    it('skjuler vurderingsknappene når saksbehandler ser på en tidligere behandling', async () => {
        renderOpptjening(false, true);

        expect(await screen.findByRole('region', { name: 'Opptjeningstid' })).toBeVisible();
        expect(screen.queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Vurder automatisk på nytt' })).not.toBeInTheDocument();
    });

    it('viser "Vurdert i Infotrygd" uten enkeltvilkår når kravet er overført fra Infotrygd', () => {
        mockVilkårsvurderinger(overførtFraInfotrygd);

        renderOpptjening(false);

        const opptjening = screen.getByRole('region', { name: /^Opptjeningstid/ });
        expect(within(opptjening).getByText('Vurdert i Infotrygd')).toBeVisible();
        expect(within(opptjening).queryByRole('list')).not.toBeInTheDocument();
        expect(within(opptjening).queryByRole('button', { name: 'Vurder vilkår' })).not.toBeInTheDocument();
    });

    it('viser vurderinger overført fra Spleis på samme måte som vurderinger fra sp-vilkårsprøving', () => {
        mockVilkårsvurderinger(overførtFraSpleis);

        renderOpptjening(false);

        expect(within(opptjeningsvilkår()).getByText(/Vurdert automatisk/, { selector: 'span' })).toHaveAttribute(
            'data-color',
            'neutral',
        );
    });

    it('viser utfallet etter andre ledd uten svar og hjemmel etter lagring', () => {
        mockVilkårsvurderinger(
            medLikestiltYtelse([
                [ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER, ApiUtfall.IKKE_OPPFYLT],
                [ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER, ApiUtfall.OPPFYLT],
                [ApiVilkårskode.OPPTJENING_FORELDREPENGER_IKKE_OPPTJENT_PA_AAP, ApiUtfall.IKKE_OPPFYLT],
                [ApiVilkårskode.OPPTJENING_YRKESAKTIV_MINST_4_UKER_FOR_UTTAK_AV_FORELDREPENGER, ApiUtfall.OPPFYLT],
            ]),
        );

        renderOpptjening(false);

        const rad = within(opptjeningsvilkår());
        expect(rad.getByTitle('Oppfylt')).toBeInTheDocument();
        expect(rad.getByRole('button', { name: 'Vurder vilkår' })).toBeVisible();
        expect(rad.queryByText('Foreldrepenger opptjent på AAP')).not.toBeInTheDocument();
        expect(rad.queryByText('§ 8-2 andre ledd tredje punktum')).not.toBeInTheDocument();
        expect(rad.queryByText('Hadde FP etter jobb')).not.toBeInTheDocument();
    });

    it('viser feilmelding når vilkårsvurderingen ikke kan hentes', () => {
        mockVilkårsvurderinger(undefined, { isError: true });

        renderOpptjening(false);

        expect(screen.getByText('Kunne ikke hente opptjeningsvurderingen.')).toBeVisible();
    });

    it('henter vilkårsvurderingen på nytt når saksbehandler trykker «Prøv igjen»', async () => {
        mockVilkårsvurderinger(undefined, { isError: true });

        renderOpptjening(false);
        await userEvent.click(within(opptjeningsvilkår()).getByRole('button', { name: 'Prøv igjen' }));

        expect(refetch).toHaveBeenCalledTimes(1);
    });
});
