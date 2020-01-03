import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import { listOfDatesBetween } from '../utils/date';
import { Inntektsmelding, Optional, Person, Personinfo, Sak, Søknad } from './types';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);

interface Hendelsetype {
    type: 'SendtSøknad' | 'Inntektsmelding' | 'NySøknad';
    feltnavn: 'inntektsmelding' | 'søknad';
}

const hendelsestyper: { [key: string]: Hendelsetype } = {
    INNTEKTSMELDING: {
        type: 'Inntektsmelding',
        feltnavn: 'inntektsmelding'
    },
    SYKEPENGESØKNAD: {
        type: 'SendtSøknad',
        feltnavn: 'søknad'
    },
    SYKMELDING: {
        type: 'NySøknad',
        feltnavn: 'søknad'
    }
};

export default {
    map: (person: Person, personinfo: Personinfo): Person => {
        const sak = enesteSak(person);
        const inntektsmelding = finnInntektsmelding(person);
        const månedsinntekt = inntektsmelding && +parseFloat(inntektsmelding?.beregnetInntekt).toFixed(2);
        const årsinntekt = inntektsmelding && +(parseFloat(inntektsmelding.beregnetInntekt) * 12).toFixed(2);
        const dagsats = enesteSak(person).utbetalingslinjer[0].dagsats;

        return {
            ...person,
            inngangsvilkår: {
                alder: beregnAlder(finnSøknad(person)?.sendtNav, personinfo?.fødselsdato),
                dagerIgjen: {
                    dagerBrukt: antallUtbetalingsdager(person),
                    førsteFraværsdag: inntektsmelding?.førsteFraværsdag ?? '-',
                    førsteSykepengedag: finnFørsteSykepengedag(person),
                    maksdato: sak.maksdato,
                    tidligerePerioder: [],
                    yrkesstatus: finnSøknad(person)?.arbeidssituasjon
                },
                sykepengegrunnlag: sykepengegrunnlag(person),
                søknadsfrist: søknadsfrist(person)
            },
            inntektskilder: {
                månedsinntekt,
                årsinntekt,
                refusjon: '(Ja)',
                forskuttering: '(Ja)'
            },
            sykepengegrunnlag: {
                månedsinntekt,
                årsinntekt,
                grunnlag: sykepengegrunnlag(person),
                dagsats
            },
            oppsummering: {
                sykepengegrunnlag: sykepengegrunnlag(person),
                dagsats,
                antallDager: antallUtbetalingsdager(person),
                beløp: dagsats * antallUtbetalingsdager(person),
                mottaker: arbeidsgiver(person),
                utbetalingsreferanse: utbetalingsreferanse(person)
            }
        };
    }
};

export const beregnAlder = (tidspunkt?: string, fødselsdato?: string): Optional<number> => {
    if (fødselsdato === undefined) return;

    const søknadstidspunkt = dayjs(tidspunkt + 'Z'.replace('ZZ', 'Z'));
    const fødselsdag = dayjs(fødselsdato);
    return søknadstidspunkt.diff(fødselsdag, 'year', false);
};

const finnFørsteSykepengedag = (person: Person) => {
    const utbetalingslinjer = enesteSak(person).utbetalingslinjer;
    return dayjs.min(utbetalingslinjer.map(linje => dayjs(linje.fom))).format('YYYY-MM-DD');
};

const sykepengegrunnlag = (person: Person): Optional<number> => {
    const beregnetMånedsinntekt = finnInntektsmelding(person)?.beregnetInntekt;
    return beregnetMånedsinntekt
        ? +(parseFloat(beregnetMånedsinntekt) * 12).toFixed(2)
        : undefined;
};

const søknadsfrist = (person: Person) => {
    const sendtNav = finnSøknad(person)?.sendtNav;
    const søknadTom = finnSøknad(person)?.tom;
    const innen3Mnd = (sendtNav && dayjs(søknadTom).add(3, 'month').isSameOrAfter(dayjs(sendtNav))) || false;

    return {
        sendtNav,
        søknadTom,
        innen3Mnd
    };
};

const antallUtbetalingsdager = (person: Person) =>
    enesteSak(person).utbetalingslinjer.reduce((acc, linje) => {
        acc += listOfDatesBetween(linje.fom, linje.tom).length;
        return acc;
    }, 0);

const arbeidsgiver = (person: Person) => finnSøknad(person)?.arbeidsgiver;

const finnInntektsmelding = (person: Person): Optional<Inntektsmelding> => findHendelse(person, hendelsestyper.INNTEKTSMELDING) as Inntektsmelding;

const finnSøknad = (person: Person): Optional<Søknad> => findHendelse(person, hendelsestyper.SYKEPENGESØKNAD) as Søknad;

const findHendelse = (person: Person, type: Hendelsetype): Optional<Inntektsmelding | Søknad> =>
    enesteSak(person).sykdomstidslinje.hendelser.find(h => h.type === type.type)?.[type.feltnavn];

export const utbetalingsreferanse = (person: Person): Optional<string> => enesteSak(person).utbetalingsreferanse;

export const enesteSak = (person: Person): Sak => {
    if (person.arbeidsgivere.length !== 1 || person.arbeidsgivere[0].saker.length !== 1) {
        console.error(`Arbeidsgivere = ${person.arbeidsgivere.length}, saker = ${person.arbeidsgivere[0].saker.length}`);
        throw 'Personen har ikke nøyaktig 1 arbeidsgiver eller nøyaktig 1 sak. Dette er ikke støttet enda.';
    }
    return person.arbeidsgivere[0].saker[0];
};
