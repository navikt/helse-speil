import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';

dayjs.extend(minMax);

export default {
    map: person => {
        const sak = person.arbeidsgivere[0].saker[0];
        const mapped = {
            ...person,
            inngangsvilkår: {
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
                årsinntekt: parseInt(finnInntektsmelding(person).beregnetInntekt, 10) * 12
            }
        };
        return mapped;
    }
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
