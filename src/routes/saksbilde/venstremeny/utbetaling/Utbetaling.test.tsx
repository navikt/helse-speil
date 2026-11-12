import { fetchMock, jsonBody } from '../../../../../vitest.setup';
import { createStore } from 'jotai';
import { Mock, describe, expect, it, vi } from 'vitest';

import {
    ApiBeregnetPeriode,
    ApiLøpendeVilkår,
    ApiSykdomsdagtype,
    ApiUtfallAvLøpendeVilkår,
    ApiVurderingAvLøpendeVilkår,
} from '@io/rest/generated/spesialist.schemas';
import { Utbetaling } from '@saksbilde/venstremeny/utbetaling/Utbetaling';
import { PersonStoreContext } from '@state/contexts/personStore';
import { InntektsforholdReferanse, lagArbeidsgiverReferanse } from '@state/inntektsforhold/inntektsforhold';
import { useAktivOppgaveForPeriode } from '@state/oppgave';
import { useTotrinnsvurderingForPeriode } from '@state/totrinnsvurdering';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enAktivOppgave } from '@test-data/oppgave';
import { enBeregnetPeriode, enDag } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { enTotrinnsvurdering } from '@test-data/totrinnsvurdering';
import { render } from '@test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@state/oppgave', async () => ({
    ...(await vi.importActual('@state/oppgave')),
    useAktivOppgaveForPeriode: vi.fn(),
}));

vi.mock('@state/totrinnsvurdering', async () => ({
    ...(await vi.importActual('@state/totrinnsvurdering')),
    useTotrinnsvurderingForPeriode: vi.fn(),
}));

vi.mock('@hooks/brukerrolleHooks', () => ({
    useHarSkrivetilgang: () => true,
    useHarBeslutterrolle: () => true,
}));

// send-til-godkjenning og send-i-retur går foreløpig kun mot REST i dev, jf. brukRestForSendTilGodkjenning/
// brukRestForSendIRetur i hhv. SendTilGodkjenningButton og ReturButton.
vi.mock('@/env', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/env')>()),
    erDev: true,
}));

