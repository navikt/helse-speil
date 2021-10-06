import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { mappetPerson } from 'test-data';

import { AnnulleringDTO } from '../../../../io/types';
import { authState } from '../../../../state/authentication';
import { personState } from '../../../../state/person';

import { Annulleringsmodal } from './Annulleringsmodal';

dayjs.extend(isSameOrAfter);

let cachedAnnullering: AnnulleringDTO;

jest.mock('../../../../io/http', () => ({
    postAnnullering: (annullering: AnnulleringDTO) => {
        cachedAnnullering = annullering;
        return Promise.resolve();
    },
}));

const authInfo = {
    name: 'Sara Saksbehandler',
    ident: 'S123456',
    email: 'sara.saksbehandler@nav.no',
    isLoggedIn: true,
};

const renderAnnulleringsmodal = async () => {
    const person = mappetPerson();
    const arbeidsgiver = person.arbeidsgivere[0];
    const aktivPeriode = arbeidsgiver.tidslinjeperioder[0][0];
    const vedtaksperiode = arbeidsgiver.vedtaksperioder.find(
        (vedtaksperiode) => vedtaksperiode.id === aktivPeriode.id
    ) as Vedtaksperiode;
    const arbeidsgiverUtbetaling = vedtaksperiode.utbetalinger?.arbeidsgiverUtbetaling;

    return render(
        <RecoilRoot
            initializeState={({ set }) => {
                set(personState, { person: { ...person, vilkårsgrunnlagHistorikk: {} } });
                set(authState, authInfo);
            }}
        >
            {arbeidsgiverUtbetaling && (
                <Annulleringsmodal
                    person={person}
                    organisasjonsnummer={aktivPeriode.organisasjonsnummer}
                    fagsystemId={aktivPeriode.fagsystemId!}
                    linjer={arbeidsgiverUtbetaling?.linjer}
                    onClose={() => null}
                />
            )}
        </RecoilRoot>
    );
};

describe('Annulleringsmodal', () => {
    test('viser feilmelding ved manglende begrunnelse', async () => {
        await renderAnnulleringsmodal();
        userEvent.click(screen.getByText('Annuller'));
        await waitFor(() => {
            expect(screen.queryByText('Velg minst én begrunnelse')).not.toBeNull();
        });
    });
    test('viser feilmelding ved manglende kommentar', async () => {
        await renderAnnulleringsmodal();
        userEvent.click(screen.getByText('Annet'));
        userEvent.click(screen.getByText('Annuller'));
        await waitFor(() => {
            expect(screen.queryByText('Skriv en kommentar hvis du velger begrunnelsen "annet"')).not.toBeNull();
        });
    });
    test('viser feilmelding ved manglende skjæringstidspunkt-valg', async () => {
        await renderAnnulleringsmodal();
        userEvent.click(screen.getByText('Annet'));
        userEvent.click(screen.getByText('Annuller'));
        await waitFor(() => {
            expect(
                screen.queryByText(
                    'Velg om endringen gjelder siste skjæringstidspunkt eller et tidligere skjæringstidspunkt'
                )
            ).not.toBeNull();
        });
    });
    test('bygger AnnulleringDTO ved post av annullering', async () => {
        await renderAnnulleringsmodal();
        userEvent.click(screen.getByText('Ferie'));
        userEvent.click(screen.getByText('Ja, det siste skjæringstidspunktet'));
        userEvent.click(screen.getByText('Annuller'));
        await waitFor(() => {
            expect(cachedAnnullering?.aktørId).toEqual('1211109876233');
            expect(cachedAnnullering?.fødselsnummer).toEqual('01019000123');
            expect(cachedAnnullering?.organisasjonsnummer).toEqual('987654321');
            expect(cachedAnnullering?.fagsystemId).toEqual('EN_FAGSYSTEMID');
            expect(cachedAnnullering?.begrunnelser?.length).toEqual(1);
            expect(cachedAnnullering?.gjelderSisteSkjæringstidspunkt).toEqual(true);
        });
    });
});
