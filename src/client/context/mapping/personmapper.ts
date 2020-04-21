import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Kjønn, Person, Personinfo, Vedtaksperiode } from '../types';
import { Personinfo as SpleisPersoninfo } from '../../../types';
import { mapUferdigVedtaksperiode, mapVedtaksperiode, somDato } from './vedtaksperiodemapper';
import { SpesialistPerson, SpleisPerson, SpesialistVedtaksperiode } from './external.types';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const reversert = (a: Vedtaksperiode, b: Vedtaksperiode) => dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();

const tilArbeidsgivere = (person: SpesialistPerson, personinfo: Personinfo) =>
    person.arbeidsgivere.map(arbeidsgiver => {
        const tilVedtaksperiode = (periode: SpesialistVedtaksperiode) => {
            if (periode.fullstendig) {
                return mapVedtaksperiode(periode, personinfo, arbeidsgiver.organisasjonsnummer);
            } else {
                return mapUferdigVedtaksperiode(periode);
            }
        };

        return {
            navn: arbeidsgiver.navn,
            id: arbeidsgiver.id,
            organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
            vedtaksperioder: arbeidsgiver.vedtaksperioder.map(tilVedtaksperiode).sort(reversert)
        };
    });

export const mapPersoninfo = (spleisPersoninfo: SpleisPersoninfo): Personinfo => ({
    fnr: spleisPersoninfo.fnr,
    kjønn: spleisPersoninfo.kjønn as Kjønn,
    fødselsdato: somDato(spleisPersoninfo.fødselsdato)
});

export const tilPerson = (spesialistPerson: SpesialistPerson, spleisPersoninfo: SpleisPersoninfo): Person =>
    tilPersonMedInfo(spesialistPerson, mapPersoninfo(spleisPersoninfo));

export const tilPersonMedInfo = (spesialistPerson: SpesialistPerson, personinfo: Personinfo) => ({
    aktørId: spesialistPerson.aktørId,
    fødselsnummer: spesialistPerson.fødselsnummer,
    navn: spesialistPerson.navn,
    arbeidsgivere: tilArbeidsgivere(spesialistPerson, personinfo),
    personinfo: personinfo
});
