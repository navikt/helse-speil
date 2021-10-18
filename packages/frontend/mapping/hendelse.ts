import { somDato, somKanskjeTidspunkt, somTidspunkt } from './vedtaksperiode';

const mapInntektsmelding = (hendelse: ExternalHendelse): Inntektsmelding => ({
    id: hendelse.id,
    type: 'Inntektsmelding',
    beregnetInntekt: (hendelse as ExternalInntektsmelding).beregnetInntekt,
    mottattTidspunkt: somTidspunkt((hendelse as ExternalInntektsmelding).mottattDato),
});

const mapSøknad = (hendelse: ExternalHendelse): Søknad => ({
    id: (hendelse as ExternalSøknadNav).id,
    type: 'Søknad',
    fom: somDato((hendelse as ExternalSøknadNav).fom),
    tom: somDato((hendelse as ExternalSøknadNav).tom),
    sendtNav: somDato((hendelse as ExternalSøknadNav as ExternalSøknadNav).sendtNav),
    rapportertDato: somKanskjeTidspunkt((hendelse as ExternalSøknadNav).rapportertdato),
});

const mapSykmelding = (hendelse: ExternalHendelse): Sykmelding => ({
    id: (hendelse as ExternalSykmelding).id,
    type: 'Sykmelding',
    fom: somDato((hendelse as ExternalSykmelding).fom),
    tom: somDato((hendelse as ExternalSykmelding).tom),
    rapportertDato: somKanskjeTidspunkt((hendelse as ExternalSykmelding).rapportertdato),
});

export const mapHendelse = (hendelse: ExternalHendelse): Dokument => {
    switch (hendelse.type) {
        case 'INNTEKTSMELDING':
            return mapInntektsmelding(hendelse);
        case 'SENDT_SØKNAD_ARBEIDSGIVER':
        case 'SENDT_SØKNAD_NAV':
            return mapSøknad(hendelse);
        case 'NY_SØKNAD':
            return mapSykmelding(hendelse);
    }
};