describe('Utbetaling', () => {
    beforeEach(() => {
        (useAktivOppgaveForPeriode as Mock).mockImplementation((periode?: ApiBeregnetPeriode | null) =>
            periode ? enAktivOppgave({ id: '1234', vedtaksperiodeId: periode.vedtaksperiodeId }) : null,
        );
        (useTotrinnsvurderingForPeriode as Mock).mockReturnValue(null);
    });

    it('resetter godkjentPeriode når perioden endres', async () => {
        const periodeA = enBeregnetPeriode().somErTilGodkjenning();
        const periodeB = enBeregnetPeriode().somErTilGodkjenning();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeA, periodeB]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        const inntektsforholdReferanse: InntektsforholdReferanse = lagArbeidsgiverReferanse(
            arbeidsgiver.organisasjonsnummer,
            arbeidsgiver.navn,
        );

        const store = createStore();

        const { rerender } = render(
            <PersonStoreContext.Provider value={store}>
                <Utbetaling period={periodeA} person={person} inntektsforholdReferanse={inntektsforholdReferanse} />
            </PersonStoreContext.Provider>,
        );

        await userEvent.click(screen.getByTestId('godkjenning-button'));

        await userEvent.click(screen.getByRole('button', { name: 'Ja' }));

        await waitFor(() => {
            expect(screen.getByText('Neste periode klargjøres')).toBeVisible();
        });

        rerender(
            <PersonStoreContext.Provider value={store}>
                <Utbetaling period={periodeB} person={person} inntektsforholdReferanse={inntektsforholdReferanse} />
            </PersonStoreContext.Provider>,
        );

        expect(screen.queryByText('Neste periode klargjøres')).not.toBeInTheDocument();

        rerender(
            <PersonStoreContext.Provider value={store}>
                <Utbetaling period={periodeA} person={person} inntektsforholdReferanse={inntektsforholdReferanse} />
            </PersonStoreContext.Provider>,
        );

        expect(screen.queryByText('Neste periode klargjøres')).not.toBeInTheDocument();
    });

    it('sender POST til send-til-godkjenning når saksbehandler sender oppgaven til godkjenning', async () => {
        const periode = enBeregnetPeriode().somErTilGodkjenning();
        (useTotrinnsvurderingForPeriode as Mock).mockReturnValue(enTotrinnsvurdering());
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        const inntektsforholdReferanse: InntektsforholdReferanse = lagArbeidsgiverReferanse(
            arbeidsgiver.organisasjonsnummer,
            arbeidsgiver.navn,
        );

        render(
            <PersonStoreContext.Provider value={createStore()}>
                <Utbetaling period={periode} person={person} inntektsforholdReferanse={inntektsforholdReferanse} />
            </PersonStoreContext.Provider>,
        );

        await userEvent.click(screen.getByTestId('godkjenning-button'));
        await userEvent.click(screen.getByRole('button', { name: 'Ja' }));

        await waitFor(() =>
            expect(fetchMock).toHaveBeenCalledWith(
                '/api/spesialist/oppgaver/1234/totrinnsvurdering/send-til-godkjenning',
                expect.objectContaining({
                    method: 'POST',
                }),
            ),
        );
    });

    it('sender POST til send-i-retur når beslutter returnerer oppgaven', async () => {
        const periode = enBeregnetPeriode().somErTilGodkjenning();
        (useTotrinnsvurderingForPeriode as Mock).mockReturnValue(
            enTotrinnsvurdering({ erBeslutteroppgave: true, saksbehandler: 'en-annen-saksbehandler-oid' }),
        );
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        const inntektsforholdReferanse: InntektsforholdReferanse = lagArbeidsgiverReferanse(
            arbeidsgiver.organisasjonsnummer,
            arbeidsgiver.navn,
        );

        render(
            <PersonStoreContext.Provider value={createStore()}>
                <Utbetaling period={periode} person={person} inntektsforholdReferanse={inntektsforholdReferanse} />
            </PersonStoreContext.Provider>,
        );

        await userEvent.click(screen.getByTestId('retur-button'));
        await userEvent.type(
            screen.getByLabelText('Returner sak til saksbehandler', { exact: false }),
            'Dette må vurderes på nytt',
        );
        await userEvent.click(screen.getByRole('button', { name: 'Lagre notat og returner' }));

        await waitFor(() =>
            expect(fetchMock).toHaveBeenCalledWith(
                '/api/spesialist/oppgaver/1234/totrinnsvurdering/send-i-retur',
                expect.objectContaining({
                    method: 'POST',
                    body: jsonBody({ notatTekst: 'Dette må vurderes på nytt' }),
                }),
            ),
        );
    });
    describe('dager med syk utenfor EØS', () => {
        const forklaring = 'Du må vurdere oppholdskravet for dagene med opphold utenfor EØS før du kan godkjenne.';

        it('sperrer godkjenning og forklarer hvorfor når oppholdskravet ikke er vurdert', () => {
            renderUtbetaling(enBeregnetPeriode({ tidslinje: [utenforEøs([])] }).somErTilGodkjenning());

            expect(screen.getByTestId('godkjenning-button')).toBeDisabled();
            expect(screen.getByText(forklaring)).toBeVisible();
        });

        it('sperrer sending til godkjenning når oppholdskravet ikke er vurdert', () => {
            (useTotrinnsvurderingForPeriode as Mock).mockReturnValue(enTotrinnsvurdering());
            renderUtbetaling(enBeregnetPeriode({ tidslinje: [utenforEøs([])] }).somErTilGodkjenning());

            expect(screen.getByTestId('godkjenning-button')).toBeDisabled();
            expect(screen.getByText(forklaring)).toBeVisible();
        });

        it('kan godkjennes når oppholdskravet er vurdert', () => {
            renderUtbetaling(
                enBeregnetPeriode({
                    tidslinje: [
                        utenforEøs([
                            {
                                vilkår: ApiLøpendeVilkår.OPPHOLDSKRAV,
                                vurderingId: 'en-vurdering',
                                utfall: ApiUtfallAvLøpendeVilkår.IKKE_OPPFYLT,
                            },
                        ]),
                    ],
                }).somErTilGodkjenning(),
            );

            expect(screen.getByTestId('godkjenning-button')).toBeEnabled();
            expect(screen.queryByText(forklaring)).not.toBeInTheDocument();
        });
        it('viser forklaringen når spesialist avviser vedtaket fordi oppholdskravet ikke er vurdert', async () => {
            fetchMock.mockResolvedValue(
                new Response(
                    JSON.stringify({
                        type: 'about:blank',
                        status: 400,
                        title: 'Dager med opphold utenfor EØS mangler vurdering av oppholdskravet',
                        code: 'DAGER_MANGLER_VURDERING_AV_OPPHOLDSKRAV',
                    }),
                    { status: 400, headers: { 'Content-Type': 'application/problem+json' } },
                ),
            );
            renderUtbetaling(enBeregnetPeriode().somErTilGodkjenning());

            await userEvent.click(screen.getByTestId('godkjenning-button'));
            await userEvent.click(screen.getByRole('button', { name: 'Ja' }));

            expect(await screen.findByText(forklaring)).toBeVisible();
        });
    });
});

function renderUtbetaling(periode: ApiBeregnetPeriode) {
    const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
    const person = enPerson().medArbeidsgivere([arbeidsgiver]);
    render(
        <PersonStoreContext.Provider value={createStore()}>
            <Utbetaling
                period={periode}
                person={person}
                inntektsforholdReferanse={lagArbeidsgiverReferanse(arbeidsgiver.organisasjonsnummer, arbeidsgiver.navn)}
            />
        </PersonStoreContext.Provider>,
    );
}

function utenforEøs(vurderingerAvLøpendeVilkår: ApiVurderingAvLøpendeVilkår[]) {
    return enDag({ sykdomsdagtype: ApiSykdomsdagtype.SYK_UTENFOR_EOS, vurderingerAvLøpendeVilkår });
}
