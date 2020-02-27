import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
    Hendelse,
    Inntektsmelding,
    Person,
    SendtSøknad,
    SpleisVedtaksperiode,
    UnmappedPerson,
    Vedtaksperiode
} from '../types';
import { Personinfo, VedtaksperiodeTilstand } from '../../../types';
import { mapVedtaksperiode } from './vedtaksperiodemapper';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);

enum HendelseType {
    SENDTSØKNAD = 'SENDT_SØKNAD',
    INNTEKTSMELDING = 'INNTEKTSMELDING',
    NYSØKNAD = 'NY_SØKNAD'
}

const klarTilBehandling = (vedtaksperiode: SpleisVedtaksperiode) =>
    ![
        VedtaksperiodeTilstand.AVVENTER_TIDLIGERE_PERIODE,
        VedtaksperiodeTilstand.AVVENTER_TIDLIGERE_PERIODE_ELLER_INNTEKTSMELDING
    ].includes(vedtaksperiode.tilstand as VedtaksperiodeTilstand);

const reversert = (a: Vedtaksperiode, b: Vedtaksperiode) =>
    dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();

export const mapPerson = (unmappedPerson: UnmappedPerson, personinfo: Personinfo): Person => {
    const inntektsmelding = finnInntektsmelding(unmappedPerson);
    const sendtSøknad = finnSendtSøknad(unmappedPerson);

    const arbeidsgivere = unmappedPerson.arbeidsgivere.map(arbeidsgiver => {
        const tilVedtaksperiode = (periode: SpleisVedtaksperiode) =>
            mapVedtaksperiode(
                periode,
                personinfo,
                sendtSøknad,
                inntektsmelding,
                arbeidsgiver.organisasjonsnummer
            );
        return {
            id: arbeidsgiver.id,
            organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
            vedtaksperioder: arbeidsgiver.vedtaksperioder
                .filter(klarTilBehandling)
                .map(tilVedtaksperiode)
                .sort(reversert)
        };
    });

    return {
        aktørId: unmappedPerson.aktørId,
        personinfo,
        arbeidsgivere,
        inntektsmelding,
        sendtSøknad,
        fødselsnummer: unmappedPerson.fødselsnummer
    };
};

const finnInntektsmelding = (person: UnmappedPerson): Inntektsmelding | undefined =>
    findHendelse(person, HendelseType.INNTEKTSMELDING) as Inntektsmelding;

const findHendelse = (person: UnmappedPerson, type: HendelseType): Hendelse | undefined =>
    person.hendelser.find(h => h.type === type.valueOf());

const finnSendtSøknad = (person: UnmappedPerson): SendtSøknad | undefined =>
    findHendelse(person, HendelseType.SENDTSØKNAD) as SendtSøknad;
