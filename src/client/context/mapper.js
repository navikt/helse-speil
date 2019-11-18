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
        const sak = person.arbeidsgivere[0].saker[0];
        const mapped = {
            ...person,
            inngangsvilkår: {
                alder: beregnAlder(finnSøknad(person).sendtNav, personinfo?.fødselsdato),
                dagerIgjen: {
                    dagerBrukt: antallUtbetalingsdager(person),
                    førsteFraværsdag: finnInntektsmelding(person).foersteFravaersdag,
                    førsteSykepengedag: finnFørsteSykepengedag(person),
                    maksdato: sak.maksdato,
                    tidligerePerioder: [],
                    yrkesstatus: finnSøknad(person).arbeidssituasjon
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
                dagsats: person.arbeidsgivere[0].saker[0].utbetalingslinjer[0].dagsats
            },
            oppsummering: {
                sykepengegrunnlag: sykepengegrunnlag(person),
                dagsats: person.arbeidsgivere[0].saker[0].utbetalingslinjer[0].dagsats,
                antallDager: antallUtbetalingsdager(person),
                beløp:
                    person.arbeidsgivere[0].saker[0].utbetalingslinjer[0].dagsats *
                    antallUtbetalingsdager(person),
                mottaker: arbeidsgiver(person)
            }
        };
        return mapped;
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
    const utbetalingslinjer = person.arbeidsgivere[0].saker[0].utbetalingslinjer;
    return dayjs.min(utbetalingslinjer.map(linje => dayjs(linje.fom))).format('YYYY-MM-DD');
};

const sykepengegrunnlag = person =>
    +(parseFloat(finnInntektsmelding(person).beregnetInntekt, 10) * 12).toFixed(2);

const søknadsfrist = person => {
    const sendtNav = finnSøknad(person).sendtNav;
    const søknadTom = finnSøknad(person).tom;
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
    person.arbeidsgivere[0].saker[0].utbetalingslinjer.reduce((acc, linje) => {
        acc += listOfDatesBetween(linje.fom, linje.tom).length;
        return acc;
    }, 0);

const arbeidsgiver = person => finnSøknad(person).arbeidsgiver;

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
const finnSykmelding = person => findHendelse(person, hendelsestyper.SYKMELDING);

const findHendelse = (person, type) =>
    person.arbeidsgivere[0].saker[0].sykdomstidslinje.hendelser.find(h => h.type === type.type)[
        type.feltnavn
    ];
