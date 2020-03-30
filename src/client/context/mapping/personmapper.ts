import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Kjønn, Person, Personinfo, Vedtaksperiode } from '../types';
import { Personinfo as SpleisPersoninfo } from '../../../types';
import { mapUferdigVedtaksperiode, mapVedtaksperiode, somDato } from './vedtaksperiodemapper';
import { SpleisPerson, SpleisVedtaksperiode, SpleisVedtaksperiodetilstand } from './external.types';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const reversert = (a: Vedtaksperiode, b: Vedtaksperiode) => dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();

const kanVises = (vedtaksperiodeType: SpleisVedtaksperiodetilstand) =>
    [
        SpleisVedtaksperiodetilstand.IngenUtbetaling,
        SpleisVedtaksperiodetilstand.Utbetalt,
        SpleisVedtaksperiodetilstand.Feilet,
        SpleisVedtaksperiodetilstand.Oppgaver
    ].includes(vedtaksperiodeType);

const tilArbeidsgivere = (person: SpleisPerson, personinfo: Personinfo) =>
    person.arbeidsgivere.map(arbeidsgiver => {
        const tilVedtaksperiode = (periode: SpleisVedtaksperiode) => {
            if (kanVises(periode.tilstand)) {
                return mapVedtaksperiode(periode, personinfo, arbeidsgiver.organisasjonsnummer);
            } else {
                return mapUferdigVedtaksperiode(periode);
            }
        };

        return {
            id: arbeidsgiver.id,
            organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
            vedtaksperioder: arbeidsgiver.vedtaksperioder.map(tilVedtaksperiode).sort(reversert)
        };
    });

export const mapPersoninfo = (spleisPersoninfo: SpleisPersoninfo): Personinfo => ({
    fnr: spleisPersoninfo.fnr,
    navn: spleisPersoninfo.navn,
    kjønn: spleisPersoninfo.kjønn as Kjønn,
    fødselsdato: somDato(spleisPersoninfo.fødselsdato)
});

export const tilPerson = (spleisPerson: SpleisPerson, spleisPersoninfo: SpleisPersoninfo): Person =>
    tilPersonMedInfo(spleisPerson, mapPersoninfo(spleisPersoninfo));

export const tilPersonMedInfo = (spleisPerson: SpleisPerson, personinfo: Personinfo) => ({
    aktørId: spleisPerson.aktørId,
    fødselsnummer: spleisPerson.fødselsnummer,
    arbeidsgivere: tilArbeidsgivere(spleisPerson, personinfo),
    personinfo: personinfo
});
