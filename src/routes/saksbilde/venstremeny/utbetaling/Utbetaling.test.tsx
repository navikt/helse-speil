import { fetchMock, jsonBody } from '../../../../../vitest.setup';
import { createStore } from 'jotai';
import { Mock, describe, expect, it, vi } from 'vitest';

import {
    ApiKildetype,
    ApiKravkode,
    ApiMedlemskapsstatus,
    ApiVilkårsvurderingerForPersonResponse,
    ApiVurderingskilde,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { ApiBeregnetPeriode } from '@io/rest/generated/spesialist.schemas';
import { Utbetaling } from '@saksbilde/venstremeny/utbetaling/Utbetaling';
import { PersonStoreContext } from '@state/contexts/personStore';
import { InntektsforholdReferanse, lagArbeidsgiverReferanse } from '@state/inntektsforhold/inntektsforhold';
import { useAktivOppgaveForPeriode } from '@state/oppgave';
import { useTotrinnsvurderingForPeriode } from '@state/totrinnsvurdering';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enAktivOppgave } from '@test-data/oppgave';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { enTotrinnsvurdering } from '@test-data/totrinnsvurdering';
import { etVilkårsgrunnlagFraSpleis } from '@test-data/vilkårsgrunnlag';
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

const medlemskapQuery = vi.hoisted(() => ({
    data: undefined as ApiVilkårsvurderingerForPersonResponse | undefined,
}));

vi.mock('@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger')>()),
    useGetVilkårsvurderingerForPersonBehandler: () => ({ data: medlemskapQuery.data }),
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
        medlemskapQuery.data = undefined;
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

    describe('individuell begrunnelse ved medlemskap vurdert til nei av saksbehandler', () => {
        it('sperrer «Send til godkjenning» til begrunnelsen er skrevet', async () => {
            medlemskapQuery.data = medlemskapssvar(ApiMedlemskapsstatus.NEI, saksbehandlerKilde);
            (useTotrinnsvurderingForPeriode as Mock).mockReturnValue(enTotrinnsvurdering());
            const { person, periode, inntektsforholdReferanse } = enPersonMedVilkårsgrunnlag();

            render(
                <PersonStoreContext.Provider value={createStore()}>
                    <Utbetaling period={periode} person={person} inntektsforholdReferanse={inntektsforholdReferanse} />
                </PersonStoreContext.Provider>,
            );

            expect(screen.getByTestId('godkjenning-button')).toBeDisabled();
            expect(screen.getByText(FEILMELDING)).toBeVisible();

            await userEvent.type(screen.getByRole('textbox'), 'Du er ikke medlem i folketrygden');

            expect(screen.getByTestId('godkjenning-button')).toBeEnabled();
            expect(screen.queryByText(FEILMELDING)).not.toBeInTheDocument();
        });

        it('sperrer «Fatt vedtak» når perioden ikke skal til totrinnsvurdering', () => {
            medlemskapQuery.data = medlemskapssvar(ApiMedlemskapsstatus.NEI, saksbehandlerKilde);
            const { person, periode, inntektsforholdReferanse } = enPersonMedVilkårsgrunnlag();

            render(
                <PersonStoreContext.Provider value={createStore()}>
                    <Utbetaling period={periode} person={person} inntektsforholdReferanse={inntektsforholdReferanse} />
                </PersonStoreContext.Provider>,
            );

            expect(screen.getByTestId('godkjenning-button')).toBeDisabled();
        });

        it('krever ikke begrunnelse når medlemskap er vurdert til nei automatisk', () => {
            medlemskapQuery.data = medlemskapssvar(ApiMedlemskapsstatus.NEI, automatiskKilde);
            (useTotrinnsvurderingForPeriode as Mock).mockReturnValue(enTotrinnsvurdering());
            const { person, periode, inntektsforholdReferanse } = enPersonMedVilkårsgrunnlag();

            render(
                <PersonStoreContext.Provider value={createStore()}>
                    <Utbetaling period={periode} person={person} inntektsforholdReferanse={inntektsforholdReferanse} />
                </PersonStoreContext.Provider>,
            );

            expect(screen.getByTestId('godkjenning-button')).toBeEnabled();
            expect(screen.queryByText(FEILMELDING)).not.toBeInTheDocument();
        });

        it('krever ikke begrunnelse når saksbehandler har vurdert medlemskap til ja', () => {
            medlemskapQuery.data = medlemskapssvar(ApiMedlemskapsstatus.JA, saksbehandlerKilde);
            (useTotrinnsvurderingForPeriode as Mock).mockReturnValue(enTotrinnsvurdering());
            const { person, periode, inntektsforholdReferanse } = enPersonMedVilkårsgrunnlag();

            render(
                <PersonStoreContext.Provider value={createStore()}>
                    <Utbetaling period={periode} person={person} inntektsforholdReferanse={inntektsforholdReferanse} />
                </PersonStoreContext.Provider>,
            );

            expect(screen.getByTestId('godkjenning-button')).toBeEnabled();
        });
    });
});

const FEILMELDING = 'Du må skrive en individuell begrunnelse fordi medlemskap er vurdert til nei.';

const saksbehandlerKilde: ApiVurderingskilde = {
    kildetype: ApiKildetype.SAKSBEHANDLER,
    ident: 'S123456',
    fritekstbegrunnelse: 'Bor ikke i Norge',
    journalpostId: [],
};

const automatiskKilde: ApiVurderingskilde = {
    kildetype: ApiKildetype.AUTOMATISK,
    versjonAvKildekode: '1',
    oppslagsperiode: { fom: '2020-01-01', tom: '2020-01-01' },
    årsaker: [],
};

function medlemskapssvar(
    status: ApiMedlemskapsstatus,
    kilde: ApiVurderingskilde,
): ApiVilkårsvurderingerForPersonResponse {
    return {
        skjæringstidspunkt: '2020-01-01',
        krav: [
            {
                id: 'en-medlemskapsvurdering-id',
                kravkode: ApiKravkode.MEDLEMSKAP,
                medlemskapOk: status === ApiMedlemskapsstatus.JA,
                status,
                vurdertTidspunkt: '2020-01-02T10:00:00.000Z',
                kilde,
            },
        ],
    };
}

function enPersonMedVilkårsgrunnlag() {
    const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis();
    const periode = enBeregnetPeriode({ vilkarsgrunnlagId: vilkårsgrunnlag.id }).somErTilGodkjenning();
    const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
    const person = enPerson({ vilkarsgrunnlagV2: [vilkårsgrunnlag] }).medArbeidsgivere([arbeidsgiver]);
    const inntektsforholdReferanse = lagArbeidsgiverReferanse(arbeidsgiver.organisasjonsnummer, arbeidsgiver.navn);
    return { person, periode, inntektsforholdReferanse };
}
