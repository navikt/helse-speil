import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Hendelse, Inntektsmelding, Person, SendtSøknad, UnmappedPerson } from '../types';
import { Personinfo } from '../../../types';
import { mapVedtaksperiode } from './vedtaksperiodemapper';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);

enum HendelseType {
    SENDTSØKNAD = 'SENDT_SØKNAD',
    INNTEKTSMELDING = 'INNTEKTSMELDING',
    NYSØKNAD = 'NY_SØKNAD'
}

export const mapPerson = (unmappedPerson: UnmappedPerson, personinfo: Personinfo): Person => {
    const inntektsmelding = finnInntektsmelding(unmappedPerson);
    const sendtSøknad = finnSendtSøknad(unmappedPerson);

    const arbeidsgivere = unmappedPerson.arbeidsgivere.map(arbeidsgiver => ({
        id: arbeidsgiver.id,
        organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
        vedtaksperioder: arbeidsgiver.vedtaksperioder.map(periode =>
            mapVedtaksperiode(periode, personinfo, sendtSøknad, inntektsmelding)
        )
    }));

    return {
        aktørId: unmappedPerson.aktørId,
        personinfo,
        arbeidsgivere,
        inntektsmelding,
        sendtSøknad
    };
};

const finnInntektsmelding = (person: UnmappedPerson): Inntektsmelding | undefined =>
    findHendelse(person, HendelseType.INNTEKTSMELDING) as Inntektsmelding;

const findHendelse = (person: UnmappedPerson, type: HendelseType): Hendelse | undefined =>
    person.hendelser.find(h => h.type === type.valueOf());

const finnSendtSøknad = (person: UnmappedPerson): SendtSøknad | undefined => {
    return findHendelse(person, HendelseType.SENDTSØKNAD) as SendtSøknad;
};
