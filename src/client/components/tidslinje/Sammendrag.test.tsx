import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { mapVedtaksperiode } from '../../mapping/vedtaksperiode';
import { umappetVedtaksperiode } from '../../../test/data/vedtaksperiode';
import { Kjønn, Overstyring, Vedtaksperiodetilstand } from 'internal-types';
import { feriedager, Sammendrag, sykepengedager, utbetalt } from './Sammendrag';

const enSpeilVedtaksperiode = (fom: Dayjs = dayjs('2020-01-01'), tom: Dayjs = dayjs('2020-01-31')) =>
    mapVedtaksperiode({
        ...umappetVedtaksperiode({ fom, tom }),
        organisasjonsnummer: '123456789',
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

const enPerson = async () => ({
    aktørId: '12345',
    fødselsnummer: '12345678901',
    arbeidsgivere: [await enArbeidsgiver()],
    personinfo: enPersoninfo(),
    infotrygdutbetalinger: [],
    enhet: { id: '', navn: '' },
});

describe('Sammendrag', () => {
    test('viser riktig antall sykepengedager', async () => {
        expect(sykepengedager(await enPerson())).toEqual(23);
    });
    test('viser riktig antall feriedager', async () => {
        expect(feriedager(await enPerson())).toEqual(0);
    });
    test('viser riktig sum av alle utbetalinger', async () => {
        const enPersonUtenUtbetalinger = await enPerson();
        expect(utbetalt(enPersonUtenUtbetalinger)).toEqual(0);
        const enPersonMedUtbetalinger = {
            ...enPersonUtenUtbetalinger,
            arbeidsgivere: enPersonUtenUtbetalinger.arbeidsgivere.map((arbeidsgiver) => ({
                ...arbeidsgiver,
                vedtaksperioder: arbeidsgiver.vedtaksperioder.map((periode) => ({
                    ...periode,
                    tilstand: Vedtaksperiodetilstand.Utbetalt,
                })),
            })),
        };
        expect(utbetalt(enPersonMedUtbetalinger)).toEqual(34500);
    });
});
