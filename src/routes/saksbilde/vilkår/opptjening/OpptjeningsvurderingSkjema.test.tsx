import { ApiOpptjeningsaktivitet } from '@io/rest/generated/vilkarsproving.schemas';
import { screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import {
    bareArbeid,
    ingenAutomatiskeVurderinger,
    medOpptjening,
    minst4Uker,
    mockVilkårsvurderinger,
    mutate,
    opptjeningsvilkår,
    renderOpptjening,
    saksbehandlerOppfyltArbeidMinst4Uker,
    settOppOpptjeningsmocker,
    startVurdering,
    svar,
    velgBareArbeid,
    velgOpplystISpeil,
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
    useHarSkrivetilgang: () => true,
    useErCoachFagkoordinatorEllerSupersaksbehandler: () => true,
}));

const opptjentPåAap = /opptjent på grunnlag av arbeidsavklaringspenger/;
const yrkesaktiv = /sammenhengende yrkesaktiv/;
const aktiviteter = /Hvilken likestilt ytelse\/arbeid/;

beforeEach(() => {
    settOppOpptjeningsmocker();
});

describe('Opptjeningsvurderingsskjema', () => {
    it('forhåndsvelger ikke svar fra eksisterende vurdering', async () => {
        mockVilkårsvurderinger(saksbehandlerOppfyltArbeidMinst4Uker);

        renderOpptjening(false);
        await startVurdering();

        expect(screen.getByRole('radio', { name: 'Ja' })).not.toBeChecked();
        expect(screen.getByRole('radio', { name: 'Nei' })).not.toBeChecked();
    });

    it('viser arbeid først blant aktivitetene', async () => {
        renderOpptjening(false);
        await startVurdering();
        await svar(minst4Uker, 'Ja');

        const valg = within(screen.getByRole('group', { name: aktiviteter }))
            .getAllByRole('checkbox')
            .map((checkbox) => checkbox.getAttribute('value'));
        expect(valg).toEqual([
            ApiOpptjeningsaktivitet.ARBEID,
            ApiOpptjeningsaktivitet.DAGPENGER,
            ApiOpptjeningsaktivitet.SYKEPENGER,
            ApiOpptjeningsaktivitet.KAPITTEL_9,
            ApiOpptjeningsaktivitet.FORELDREPENGER,
            ApiOpptjeningsaktivitet.SVANGERSKAPSPENGER,
        ]);
    });

    it('viser bare oppfølgingsspørsmålene som er aktuelle', async () => {
        renderOpptjening(false);
        await startVurdering();

        expect(screen.queryByRole('group', { name: aktiviteter })).not.toBeInTheDocument();

        await svar(minst4Uker, 'Ja');
        expect(screen.getByRole('group', { name: aktiviteter })).toBeVisible();
        expect(screen.queryByRole('radiogroup', { name: opptjentPåAap })).not.toBeInTheDocument();

        await userEvent.click(screen.getByRole('checkbox', { name: 'Foreldrepenger (kap. 14)' }));
        expect(screen.getByRole('radiogroup', { name: opptjentPåAap })).toBeVisible();
        expect(screen.queryByRole('radiogroup', { name: yrkesaktiv })).not.toBeInTheDocument();

        await svar(opptjentPåAap, 'Ja');
        expect(screen.getByRole('radiogroup', { name: yrkesaktiv })).toBeVisible();
    });

    it('sender bare arbeid når saksbehandler bare velger arbeid', async () => {
        renderOpptjening(false);
        await startVurdering();

        await velgBareArbeid();
        expect(screen.getByText('Vilkåret er oppfylt')).toBeVisible();
        await velgOpplystISpeil();
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Har jobbet');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).toHaveBeenCalledWith({
            personId: 'en-person',
            data: {
                skjæringstidspunkt: '2024-01-01',
                ...bareArbeid,
                fritekstbegrunnelse: 'Har jobbet',
                journalpostId: [],
            },
        });
    });

    it('sender arbeid sammen med likestilte ytelser', async () => {
        renderOpptjening(false);
        await startVurdering();

        await svar(minst4Uker, 'Ja');
        await userEvent.click(screen.getByRole('checkbox', { name: 'Arbeid' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Sykepenger (kap. 8)' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Foreldrepenger (kap. 14)' }));
        await svar(opptjentPåAap, 'Ja');
        await svar(yrkesaktiv, 'Ja');
        expect(screen.getByText('Vilkåret er oppfylt')).toBeVisible();
        await velgOpplystISpeil();
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Hadde FP etter jobb');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).toHaveBeenCalledWith({
            personId: 'en-person',
            data: {
                skjæringstidspunkt: '2024-01-01',
                minst4Uker: true,
                opptjeningsaktiviteter: [
                    ApiOpptjeningsaktivitet.ARBEID,
                    ApiOpptjeningsaktivitet.SYKEPENGER,
                    ApiOpptjeningsaktivitet.FORELDREPENGER,
                ],
                foreldrepengerOpptjentPåAap: true,
                yrkesaktivMinst4UkerFørUttak: true,
                fritekstbegrunnelse: 'Hadde FP etter jobb',
                journalpostId: [],
            },
        });
    });

    it('kan ikke lagre når søkeren ikke har hatt opptjening i minst 4 uker', async () => {
        renderOpptjening(false);
        await startVurdering();

        await svar(minst4Uker, 'Nei');

        expect(
            screen.getByText('Det er ennå ikke støtte for å manuelt vurdere vilkåret til ikke oppfylt'),
        ).toBeVisible();
        expect(screen.queryByRole('textbox', { name: /Begrunnelse/ })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Lagre' })).not.toBeInTheDocument();
    });

    it('kan ikke lagre når foreldrepenger opptjent på AAP mangler yrkesaktivitet før uttak', async () => {
        renderOpptjening(false);
        await startVurdering();

        await svar(minst4Uker, 'Ja');
        await userEvent.click(screen.getByRole('checkbox', { name: 'Foreldrepenger (kap. 14)' }));
        await svar(opptjentPåAap, 'Ja');
        await svar(yrkesaktiv, 'Nei');

        expect(
            screen.getByText('Det er ennå ikke støtte for å manuelt vurdere vilkåret til ikke oppfylt'),
        ).toBeVisible();
        expect(screen.queryByRole('textbox', { name: /Begrunnelse/ })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Lagre' })).not.toBeInTheDocument();
    });

    it('validerer at første spørsmål og begrunnelse er besvart', async () => {
        mockVilkårsvurderinger(ingenAutomatiskeVurderinger);
        renderOpptjening(false);

        await startVurdering();
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(mutate).not.toHaveBeenCalled();
        expect(await screen.findByText('Svar ja eller nei')).toBeVisible();
        expect(screen.getByText('Fyll inn begrunnelse')).toBeVisible();
    });

    it('krever minst én aktivitet', async () => {
        renderOpptjening(false);
        await startVurdering();

        await svar(minst4Uker, 'Ja');
        await userEvent.type(screen.getByRole('textbox', { name: /Begrunnelse/ }), 'Begrunnelse');
        await userEvent.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Velg minst én')).toBeVisible();
        expect(mutate).not.toHaveBeenCalled();
    });

    it('lar saksbehandler avbryte en vurderingsøkt', async () => {
        renderOpptjening(false);

        await startVurdering();

        expect(screen.getByRole('radiogroup', { name: minst4Uker })).toBeVisible();

        await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }));

        expect(screen.queryByRole('radiogroup', { name: minst4Uker })).not.toBeInTheDocument();
        expect(within(opptjeningsvilkår()).getByRole('button', { name: 'Vurder vilkår' })).toBeVisible();
    });

    it('lukker vurderingsskjemaet når saksbehandler navigerer til en tidligere behandling', async () => {
        const { rerender } = renderOpptjening(false);

        await startVurdering();
        expect(screen.getByRole('textbox', { name: /Begrunnelse/ })).toBeVisible();

        rerender(medOpptjening(false, true));

        expect(screen.queryByRole('textbox', { name: /Begrunnelse/ })).not.toBeInTheDocument();
    });
});
