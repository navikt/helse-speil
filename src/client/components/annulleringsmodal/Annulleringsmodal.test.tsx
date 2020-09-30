import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import userEvent from '@testing-library/user-event';
import { authState } from '../../state/authentication';
import { RecoilRoot } from 'recoil';
import { mapVedtaksperiode } from '../../mapping/vedtaksperiode';
import { Annulleringsmodal, sisteDatoForArbeidsgiver, totaltTilUtbetaling } from './Annulleringsmodal';
import { Kjønn, Overstyring, Vedtaksperiodetilstand } from 'internal-types';
import { umappetVedtaksperiode } from '../../../test/data/vedtaksperiode';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AnnulleringDTO } from '../../io/types';

dayjs.extend(isSameOrAfter);

let cachedAnnullering: AnnulleringDTO;

jest.mock('../../io/http', () => ({
    postAnnullering: (annullering: AnnulleringDTO) => {
        cachedAnnullering = annullering;
        return Promise.resolve();
    },
}));

global.fetch = jest.fn();

const enSpeilVedtaksperiode = (fom: Dayjs = dayjs('2020-01-01'), tom: Dayjs = dayjs('2020-01-31')) =>
    mapVedtaksperiode({
        ...umappetVedtaksperiode({ fom, tom }),
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
            <Annulleringsmodal
                person={await personTilBehandling()}
                vedtaksperiode={await enSpeilVedtaksperiode()}
                onClose={() => null}
            />
        </RecoilRoot>
    );

const annullér = () => Promise.resolve(userEvent.click(screen.getByText('Annullér')));

const fyllUtIdent = () => userEvent.type(screen.getByPlaceholderText('NAV brukerident'), 'S123456');

const assertManglerMatchendeIdent = () =>
    waitFor(() => expect(screen.getByText('Fyll inn din NAV brukerident')).toBeVisible());

const assertIngenFeilmeldinger = () =>
    waitFor(() => {
        expect(screen.queryByText('Du må velge minst én utbetaling som skal annulleres.')).toBeNull();
        expect(screen.queryByText('Fyll inn din NAV brukerident')).toBeNull();
    });

const captureAnnullering = () => cachedAnnullering;

describe('Annulleringsmodal', () => {
    test('viser feilmelding om ident ikke fylles ut', async () => {
        await renderAnnulleringsmodal();
        annullér().then(assertManglerMatchendeIdent);
    });
    test('viser ikke feilmelding om matchende ident fylles ut', async () => {
        await renderAnnulleringsmodal();
        annullér().then(assertManglerMatchendeIdent).then(fyllUtIdent).then(annullér).then(assertIngenFeilmeldinger);
    });
    test('Bygger AnnulleringDTO ved post av annullering', async () => {
        await renderAnnulleringsmodal();
        const annullering = await fyllUtIdent().then(annullér).then(captureAnnullering);
        expect(annullering.aktørId).toEqual('12345');
        expect(annullering.fødselsnummer).toEqual('12345678901');
        expect(annullering.organisasjonsnummer).toEqual('123456789');
        expect(annullering.dager).toEqual([
            '2020-01-01',
            '2020-01-02',
            '2020-01-03',
            '2020-01-04',
            '2020-01-05',
            '2020-01-06',
            '2020-01-07',
            '2020-01-08',
            '2020-01-09',
            '2020-01-10',
            '2020-01-11',
            '2020-01-12',
            '2020-01-13',
            '2020-01-14',
            '2020-01-15',
            '2020-01-16',
            '2020-01-17',
            '2020-01-18',
            '2020-01-19',
            '2020-01-20',
            '2020-01-21',
            '2020-01-22',
            '2020-01-23',
            '2020-01-24',
            '2020-01-25',
            '2020-01-26',
            '2020-01-27',
            '2020-01-28',
            '2020-01-29',
            '2020-01-30',
            '2020-01-31',
        ]);
    });
});

describe('totaltTilUtbetaling', () => {
    test('regner ut totalbeløp for sammenhengende perioder', async () => {
        const vedtaksperioder = [
            await enSpeilVedtaksperiode(dayjs('2020-01-01'), dayjs('2020-01-15')),
            await enSpeilVedtaksperiode(dayjs('2020-01-16'), dayjs('2020-01-31')),
        ];
        expect(totaltTilUtbetaling(vedtaksperioder)).toEqual(34500);
    });
    test('regner ut totalbeløp for perioder med gap', async () => {
        const vedtaksperioder = [
            await enSpeilVedtaksperiode(dayjs('2020-01-01'), dayjs('2020-01-15')),
            await enSpeilVedtaksperiode(dayjs('2020-02-01'), dayjs('2020-02-15')),
        ];
        expect(totaltTilUtbetaling(vedtaksperioder)).toEqual(31500);
    });
    test('regner ut totalbeløp for perioder uten utbetalinger', async () => {
        const vedtaksperioder = [
            {
                id: 'en-uferdig-vedtaksperiode',
                fom: dayjs('2020-01-16'),
                tom: dayjs('2020-01-31'),
                kanVelges: false,
                tilstand: Vedtaksperiodetilstand.IngenUtbetaling,
            },
            await enSpeilVedtaksperiode(dayjs('2020-01-01'), dayjs('2020-01-15')),
        ];
        expect(totaltTilUtbetaling(vedtaksperioder)).toEqual(16500);
    });
});

const arbeidsgiverUtenVedtaksperioder = {
    id: '123',
    navn: 'En bedrift',
    organisasjonsnummer: '123456789',
    overstyringer: new Map<string, Overstyring>(),
};

describe('sisteDatoForArbeidsgiver', () => {
    test('finner siste t.o.m. for sammenhengende perioder', async () => {
        const arbeidsgiver = {
            ...arbeidsgiverUtenVedtaksperioder,
            vedtaksperioder: [
                await enSpeilVedtaksperiode(dayjs('2020-01-01'), dayjs('2020-01-15')),
                await enSpeilVedtaksperiode(dayjs('2020-01-16'), dayjs('2020-01-31')),
            ],
        };
        expect(sisteDatoForArbeidsgiver(arbeidsgiver)).toEqual('31.01.2020');
    });
    test('finner siste t.o.m. for perioder med gap', async () => {
        const arbeidsgiver = {
            ...arbeidsgiverUtenVedtaksperioder,
            vedtaksperioder: [
                await enSpeilVedtaksperiode(dayjs('2020-01-01'), dayjs('2020-01-15')),
                await enSpeilVedtaksperiode(dayjs('2020-02-01'), dayjs('2020-02-15')),
            ],
        };
        expect(sisteDatoForArbeidsgiver(arbeidsgiver)).toEqual('15.02.2020');
    });
});
