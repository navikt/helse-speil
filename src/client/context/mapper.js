import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import { listOfDatesBetween } from '../utils/date';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);

export default {
    map: (person, personinfo) => {
        const sak = enesteSak(person);
        return {
            ...person,
            inngangsvilkår: {
                alder: beregnAlder(finnSøknad(person)?.sendtNav ?? '-', personinfo?.fødselsdato),
                dagerIgjen: {
                    dagerBrukt: antallUtbetalingsdager(person),
                    førsteFraværsdag: finnInntektsmelding(person)?.førsteFraværsdag ?? '-',
                    førsteSykepengedag: finnFørsteSykepengedag(person),
                    maksdato: sak.maksdato,
                    tidligerePerioder: [],
                    yrkesstatus: finnSøknad(person)?.arbeidssituasjon
                },
                sykepengegrunnlag: sykepengegrunnlag(person),
                søknadsfrist: søknadsfrist(person)
            },
            inntektskilder: {
                månedsinntekt: +parseFloat(finnInntektsmelding(person).beregnetInntekt, 10).toFixed(
                    2
                ),
                årsinntekt: +(
                    parseFloat(finnInntektsmelding(person).beregnetInntekt, 10) * 12
                ).toFixed(2),
                refusjon: '(Ja)',
                forskuttering: '(Ja)'
            },
            sykepengegrunnlag: {
                månedsinntekt: +parseFloat(finnInntektsmelding(person).beregnetInntekt, 10).toFixed(
                    2
                ),
                årsinntekt: +(
                    parseFloat(finnInntektsmelding(person).beregnetInntekt, 10) * 12
                ).toFixed(2),
                grunnlag: sykepengegrunnlag(person),
                dagsats: enesteSak(person).utbetalingslinjer[0].dagsats
            },
            oppsummering: {
                sykepengegrunnlag: sykepengegrunnlag(person),
                dagsats: enesteSak(person).utbetalingslinjer[0].dagsats,
                antallDager: antallUtbetalingsdager(person),
                beløp:
                    enesteSak(person).utbetalingslinjer[0].dagsats * antallUtbetalingsdager(person),
                mottaker: arbeidsgiver(person),
                utbetalingsreferanse: utbetalingsreferanse(person)
            }
        };
    }
};

export const beregnAlder = (tidspunkt, fødselsdato) => {
    if (fødselsdato === undefined) {
        return 'Alder ikke tilgjengelig';
    }
    const søknadstidspunkt = dayjs(tidspunkt + 'Z'.replace('ZZ', 'Z'));
    const fødselsdag = dayjs(fødselsdato);
    return søknadstidspunkt.diff(fødselsdag, 'year', false);
};

const finnFørsteSykepengedag = person => {
    const utbetalingslinjer = enesteSak(person).utbetalingslinjer;
    return dayjs.min(utbetalingslinjer.map(linje => dayjs(linje.fom))).format('YYYY-MM-DD');
};

const sykepengegrunnlag = person =>
    +(parseFloat(finnInntektsmelding(person).beregnetInntekt, 10) * 12).toFixed(2);

const søknadsfrist = person => {
    const sendtNav = finnSøknad(person)?.sendtNav;
    const søknadTom = finnSøknad(person)?.tom;
    const innen3Mnd = dayjs(søknadTom)
        .add(3, 'month')
        .isSameOrAfter(dayjs(sendtNav));

    return {
        sendtNav,
        søknadTom,
        innen3Mnd
    };
};

const antallUtbetalingsdager = person =>
    enesteSak(person).utbetalingslinjer.reduce((acc, linje) => {
        acc += listOfDatesBetween(linje.fom, linje.tom).length;
        return acc;
    }, 0);

const arbeidsgiver = person => finnSøknad(person)?.arbeidsgiver;

const hendelsestyper = {
    INNTEKTSMELDING: {
        type: 'InntektsmeldingMottatt',
        feltnavn: 'inntektsmelding'
    },
    SYKEPENGESØKNAD: {
        type: 'SendtSøknadMottatt',
        feltnavn: 'søknad'
    },
    SYKMELDING: {
        type: 'NySøknadMottatt',
        feltnavn: 'søknad'
    }
};

const finnInntektsmelding = person => findHendelse(person, hendelsestyper.INNTEKTSMELDING);
const finnSøknad = person => findHendelse(person, hendelsestyper.SYKEPENGESØKNAD);

const findHendelse = (person, type) =>
    enesteSak(person).sykdomstidslinje.hendelser.find(h => h.type === type.type)?.[type.feltnavn];
export const utbetalingsreferanse = person => enesteSak(person).utbetalingsreferanse;
export const enesteSak = person => {
    if (person.arbeidsgivere.length === 1 && person.arbeidsgivere[0].saker.length === 1)
        return person.arbeidsgivere[0].saker[0];
    else {
        console.error(
            `Størrelsen til listen over arbeidsgivere er ${person.arbeidsgivere.length} og størrelsen på listen over saker er ${person.arbeidsgivere[0].saker.length}`
        );
        throw 'Personen har ikke nøyaktig 1 arbeidsgiver eller nøyaktig 1 sak. Dette er ikke støttet enda.';
    }
};
