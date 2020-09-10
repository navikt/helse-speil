import React from 'react';
import dayjs from 'dayjs';
import { render, screen, waitFor } from '@testing-library/react';
import { AnnulleringModal } from './AnnulleringModal';
import { enVedtaksperiode } from '../../context/mapping/testdata/enVedtaksperiode';
import { mapVedtaksperiode } from '../../context/mapping/vedtaksperiode';
import { Kjønn, Overstyring } from '../../context/types.internal';
import { RecoilRoot } from 'recoil';
import { authState } from '../../state/authentication';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

global.fetch = jest.fn();

const enSpeilVedtaksperiode = () =>
    mapVedtaksperiode({
        ...enVedtaksperiode(),
        organisasjonsnummer: '123456789',
        risikovurderingerForArbeidsgiver: [],
        overstyringer: [],
    });

const enPersoninfo = () => ({
    fornavn: 'Kari',
    mellomnavn: null,
    etternavn: 'Normann',
    kjønn: 'Mann' as Kjønn,
    fødselsdato: dayjs(),
    overstyringer: new Map<string, Overstyring>(),
});

const enArbeidsgiver = async () => ({
    id: '123',
    navn: 'En bedrift',
    organisasjonsnummer: '123456789',
    vedtaksperioder: [await enSpeilVedtaksperiode()],
    overstyringer: new Map<string, Overstyring>(),
});

const personTilBehandling = async () => ({
    aktørId: '12345',
    fødselsnummer: '12345678901',
    arbeidsgivere: [await enArbeidsgiver()],
    personinfo: enPersoninfo(),
    infotrygdutbetalinger: [],
    enhet: { id: '', navn: '' },
});

const authInfo = {
    name: 'Sara Saksbehandler',
    ident: 'S123456',
    email: 'sara.saksbehandler@nav.no',
    isLoggedIn: true,
};

const renderAnnulleringsmodal = async () =>
    render(
        <RecoilRoot initializeState={({ set }) => set(authState, authInfo)}>
            <AnnulleringModal
                person={await personTilBehandling()}
                vedtaksperiode={await enSpeilVedtaksperiode()}
                onClose={() => null}
            />
        </RecoilRoot>
    );

const annullér = () => Promise.resolve(userEvent.click(screen.getByText('Annullér')));

const velgUtbetaling = () =>
    Promise.resolve(userEvent.click(screen.getByLabelText('Annullér utbetaling til arbeidsgiver')));

const fyllUtIdent = () => userEvent.type(screen.getByPlaceholderText('NAV brukerident'), 'S123456');

const assertManglerValgtUtbetaling = () =>
    waitFor(() => expect(screen.getByText('Du må velge minst én utbetaling som skal annulleres.')).toBeVisible());

const assertManglerMatchendeIdent = () =>
    waitFor(() => expect(screen.getByText('Fyll inn din NAV brukerident')).toBeVisible());

const assertIngenFeilmeldinger = () =>
    waitFor(() => {
        expect(screen.queryByText('Du må velge minst én utbetaling som skal annulleres.')).toBeNull();
        expect(screen.queryByText('Fyll inn din NAV brukerident')).toBeNull();
    });

describe('AnnulleringModal', () => {
    test('viser feilmelding om ingen påkrevde felter fylles ut', async () => {
        await renderAnnulleringsmodal();
        await annullér().then(assertManglerValgtUtbetaling).then(assertManglerMatchendeIdent);
    });
    test('viser feilmelding om ident ikke fylles ut', async () => {
        await renderAnnulleringsmodal();
        velgUtbetaling().then(annullér).then(assertManglerMatchendeIdent);
    });
    test('viser feilmelding om ikke minst én utbetaling velges', async () => {
        await renderAnnulleringsmodal();
        fyllUtIdent().then(annullér).then(assertManglerValgtUtbetaling);
    });
    test('viser ikke feilmelding om matchende ident fylles ut og minst én utbetaling velges', async () => {
        await renderAnnulleringsmodal();
        annullér()
            .then(assertManglerValgtUtbetaling)
            .then(assertManglerMatchendeIdent)
            .then(velgUtbetaling)
            .then(fyllUtIdent)
            .then(annullér)
            .then(assertIngenFeilmeldinger);
    });
});
