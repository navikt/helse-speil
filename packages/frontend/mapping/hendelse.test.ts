import { mapHendelse } from './hendelse';
import { somDato, somTidspunkt } from './vedtaksperiode';

describe('mapHendelse', () => {
    test('mapper inntektsmelding', () => {
        const inntektsmelding: ExternalInntektsmelding = {
            id: 'en-inntektsmelding',
            type: 'INNTEKTSMELDING',
            mottattDato: '2020-01-01T00:00:00',
            beregnetInntekt: 600000,
        };
        const mappetInntektsmelding: Inntektsmelding = {
            id: 'en-inntektsmelding',
            type: 'Inntektsmelding',
            mottattTidspunkt: somTidspunkt('2020-01-01T00:00:00'),
            beregnetInntekt: 600000,
        };
        expect(mapHendelse(inntektsmelding)).toEqual(mappetInntektsmelding);
    });
    test('mapper sykmelding', () => {
        const sykmelding: ExternalSykmelding = {
            id: 'en-sykmelding',
            type: 'NY_SØKNAD',
            fom: '2020-01-01',
            tom: '2020-01-31',
            rapportertdato: '2020-02-01T00:00:00',
        };
        const mappetSykmelding: Sykmelding = {
            id: 'en-sykmelding',
            type: 'Sykmelding',
            fom: somDato('2020-01-01'),
            tom: somDato('2020-01-31'),
            rapportertDato: somTidspunkt('2020-02-01T00:00:00'),
        };
        expect(mapHendelse(sykmelding)).toEqual(mappetSykmelding);
    });
    test('mapper søknad', () => {
        const søknad: ExternalSøknadNav = {
            id: 'en-søknad',
            type: 'SENDT_SØKNAD_NAV',
            fom: '2020-01-01',
            tom: '2020-01-31',
            rapportertdato: '2020-02-01T00:00:00',
            sendtNav: '2020-02-01T00:00:00',
        };
        const mappetSøknad: Søknad = {
            id: 'en-søknad',
            type: 'Søknad',
            fom: somDato('2020-01-01'),
            tom: somDato('2020-01-31'),
            rapportertDato: somTidspunkt('2020-02-01T00:00:00'),
            sendtNav: somTidspunkt('2020-02-01T00:00:00'),
        };
        expect(mapHendelse(søknad)).toEqual(mappetSøknad);
    });
});
