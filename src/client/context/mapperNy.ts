import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import { listOfDatesBetween } from '../utils/date';
import {
    Dag,
    Dagtype,
    Inntektsmelding,
    Optional,
    Person,
    Vedtaksperiode,
    Søknad,
    UnmappedPerson,
    Hendelse,
    SendtSøknad
} from './types';
import { Personinfo } from '../../types';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);

interface HendelseType {
    type: 'SendtSøknad' | 'Inntektsmelding' | 'NySøknad';
}

const hendelsestyper: { [key: string]: HendelseType } = {
    INNTEKTSMELDING: {
        type: 'Inntektsmelding'
    },
    SYKEPENGESØKNAD: {
        type: 'SendtSøknad'
    },
    SYKMELDING: {
        type: 'NySøknad'
    }
};

export default {
    map: (person: UnmappedPerson, personinfo: Personinfo): Person => {
        const sak = filtrerPaddedeArbeidsdager(enesteVedtaksperiode(person));

        const inntektsmelding = finnInntektsmelding(person);
        const månedsinntekt =
            inntektsmelding && +parseFloat(inntektsmelding?.beregnetInntekt).toFixed(2);
        const årsinntekt =
            inntektsmelding && +(parseFloat(inntektsmelding.beregnetInntekt) * 12).toFixed(2);
        const dagsats = enesteVedtaksperiode(person).utbetalingslinjer?.[0].dagsats;
        const utbetalingsdager = antallUtbetalingsdager(person) ?? 0;
        const årsinntektFraAording = sak.dataForVilkårsvurdering?.beregnetÅrsinntekt;
        const avviksprosent = sak.dataForVilkårsvurdering?.avviksprosent;

        return {
            ...person,
            personinfo,
            arbeidsgivere: person.arbeidsgivere.map(arbeidsgiver => ({
                ...arbeidsgiver,
                vedtaksperioder: arbeidsgiver.vedtaksperioder.map(s =>
                    filtrerPaddedeArbeidsdager(s)
                )
            })),
            inngangsvilkår: {
                alder: beregnAlder(finnSendtSøknad(person)?.sendtNav, personinfo?.fødselsdato),
                dagerIgjen: {
                    dagerBrukt: utbetalingsdager,
                    førsteFraværsdag: inntektsmelding?.foersteFravaersdag ?? '-',
                    førsteSykepengedag: finnFørsteSykepengedag(person),
                    maksdato: sak.maksdato,
                    tidligerePerioder: [],
                    yrkesstatus: finnSendtSøknad(person)?.arbeidssituasjon
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
                årsinntektFraAording,
                årsinntektFraInntektsmelding: sykepengegrunnlag(person),
                avviksprosent,
                dagsats
            },
            oppsummering: {
                sykepengegrunnlag: sykepengegrunnlag(person),
                dagsats,
                antallDager: utbetalingsdager,
                beløp: dagsats !== undefined ? dagsats * utbetalingsdager : 0,
                mottaker: enesteArbeidsgiver(person),
                utbetalingsreferanse: utbetalingsreferanse(person),
                vedtaksperiodeId: enesteVedtaksperiode(person).id
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
    const utbetalingslinjer = enesteVedtaksperiode(person).utbetalingslinjer;
    if (utbetalingslinjer === undefined || utbetalingslinjer === null) return null;
    return dayjs.min(utbetalingslinjer.map(linje => dayjs(linje.fom))).format('YYYY-MM-DD');
};

const sykepengegrunnlag = (person: UnmappedPerson): Optional<number> => {
    const beregnetMånedsinntekt = finnInntektsmelding(person)?.beregnetInntekt;
    return beregnetMånedsinntekt ? +(beregnetMånedsinntekt * 12).toFixed(2) : undefined;
};

const søknadsfrist = (person: UnmappedPerson) => {
    const sendtNav = finnSendtSøknad(person)?.sendtNav;
    const søknadTom = finnSendtSøknad(person)?.tom;
    const innen3Mnd =
        (sendtNav &&
            dayjs(søknadTom)
                .add(3, 'month')
                .isSameOrAfter(dayjs(sendtNav))) ||
        false;

    return {
        sendtNav,
        søknadTom,
        innen3Mnd
    };
};

const antallUtbetalingsdager = (person: UnmappedPerson) =>
    enesteVedtaksperiode(person).utbetalingslinjer?.reduce((acc, linje) => {
        acc += listOfDatesBetween(linje.fom, linje.tom).length;
        return acc;
    }, 0);

const enesteArbeidsgiver = (person: UnmappedPerson) =>
    person.arbeidsgivere.find(
        arb => finnSendtSøknad(person)?.orgnummer === arb.organisasjonsnummer
    );

const finnInntektsmelding = (person: UnmappedPerson): Optional<Inntektsmelding> =>
    findHendelse(person, hendelsestyper.INNTEKTSMELDING) as Inntektsmelding;

const findHendelse = (person: UnmappedPerson, type: HendelseType): Optional<Hendelse> =>
    person.hendelser.find(h => h.type === type.type);

export const finnSendtSøknad = (person: UnmappedPerson): Optional<SendtSøknad> =>
    findHendelse(person, hendelsestyper.SYKEPENGESØKNAD) as SendtSøknad;

export const finnSykmeldingsgrad = (person: UnmappedPerson): Optional<number> =>
    finnSendtSøknad(person)?.perioder[0].grad; //TODO: grad eller faktiskGrad?

export const utbetalingsreferanse = (person: UnmappedPerson): Optional<string> =>
    enesteVedtaksperiode(person).utbetalingsreferanse;

export const filtrerPaddedeArbeidsdager = (sak: Vedtaksperiode): Vedtaksperiode => {
    const arbeidsdagEllerImplisittDag = (dag: Dag) =>
        dag.type === Dagtype.ARBEIDSDAG || dag.type === Dagtype.IMPLISITT_DAG;
    const førsteArbeidsdag = sak.sykdomstidslinje.dager.findIndex(arbeidsdagEllerImplisittDag);
    if (førsteArbeidsdag === -1 || førsteArbeidsdag !== 0) return sak;

    const førsteIkkeArbeidsdag = sak.sykdomstidslinje.dager.findIndex(
        dag => dag.type !== Dagtype.ARBEIDSDAG && dag.type !== Dagtype.IMPLISITT_DAG
    );

    return {
        ...sak,
        sykdomstidslinje: {
            ...sak.sykdomstidslinje,
            dager: sak.sykdomstidslinje.dager.slice(førsteIkkeArbeidsdag)
        }
    };
};

export const enesteVedtaksperiode = (person: UnmappedPerson): Vedtaksperiode => {
    if (person.arbeidsgivere.length !== 1 || person.arbeidsgivere[0].vedtaksperioder.length !== 1) {
        console.error(
            `Arbeidsgivere = ${person.arbeidsgivere.length}, vedtaksperioder = ${person.arbeidsgivere[0].vedtaksperioder.length}`
        );
        throw 'Personen har ikke nøyaktig 1 arbeidsgiver eller nøyaktig 1 sak. Dette er ikke støttet enda.';
    }
    return person.arbeidsgivere[0].vedtaksperioder[0];
};
