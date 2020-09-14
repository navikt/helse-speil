import {
    SpleisHendelse,
    SpleisHendelsetype,
    SpleisInntektsmelding,
    SpleisSykmelding,
    SpleisSøknad,
} from 'external-types';
import { Hendelse, Inntektsmelding, Kildetype, Sykmelding, Søknad } from 'internal-types';
import { somDato, somKanskjeDato, somTidspunkt } from './vedtaksperiode';

const mapInntektsmelding = (hendelse: SpleisHendelse): Inntektsmelding => ({
    id: hendelse.id,
    type: Kildetype.Inntektsmelding,
    beregnetInntekt: (hendelse as SpleisInntektsmelding).beregnetInntekt,
    mottattTidspunkt: somTidspunkt((hendelse as SpleisInntektsmelding).mottattDato),
});

const mapSøknad = (hendelse: SpleisHendelse): Søknad => ({
    id: (hendelse as SpleisSøknad).id,
    type: Kildetype.Søknad,
    fom: somDato((hendelse as SpleisSøknad).fom),
    tom: somDato((hendelse as SpleisSøknad).tom),
    sendtNav: somDato(((hendelse as SpleisSøknad) as SpleisSøknad).sendtNav),
    rapportertDato: somKanskjeDato((hendelse as SpleisSøknad).rapportertdato),
});

const mapSykmelding = (hendelse: SpleisHendelse): Sykmelding => ({
    id: (hendelse as SpleisSykmelding).id,
    type: Kildetype.Sykmelding,
    fom: somDato((hendelse as SpleisSykmelding).fom),
    tom: somDato((hendelse as SpleisSykmelding).tom),
    rapportertDato: somKanskjeDato((hendelse as SpleisSykmelding).rapportertdato),
});

export const mapHendelse = (hendelse: SpleisHendelse): Hendelse => {
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
