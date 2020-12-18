import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import userEvent from '@testing-library/user-event';
import { authState } from '../../../state/authentication';
import { RecoilRoot } from 'recoil';
import { VedtaksperiodeBuilder } from '../../../mapping/vedtaksperiode';
import { Annulleringsmodal } from './Annulleringsmodal';
import { Kjønn, Overstyring, Vedtaksperiode } from 'internal-types';
import { umappetVedtaksperiode } from '../../../../test/data/vedtaksperiode';
import { render, screen, waitFor } from '@testing-library/react';
import { AnnulleringDTO } from '../../../io/types';
import '@testing-library/jest-dom/extend-expect';
import { SpesialistArbeidsgiver } from 'external-types';

dayjs.extend(isSameOrAfter);

declare global {
    namespace NodeJS {
        interface Global {
            fetch: jest.MockedFunction<any>;
        }
    }
}

afterEach(() => {
    global.fetch = undefined;
});

let cachedAnnullering: AnnulleringDTO;

jest.mock('../../../io/http', () => ({
    postAnnullering: (annullering: AnnulleringDTO) => {
        cachedAnnullering = annullering;
        return Promise.resolve();
    },
}));

global.fetch = jest.fn();

const enSpeilVedtaksperiode = async (fom: Dayjs = dayjs('2020-01-01'), tom: Dayjs = dayjs('2020-01-31')) => {
    const { vedtaksperiode } = new VedtaksperiodeBuilder()
        .setVedtaksperiode(umappetVedtaksperiode({ fom, tom }))
        .setArbeidsgiver({ organisasjonsnummer: '123456789' } as SpesialistArbeidsgiver)
        .setOverstyringer([])
        .build();
    return vedtaksperiode as Vedtaksperiode;
};

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
    utbetalinger: [],
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
            <Annulleringsmodal
                person={await personTilBehandling()}
                vedtaksperiode={await enSpeilVedtaksperiode()}
                onClose={() => null}
            />
        </RecoilRoot>
    );

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
        expect(annullering.aktørId).toEqual('12345');
        expect(annullering.fødselsnummer).toEqual('12345678901');
        expect(annullering.organisasjonsnummer).toEqual('123456789');
        expect(annullering.fagsystemId).toEqual('en-fagsystem-id');
    });
});
