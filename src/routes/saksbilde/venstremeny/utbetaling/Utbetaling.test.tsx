import { createStore } from 'jotai';
import { describe, expect, it, vi } from 'vitest';

import { Utbetaling } from '@saksbilde/venstremeny/utbetaling/Utbetaling';
import { PersonStoreContext } from '@state/contexts/personStore';
import { InntektsforholdReferanse, lagArbeidsgiverReferanse } from '@state/inntektsforhold/inntektsforhold';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { render } from '@test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@hooks/brukerrolleHooks', () => ({
    useErSaksbehandler: () => true,
    useErBeslutter: () => true,
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
});
