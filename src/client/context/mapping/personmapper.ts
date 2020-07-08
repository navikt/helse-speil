import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
    InfotrygdTypetekst,
    Infotrygdutbetaling,
    Kjønn,
    Person,
    Personinfo,
    UferdigVedtaksperiode,
    Vedtaksperiode,
} from '../types.internal';
import { PersoninfoFraSparkel, SpesialistPersoninfo } from '../../../types';
import { mapUferdigVedtaksperiode, mapVedtaksperiode, somDato } from './vedtaksperiodemapper';
import { SpesialistInfotrygdtypetekst, SpesialistPerson, SpesialistVedtaksperiode } from './types.external';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const reversert = (a: Vedtaksperiode, b: Vedtaksperiode) => dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();

const tilArbeidsgivere = (person: SpesialistPerson, personinfo: Personinfo) =>
    person.arbeidsgivere.map((arbeidsgiver) => {
        const tilVedtaksperiode = (periode: SpesialistVedtaksperiode): UferdigVedtaksperiode | Vedtaksperiode => {
            if (periode.fullstendig) {
                return mapVedtaksperiode(
                    periode,
                    arbeidsgiver.organisasjonsnummer,
                    arbeidsgiver.risikovurderinger ?? []
                );
            } else {
                return mapUferdigVedtaksperiode(periode);
            }
        };

        return {
            navn: arbeidsgiver.navn,
            id: arbeidsgiver.id,
            organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
            vedtaksperioder: arbeidsgiver.vedtaksperioder.map(tilVedtaksperiode).sort(reversert),
        };
    });

const tilInfotrygdutbetalinger = (spesialistPerson: SpesialistPerson): Infotrygdutbetaling[] => {
    const toTypetekst = (
        spesialistInfotrygdtypetekst: SpesialistInfotrygdtypetekst | string
    ): InfotrygdTypetekst | string => {
        switch (spesialistInfotrygdtypetekst) {
            case SpesialistInfotrygdtypetekst.FERIE:
                return InfotrygdTypetekst.FERIE;
            case SpesialistInfotrygdtypetekst.UTBETALING:
                return InfotrygdTypetekst.UTBETALING;
            case SpesialistInfotrygdtypetekst.ARBEIDSGIVERREFUSJON:
                return InfotrygdTypetekst.ARBEIDSGIVERREFUSJON;
            case SpesialistInfotrygdtypetekst.UKJENT:
                return InfotrygdTypetekst.UKJENT;
            case SpesialistInfotrygdtypetekst.TILBAKEFØRT:
                return InfotrygdTypetekst.TILBAKEFØRT;
            default:
                return spesialistInfotrygdtypetekst;
        }
    };

    return (
        spesialistPerson.infotrygdutbetalinger
            ?.filter((utbetaling) => utbetaling.typetekst !== SpesialistInfotrygdtypetekst.TILBAKEFØRT)
            .map((utbetaling) => ({
                fom: somDato(utbetaling.fom),
                tom: somDato(utbetaling.tom),
                grad: utbetaling.grad !== '' ? parseInt(utbetaling.grad) : undefined,
                dagsats: utbetaling.typetekst !== SpesialistInfotrygdtypetekst.FERIE ? utbetaling.dagsats : undefined,
                typetekst: toTypetekst(utbetaling.typetekst) as InfotrygdTypetekst,
                organisasjonsnummer: utbetaling.organisasjonsnummer,
            })) ?? []
    );
};

export const tilPersonMedInfo = (spesialistPerson: SpesialistPerson, personinfo: Personinfo): Person => ({
    aktørId: spesialistPerson.aktørId,
    fødselsnummer: spesialistPerson.fødselsnummer,
    navn: mapNavn(spesialistPerson.personinfo),
    arbeidsgivere: tilArbeidsgivere(spesialistPerson, personinfo),
    personinfo: personinfo,
    infotrygdutbetalinger: tilInfotrygdutbetalinger(spesialistPerson),
    enhet: spesialistPerson.enhet,
    tildeltTil: spesialistPerson.tildeltTil ?? undefined,
});

const mapNavn = (personinfo: SpesialistPersoninfo) => ({
    fornavn: personinfo.fornavn,
    mellomnavn: personinfo.mellomnavn,
    etternavn: personinfo.etternavn,
});

export const mapPersoninfo = (personinfoFraSparkel: PersoninfoFraSparkel): Personinfo => ({
    fnr: personinfoFraSparkel.fnr,
    kjønn: personinfoFraSparkel.kjønn as Kjønn,
    fødselsdato: somDato(personinfoFraSparkel.fødselsdato),
});

export const tilPerson = (spesialistPerson: SpesialistPerson, personinfoFraSparkel: PersoninfoFraSparkel): Person =>
    tilPersonMedInfo(spesialistPerson, mapPersoninfo(personinfoFraSparkel));
