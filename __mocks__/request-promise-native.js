'use strict';

const rpn = jest.genMockFromModule('request-promise-native');

const testPerson = {
    fdato: '1995-01-01',
    statsborgerskap: 'NOR',
    etternavn: 'BETJENT',
    aktørId: '1000012345678',
    bostedsland: 'NOR',
    fornavn: 'BJARNE',
    kjønn: 'MANN',
    status: 'BOSA'
};

rpn.get = options => {
    if (options.uri.includes('/sts/')) {
        if (options.headers.Authorization.includes('Ym9ndXM6Y3JlZHM=')) {
            return Promise.reject('wrong creds');
        } else {
            return Promise.resolve({
                access_token: createToken({ exp: 12345 })
            });
        }
    } else if (options.uri.includes('/api/v1/identer')) {
        return handleAktørregisteretRequest();
    } else {
        if (options.uri.includes('11111')) {
            return Promise.resolve(testPerson);
        } else {
            return Promise.reject('request failed');
        }
    }
};

rpn.post = options => {
    return Promise.resolve(spennReply);
};

const handleAktørregisteretRequest = () => {
    return Promise.resolve(aktørregisteretResponse);
};

let aktørregisteretResponse;
rpn.prepareAktørregisteretResponse = response => {
    aktørregisteretResponse = response;
};

const createToken = claims => {
    const header = { alg: 'HS256', typ: 'JWT' };
    return `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(claims))}.bogussignature`;
};

const spennReply = {
    status: 'OK',
    feilMelding: '',
    simulering: {
        gjelderId: '1234567',
        gjelderNavn: 'Navn Navnesen',
        datoBeregnet: {
            year: 2019,
            month: 'SEPTEMBER',
            monthValue: 9,
            dayOfMonth: 27,
            dayOfWeek: 'FRIDAY',
            leapYear: false,
            dayOfYear: 270,
            era: 'CE',
            chronology: {
                id: 'ISO',
                calendarType: 'iso8601'
            }
        },
        totalBelop: 12345.29,
        periodeList: [
            {
                fom: {
                    year: 2019,
                    month: 'SEPTEMBER',
                    monthValue: 9,
                    dayOfMonth: 27,
                    dayOfWeek: 'FRIDAY',
                    leapYear: false,
                    dayOfYear: 270,
                    era: 'CE',
                    chronology: {
                        id: 'ISO',
                        calendarType: 'iso8601'
                    }
                },
                tom: {
                    year: 2019,
                    month: 'SEPTEMBER',
                    monthValue: 9,
                    dayOfMonth: 27,
                    dayOfWeek: 'FRIDAY',
                    leapYear: false,
                    dayOfYear: 270,
                    era: 'CE',
                    chronology: {
                        id: 'ISO',
                        calendarType: 'iso8601'
                    }
                },
                utbetaling: [
                    {
                        fagSystemId: 'SelveFagsystemet',
                        utbetalesTilId: '',
                        utbetalesTilNavn: 'Bjarne Betjent',
                        forfall: {
                            year: 2019,
                            month: 'SEPTEMBER',
                            monthValue: 9,
                            dayOfMonth: 27,
                            dayOfWeek: 'FRIDAY',
                            leapYear: false,
                            dayOfYear: 270,
                            era: 'CE',
                            chronology: {
                                id: 'ISO',
                                calendarType: 'iso8601'
                            }
                        },
                        feilkonto: false,
                        detaljer: [
                            {
                                faktiskFom: {
                                    year: 2019,
                                    month: 'SEPTEMBER',
                                    monthValue: 9,
                                    dayOfMonth: 27,
                                    dayOfWeek: 'FRIDAY',
                                    leapYear: false,
                                    dayOfYear: 270,
                                    era: 'CE',
                                    chronology: {
                                        id: 'ISO',
                                        calendarType: 'iso8601'
                                    }
                                },
                                faktiskTom: {
                                    year: 2019,
                                    month: 'SEPTEMBER',
                                    monthValue: 9,
                                    dayOfMonth: 27,
                                    dayOfWeek: 'FRIDAY',
                                    leapYear: false,
                                    dayOfYear: 270,
                                    era: 'CE',
                                    chronology: {
                                        id: 'ISO',
                                        calendarType: 'iso8601'
                                    }
                                },
                                konto: '12345',
                                belop: 132,
                                tilbakeforing: false,
                                sats: 123,
                                typeSats: 'UKENTLIG',
                                antallSats: 123,
                                uforegrad: 12,
                                klassekode: 'aaa',
                                klassekodeBeskrivelse: 'whatever',
                                utbetalingsType: 'JUSTERING',
                                refunderesOrgNr: '123456'
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

module.exports = rpn;
