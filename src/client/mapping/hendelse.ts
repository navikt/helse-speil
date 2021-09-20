import {
    SpleisHendelse,
    SpleisHendelsetype,
    SpleisInntektsmelding,
    SpleisSykmelding,
    SpleisSøknad,
} from 'external-types';

import { somDato, somKanskjeTidspunkt, somTidspunkt } from './vedtaksperiode';

const mapInntektsmelding = (hendelse: SpleisHendelse): Inntektsmelding => ({
    id: hendelse.id,
    type: 'Inntektsmelding',
    beregnetInntekt: (hendelse as SpleisInntektsmelding).beregnetInntekt,
    mottattTidspunkt: somTidspunkt((hendelse as SpleisInntektsmelding).mottattDato),
});

const mapSøknad = (hendelse: SpleisHendelse): Søknad => ({
    id: (hendelse as SpleisSøknad).id,
    type: 'Søknad',
    fom: somDato((hendelse as SpleisSøknad).fom),
    tom: somDato((hendelse as SpleisSøknad).tom),
    sendtNav: somDato((hendelse as SpleisSøknad as SpleisSøknad).sendtNav),
    rapportertDato: somKanskjeTidspunkt((hendelse as SpleisSøknad).rapportertdato),
});

const mapSykmelding = (hendelse: SpleisHendelse): Sykmelding => ({
    id: (hendelse as SpleisSykmelding).id,
    type: 'Sykmelding',
    fom: somDato((hendelse as SpleisSykmelding).fom),
    tom: somDato((hendelse as SpleisSykmelding).tom),
    rapportertDato: somKanskjeTidspunkt((hendelse as SpleisSykmelding).rapportertdato),
});

export const mapHendelse = (hendelse: SpleisHendelse): Dokument => {
    switch (hendelse.type) {
        case SpleisHendelsetype.INNTEKTSMELDING:
            return mapInntektsmelding(hendelse);
        case SpleisHendelsetype.SØKNAD_ARBEIDSGIVER:
        case SpleisHendelsetype.SØKNAD_NAV:
            return mapSøknad(hendelse);
        case SpleisHendelsetype.SYKMELDING:
            return mapSykmelding(hendelse);
    }
};
