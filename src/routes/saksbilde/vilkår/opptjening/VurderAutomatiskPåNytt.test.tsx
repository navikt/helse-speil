import { Mock } from 'vitest';

import { getGetSaksbehandlerhandlingerForPersonQueryKey } from '@io/rest/generated/personer/personer';
import { ApiServerSentEventEvent } from '@io/rest/generated/spesialist.schemas';
import { ApiNyAutomatiskVilkårsvurderingStatus } from '@io/rest/generated/vilkarsproving.schemas';
import {
    getGetOpptjeningshistorikkBehandlerQueryKey,
    getGetVilkårsvurderingerForPersonBehandlerQueryKey,
    useGetVilkårsvurderingerForPersonBehandler,
} from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { QueryClient } from '@tanstack/react-query';
import { act, screen, waitFor } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { medOpptjening, mutateNyAutomatisk, renderOpptjening, settOppOpptjeningsmocker } from './opptjeningTestoppsett';

const serverSentEventMock = vi.hoisted(() => ({
    onEvent: undefined as ((event: { event: string; data: null }) => void) | undefined,
}));

vi.mock('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger')>()),
    useGetVilkårsvurderingerForPersonBehandler: vi.fn(),
    useGetOpptjeningshistorikkBehandler: vi.fn(),
    usePostManuellOpptjeningsvurderingBehandler: vi.fn(),
    usePostNyAutomatiskVilkårsvurderingBehandler: vi.fn(),
}));

vi.mock('@state/serverSentEvents', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/serverSentEvents')>()),
    useHåndterNyttEvent: (onEvent: (event: { event: string; data: null }) => void) => {
        serverSentEventMock.onEvent = onEvent;
    },
}));

vi.mock('@hooks/brukerrolleHooks', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hooks/brukerrolleHooks')>()),
    useErCoachFagkoordinatorEllerSupersaksbehandler: () => true,
}));

beforeEach(() => {
    settOppOpptjeningsmocker();
});

describe('Vurder automatisk på nytt', () => {
    it('ber om bekreftelse før ny automatisk vurdering', async () => {
        renderOpptjening(false);

        await userEvent.click(vurderAutomatiskPåNyttKnapp()!);

        expect(await screen.findByRole('dialog', { name: 'Er du sikker?' })).toBeVisible();
        expect(mutateNyAutomatisk).not.toHaveBeenCalled();
    });

    it('sender ikke ny automatisk vurdering når saksbehandler avbryter', async () => {
        renderOpptjening(false);

        await userEvent.click(vurderAutomatiskPåNyttKnapp()!);
        await userEvent.click(await screen.findByRole('button', { name: 'Avbryt' }));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        expect(mutateNyAutomatisk).not.toHaveBeenCalled();
    });

    it('ber om ny automatisk vurdering for skjæringstidspunktet', async () => {
        renderOpptjening(false);

        await bekreftVurderAutomatiskPåNytt();

        expect(mutateNyAutomatisk).toHaveBeenCalledWith(
            { personId: 'en-person', data: { skjæringstidspunkt: '2024-01-01' } },
            expect.anything(),
        );
    });

    it('invaliderer hele opptjeningen først når grunnlaget er reberegnet', async () => {
        const invalidateQueries = vi.spyOn(QueryClient.prototype, 'invalidateQueries');
        try {
            renderOpptjening(false);

            await bekreftVurderAutomatiskPåNytt();
            svarPåNyAutomatiskVurdering({ status: ApiNyAutomatiskVilkårsvurderingStatus.VENTER_PÅ_GRUNNLAG });

            expect(invalidateQueries).not.toHaveBeenCalledWith({
                queryKey: getGetOpptjeningshistorikkBehandlerQueryKey('en-person'),
            });

            sendNySaksbehandleroppgave();

            forventOpptjeningenInvalidert(invalidateQueries);
        } finally {
            invalidateQueries.mockRestore();
        }
    });

    it('invaliderer hele opptjeningen når opptjeningen er vurdert på nytt', async () => {
        const invalidateQueries = vi.spyOn(QueryClient.prototype, 'invalidateQueries');
        try {
            renderOpptjening(false);

            await bekreftVurderAutomatiskPåNytt();
            svarPåNyAutomatiskVurdering({
                status: ApiNyAutomatiskVilkårsvurderingStatus.VURDERT,
                opptjeningsvurderingId: 'ny-id',
            });

            forventOpptjeningenInvalidert(invalidateQueries);
        } finally {
            invalidateQueries.mockRestore();
        }
    });

    it('henter nyeste opptjeningsvurdering fra spleis selv om den er overstyrt tidligere', async () => {
        const { rerender } = renderOpptjening(false);

        await bekreftVurderAutomatiskPåNytt();
        svarPåNyAutomatiskVurdering({
            status: ApiNyAutomatiskVilkårsvurderingStatus.VURDERT,
            opptjeningsvurderingId: 'overstyrt-id',
        });

        expect(useGetVilkårsvurderingerForPersonBehandler).toHaveBeenLastCalledWith('en-person', {
            opptjeningsvurderingId: 'overstyrt-id',
        });

        rerender(medOpptjening(false, false, 'ny-id-fra-spleis'));

        expect(useGetVilkårsvurderingerForPersonBehandler).toHaveBeenLastCalledWith('en-person', {
            opptjeningsvurderingId: 'ny-id-fra-spleis',
        });
    });

    it('er deaktivert mens visningen oppdateres', async () => {
        renderOpptjening(false);

        await bekreftVurderAutomatiskPåNytt();
        svarPåNyAutomatiskVurdering({ status: ApiNyAutomatiskVilkårsvurderingStatus.VENTER_PÅ_GRUNNLAG });

        expect(vurderAutomatiskPåNyttKnapp()).toBeDisabled();

        sendNySaksbehandleroppgave();

        expect(vurderAutomatiskPåNyttKnapp()).toBeEnabled();
    });
});

function vurderAutomatiskPåNyttKnapp() {
    return screen.queryByRole('button', { name: 'Vurder automatisk på nytt' });
}

async function bekreftVurderAutomatiskPåNytt() {
    await userEvent.click(vurderAutomatiskPåNyttKnapp()!);
    await userEvent.click(await screen.findByRole('button', { name: 'Ja' }));
}

function svarPåNyAutomatiskVurdering(svar: {
    status: ApiNyAutomatiskVilkårsvurderingStatus;
    opptjeningsvurderingId?: string;
}) {
    const [variables, options] = mutateNyAutomatisk.mock.calls[0]!;
    act(() => options.onSuccess?.(svar, variables, undefined, undefined));
}

function sendNySaksbehandleroppgave() {
    act(() => serverSentEventMock.onEvent?.({ event: ApiServerSentEventEvent.NY_SAKSBEHANDLEROPPGAVE, data: null }));
}

function forventOpptjeningenInvalidert(invalidateQueries: Mock) {
    [
        getGetVilkårsvurderingerForPersonBehandlerQueryKey('en-person'),
        getGetOpptjeningshistorikkBehandlerQueryKey('en-person'),
        getGetSaksbehandlerhandlingerForPersonQueryKey('en-person'),
    ].forEach((queryKey) => expect(invalidateQueries).toHaveBeenCalledWith({ queryKey }));
}
