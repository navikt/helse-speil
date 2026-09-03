import { defaultAxiosResponse } from '../../../../../vitest.setup';
import { createStore } from 'jotai';
import { Mock, describe, expect, it, vi } from 'vitest';

import { customAxios } from '@app/axios/axiosClient';
import { Utbetaling } from '@saksbilde/venstremeny/utbetaling/Utbetaling';
import { PersonStoreContext } from '@state/contexts/personStore';
import { InntektsforholdReferanse, lagArbeidsgiverReferanse } from '@state/inntektsforhold/inntektsforhold';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enOppgave } from '@test-data/oppgave';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { render } from '@test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
    it('resetter godkjentPeriode når perioden endres', async () => {
        const periodeA = enBeregnetPeriode().medOppgave().somErTilGodkjenning();
        const periodeB = enBeregnetPeriode().medOppgave().somErTilGodkjenning();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeA, periodeB]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        const inntektsforholdReferanse: InntektsforholdReferanse = lagArbeidsgiverReferanse(
            arbeidsgiver.organisasjonsnummer,
            arbeidsgiver.navn,
        );

        const store = createStore();

        (customAxios as unknown as Mock).mockResolvedValue(defaultAxiosResponse);

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
        const periode = enBeregnetPeriode()
            .medOppgave(enOppgave({ id: '1234' }))
            .somErTilGodkjenning();
        periode.totrinnsvurdering = {
            __typename: 'Totrinnsvurdering',
            beslutter: null,
            erBeslutteroppgave: false,
            erRetur: false,
            saksbehandler: null,
        };
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        const inntektsforholdReferanse: InntektsforholdReferanse = lagArbeidsgiverReferanse(
            arbeidsgiver.organisasjonsnummer,
            arbeidsgiver.navn,
        );

        (customAxios as unknown as Mock).mockResolvedValue(defaultAxiosResponse);

        render(
            <PersonStoreContext.Provider value={createStore()}>
                <Utbetaling period={periode} person={person} inntektsforholdReferanse={inntektsforholdReferanse} />
            </PersonStoreContext.Provider>,
        );

        await userEvent.click(screen.getByTestId('godkjenning-button'));
        await userEvent.click(screen.getByRole('button', { name: 'Ja' }));

        await waitFor(() =>
            expect(customAxios).toHaveBeenCalledWith(
                expect.objectContaining({
                    method: 'POST',
                    url: '/api/spesialist/oppgaver/1234/totrinnsvurdering/send-til-godkjenning',
                }),
            ),
        );
    });

    it('sender POST til send-i-retur når beslutter returnerer oppgaven', async () => {
        const periode = enBeregnetPeriode()
            .medOppgave(enOppgave({ id: '1234' }))
            .somErTilGodkjenning();
        periode.totrinnsvurdering = {
            __typename: 'Totrinnsvurdering',
            beslutter: null,
            erBeslutteroppgave: true,
            erRetur: false,
            saksbehandler: 'en-annen-saksbehandler-oid',
        };
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        const inntektsforholdReferanse: InntektsforholdReferanse = lagArbeidsgiverReferanse(
            arbeidsgiver.organisasjonsnummer,
            arbeidsgiver.navn,
        );

        (customAxios as unknown as Mock).mockResolvedValue(defaultAxiosResponse);

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
            expect(customAxios).toHaveBeenCalledWith(
                expect.objectContaining({
                    method: 'POST',
                    url: '/api/spesialist/oppgaver/1234/totrinnsvurdering/send-i-retur',
                    data: { notatTekst: 'Dette må vurderes på nytt' },
                }),
            ),
        );
    });
});
