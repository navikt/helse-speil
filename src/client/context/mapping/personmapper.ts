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

//
// export default {
//     map: (vedtaksperiode: UnmappedPerson, personinfo: Personinfo): Person => {
//         const vedtaksperiode = filtrerPaddedeArbeidsdager(enesteVedtaksperiode(vedtaksperiode));
//
//         const inntektsmelding = finnInntektsmelding(vedtaksperiode);
//         const månedsinntekt = inntektsmelding && +(inntektsmelding?.beregnetInntekt).toFixed(2);
//         const årsinntekt = inntektsmelding && +(inntektsmelding.beregnetInntekt * 12).toFixed(2);
//         const dagsats = enesteVedtaksperiode(vedtaksperiode).utbetalingslinjer?.[0]?.dagsats;
//         const utbetalingsdager = antallUtbetalingsdager(vedtaksperiode) ?? 0;
//         const årsinntektFraAording =
//             vedtaksperiode.dataForVilkårsvurdering?.beregnetÅrsinntektFraInntektskomponenten;
//         const avviksprosent = vedtaksperiode.dataForVilkårsvurdering?.avviksprosent;
//
//         return {
//             personinfo,
//             arbeidsgivere: vedtaksperiode.arbeidsgivere.map(arbeidsgiver => ({
//                 ...arbeidsgiver,
//                 vedtaksperioder: arbeidsgiver.vedtaksperioder.map(s =>
//                     filtrerPaddedeArbeidsdager(s)
//                 )
//             })),
//             inngangsvilkår: {
//                 alder: beregnAlder(
//                     enesteVedtaksperiode(vedtaksperiode).sykdomstidslinje[
//                         enesteVedtaksperiode(vedtaksperiode).sykdomstidslinje.length - 1
//                     ].dagen,
//                     personinfo?.fødselsdato
//                 ),
//                 dagerIgjen: {
//                     dagerBrukt: utbetalingsdager,
//                     førsteFraværsdag: inntektsmelding?.førsteFraværsdag ?? '-',
//                     førsteSykepengedag: finnFørsteSykepengedag(vedtaksperiode),
//                     maksdato: vedtaksperiode.maksdato,
//                     tidligerePerioder: []
//                 },
//                 opptjening:
//                     vedtaksperiode.dataForVilkårsvurdering?.antallOpptjeningsdagerErMinst &&
//                     vedtaksperiode.dataForVilkårsvurdering?.harOpptjening !== undefined
//                         ? {
//                               antallOpptjeningsdagerErMinst:
//                                   vedtaksperiode.dataForVilkårsvurdering
//                                       ?.antallOpptjeningsdagerErMinst,
//                               harOpptjening: vedtaksperiode.dataForVilkårsvurdering?.harOpptjening,
//                               opptjeningFra: moment(vedtaksperiode.førsteFraværsdag, [
//                                   'DD.MM.YYYY',
//                                   'YYYY-MM-DD',
//                                   moment.ISO_8601
//                               ])
//                                   .subtract(
//                                       vedtaksperiode.dataForVilkårsvurdering
//                                           ?.antallOpptjeningsdagerErMinst,
//                                       'days'
//                                   )
//                                   .format('DD.MM.YYYY')
//                           }
//                         : undefined,
//                 sykepengegrunnlag: sykepengegrunnlag(vedtaksperiode),
//                 søknadsfrist: søknadsfrist(vedtaksperiode)!
//             },
//             inntektskilder: {
//                 månedsinntekt,
//                 årsinntekt,
//                 refusjon: 'Ja',
//                 forskuttering: 'Ja'
//             },
//             sykepengegrunnlag: {
//                 årsinntektFraAording,
//                 årsinntektFraInntektsmelding: sykepengegrunnlag(vedtaksperiode),
//                 avviksprosent,
//                 dagsats
//             },
//             oppsummering: {
//                 sykepengegrunnlag: sykepengegrunnlag(vedtaksperiode),
//                 dagsats,
//                 antallDager: utbetalingsdager,
//                 beløp: dagsats !== undefined ? dagsats * utbetalingsdager : 0,
//                 mottakerOrgnr: enesteArbeidsgiver(vedtaksperiode).organisasjonsnummer,
//                 utbetalingsreferanse: utbetalingsreferanse(vedtaksperiode),
//                 vedtaksperiodeId: enesteVedtaksperiode(vedtaksperiode).id
//             }
//         };
//     }
// };
