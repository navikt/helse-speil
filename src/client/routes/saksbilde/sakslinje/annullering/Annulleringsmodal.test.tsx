import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import React from 'react';
import { RecoilRoot } from 'recoil';

import { AnnulleringDTO } from '../../../../io/types';
import { authState } from '../../../../state/authentication';
import { personState } from '../../../../state/person';

import { mappetPerson } from '../../../../../test/data/person';
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
    return render(
        <RecoilRoot
            initializeState={({ set }) => {
                set(personState, { person: person });
                set(authState, authInfo);
            }}
        >
            <Annulleringsmodal
                person={person}
                aktivPeriode={person.arbeidsgivere[0].tidslinjeperioder[0][0]}
                onClose={() => null}
            />
        </RecoilRoot>
    );
};

const annullér = () => Promise.resolve(userEvent.click(screen.getByText('Annullér')));

const fyllUtIdent = () => Promise.resolve(userEvent.type(screen.getByPlaceholderText('NAV brukerident'), 'S123456'));

const fyllUtFeilIdent = () => userEvent.type(screen.getByPlaceholderText('NAV brukerident'), 'S133769');

const velgUtbetaling = () => userEvent.click(screen.getByText('Annullér utbetaling til arbeidsgiver'));

const assertManglerMatchendeIdent = () =>
    waitFor(() => expect(screen.queryByText('Fyll inn din NAV brukerident')).toBeVisible());

const assertManglerAvhuking = () =>
    waitFor(() => expect(screen.queryByText('Du må velge minst én utbetaling som skal annulleres')).toBeVisible());

const assertHarMatchendeIdent = () =>
    waitFor(() => expect(screen.queryByText('Fyll inn din NAV brukerident')).toBeNull());

const assertHarAvhuking = () =>
    waitFor(() => expect(screen.queryByText('Du må velge minst én utbetaling som skal annulleres')).toBeNull());

const captureAnnullering = () => cachedAnnullering;

describe('Annulleringsmodal', () => {
    test('viser feilmelding om ident ikke fylles ut', async () => {
        await renderAnnulleringsmodal();
        await annullér().then(assertManglerMatchendeIdent);
    });
    test('viser feilmelding om ident fylles ut feil', async () => {
        await renderAnnulleringsmodal();
        await annullér().then(fyllUtFeilIdent).then(assertManglerMatchendeIdent);
    });
    test('viser ikke feilmelding om matchende ident fylles ut', async () => {
        await renderAnnulleringsmodal();
        await annullér()
            .then(assertManglerMatchendeIdent)
            .then(fyllUtIdent)
            .then(annullér)
            .then(assertHarMatchendeIdent);
    });
    test('viser feilmelding om ingen utbetalinger er valgt for annullering', async () => {
        await renderAnnulleringsmodal();
        await annullér().then(assertManglerAvhuking);
    });
    test('viser ikke feilmelding om en utbetaling er valgt for annullering', async () => {
        await renderAnnulleringsmodal();
        await annullér().then(assertManglerAvhuking).then(velgUtbetaling).then(annullér).then(assertHarAvhuking);
    });
    test('bygger AnnulleringDTO ved post av annullering', async () => {
        await renderAnnulleringsmodal();
        const annullering = await fyllUtIdent().then(velgUtbetaling).then(annullér).then(captureAnnullering);
        expect(annullering.aktørId).toEqual('1211109876233');
        expect(annullering.fødselsnummer).toEqual('01019000123');
        expect(annullering.organisasjonsnummer).toEqual('987654321');
        expect(annullering.fagsystemId).toEqual('EN_FAGSYSTEMID');
    });
});
