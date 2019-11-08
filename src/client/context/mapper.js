import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.extend(minMax);

export default {
    map: (person, personinfo) => {
        const sak = person.arbeidsgivere[0].saker[0];
        const mapped = {
            ...person,
            inngangsvilkår: {
                alder: beregnAlder(finnSøknad(person).sendtNav, personinfo.fnr),
                dagerIgjen: {
                    dagerBrukt: {},
                    førsteFraværsdag: finnInntektsmelding(person).foersteFravaersdag,
                    førsteSykepengedag: finnFørsteSykepengedag(person),
                    maksdato: sak.maksdato,
                    tidligerePerioder: [],
                    yrkesstatus: finnSøknad(person).arbeidssituasjon
                },
                sykepengegrunnlag: parseInt(finnInntektsmelding(person).beregnetInntekt, 10) * 12,
                søknadsfrist: {
                    sendtNav: finnSøknad(person).sendtNav
                }
            },
            inntektskilder: {
                månedsinntekt: parseInt(finnInntektsmelding(person).beregnetInntekt, 10),
                årsinntekt: parseInt(finnInntektsmelding(person).beregnetInntekt, 10) * 12,
                refusjon: '(Ja)',
                forskuttering: '(Ja)'
            }
        };
        return mapped;
    }
};

export const beregnAlder = (tidspunkt, fnr) => {
    const søknadstidspunkt = dayjs(tidspunkt + 'Z'.replace('ZZ', 'Z'));

    const fødselsdato = fnr.substring(0, 2);
    const fødselsmåned = fnr.substring(2, 4);
    const fødselsår = finnFødselsårFraFødselsnummerår(fnr.substring(4, 6));

    const fødselsdag = dayjs(new Date(fødselsår, fødselsmåned - 1, fødselsdato));

    return søknadstidspunkt.diff(fødselsdag, 'year', false);
};

export const finnFødselsårFraFødselsnummerår = fnrÅr => {
    const iÅr = dayjs().year() % 100;
    const år = `${parseInt(fnrÅr, 10) > iÅr ? '19' : '20'}${fnrÅr}`;
    return parseInt(år, 10);
};

const finnFørsteSykepengedag = person => {
    const utbetalingslinjer = person.arbeidsgivere[0].saker[0].utbetalingslinjer;
    return dayjs.min(utbetalingslinjer.map(linje => dayjs(linje.fom))).format('YYYY-MM-DD');
};

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
