import { somDato, somKanskjeTidspunkt, somTidspunkt } from './vedtaksperiode';

const mapInntektsmelding = (hendelse: ExternalHendelse): Inntektsmelding => ({
    id: hendelse.id,
    type: 'Inntektsmelding',
    beregnetInntekt: (hendelse as ExternalInntektsmelding).beregnetInntekt,
    mottattTidspunkt: somTidspunkt((hendelse as ExternalInntektsmelding).mottattDato),
});

const mapSøknad = (hendelse: ExternalHendelse): Søknad => ({
    id: (hendelse as ExternalSøknad).id,
    type: 'Søknad',
    fom: somDato((hendelse as ExternalSøknad).fom),
    tom: somDato((hendelse as ExternalSøknad).tom),
    sendtNav: somDato((hendelse as ExternalSøknad as ExternalSøknad).sendtNav),
    rapportertDato: somKanskjeTidspunkt((hendelse as ExternalSøknad).rapportertdato),
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
