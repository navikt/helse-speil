import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import { listOfDatesBetween } from '../utils/date';
import { Dagtype, Inntektsmelding, Optional, Person, Personinfo, Sak, Søknad, UnmappedPerson } from './types';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);

interface Hendelse {
    type: 'SendtSøknad' | 'Inntektsmelding' | 'NySøknad';
    feltnavn: 'inntektsmelding' | 'søknad';
}

const hendelsestyper: { [key: string]: Hendelse } = {
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
    map: (person: UnmappedPerson, personinfo: Personinfo): Person => {
        const sak = filtrerPaddedeArbeidsdager((enesteSak(person)));

        const inntektsmelding = finnInntektsmelding(person);
        const månedsinntekt = inntektsmelding && +parseFloat(inntektsmelding?.beregnetInntekt).toFixed(2);
        const årsinntekt = inntektsmelding && +(parseFloat(inntektsmelding.beregnetInntekt) * 12).toFixed(2);
        const dagsats = enesteSak(person).utbetalingslinjer?.[0].dagsats;
        const utbetalingsdager = antallUtbetalingsdager(person) ?? 0;

        return {
            ...person,
            personinfo,
            inngangsvilkår: {
                alder: beregnAlder(finnSøknad(person)?.sendtNav, personinfo?.fødselsdato),
                dagerIgjen: {
                    dagerBrukt: utbetalingsdager,
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
                antallDager: utbetalingsdager,
                beløp: dagsats !== undefined ? dagsats * utbetalingsdager : 0,
                mottaker: arbeidsgiver(person),
                utbetalingsreferanse: utbetalingsreferanse(person),
                vedtaksperiodeId: enesteSak(person).id
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

const finnFørsteSykepengedag = (person: UnmappedPerson) => {
    const utbetalingslinjer = enesteSak(person).utbetalingslinjer;
    if (utbetalingslinjer === undefined || utbetalingslinjer === null) return null;
    return dayjs.min(utbetalingslinjer.map(linje => dayjs(linje.fom))).format('YYYY-MM-DD');
};

const sykepengegrunnlag = (person: UnmappedPerson): Optional<number> => {
    const beregnetMånedsinntekt = finnInntektsmelding(person)?.beregnetInntekt;
    return beregnetMånedsinntekt
        ? +(parseFloat(beregnetMånedsinntekt) * 12).toFixed(2)
        : undefined;
};

const søknadsfrist = (person: UnmappedPerson) => {
    const sendtNav = finnSøknad(person)?.sendtNav;
    const søknadTom = finnSøknad(person)?.tom;
    const innen3Mnd = (sendtNav && dayjs(søknadTom).add(3, 'month').isSameOrAfter(dayjs(sendtNav))) || false;

    return {
        sendtNav,
        søknadTom,
        innen3Mnd
    };
};

const antallUtbetalingsdager = (person: UnmappedPerson) =>
    enesteSak(person).utbetalingslinjer?.reduce((acc, linje) => {
        acc += listOfDatesBetween(linje.fom, linje.tom).length;
        return acc;
    }, 0);

const arbeidsgiver = (person: UnmappedPerson) => finnSøknad(person)?.arbeidsgiver;

const finnInntektsmelding = (person: UnmappedPerson): Optional<Inntektsmelding> => findHendelse(person, hendelsestyper.INNTEKTSMELDING) as Inntektsmelding;

const findHendelse = (person: UnmappedPerson, type: Hendelse): Optional<Inntektsmelding | Søknad> =>
    enesteSak(person).sykdomstidslinje.hendelser.find(h => h.type === type.type)?.[type.feltnavn];

export const finnSøknad = (person: UnmappedPerson): Optional<Søknad> => findHendelse(person, hendelsestyper.SYKEPENGESØKNAD) as Søknad;

export const finnSykmeldingsgrad = (person: UnmappedPerson): Optional<number> => finnSøknad(person)?.soknadsperioder[0].sykmeldingsgrad;

export const utbetalingsreferanse = (person: UnmappedPerson): Optional<string> => enesteSak(person).utbetalingsreferanse;

export const filtrerPaddedeArbeidsdager = (sak: Sak): Sak => {
    const førsteArbeidsdag = sak.sykdomstidslinje.dager.findIndex((dag) => dag.type === Dagtype.ARBEIDSDAG);
    if(førsteArbeidsdag === -1 || førsteArbeidsdag !== 0) return sak;

    const førsteIkkeArbeidsdag = sak.sykdomstidslinje.dager.findIndex((dag ) => dag.type !== Dagtype.ARBEIDSDAG);

    return {
        ...sak,
        sykdomstidslinje: {
            ...sak.sykdomstidslinje,
            dager: sak.sykdomstidslinje.dager.slice(førsteIkkeArbeidsdag)
        }
    };
};

export const enesteSak = (person: UnmappedPerson): Sak => {
    if (person.arbeidsgivere.length !== 1 || person.arbeidsgivere[0].saker.length !== 1) {
        console.error(`Arbeidsgivere = ${person.arbeidsgivere.length}, saker = ${person.arbeidsgivere[0].saker.length}`);
        throw 'Personen har ikke nøyaktig 1 arbeidsgiver eller nøyaktig 1 sak. Dette er ikke støttet enda.';
    }
    return person.arbeidsgivere[0].saker[0];
};
