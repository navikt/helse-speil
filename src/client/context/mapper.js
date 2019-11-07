export default {
    map: person => {
        const mapped = {
            ...person,
            inngangsvilkår: {
                dagerIgjen: {
                    dagerBrukt: {},
                    tidligerePerioder: [],
                    førsteFraværsdag: finnInntektsmelding(person).foersteFravaersdag,
                    yrkesstatus: finnSøknad(person).arbeidssituasjon
                },
                sykepengegrunnlag: 0,
                søknadsfrist: {}
            }
        };
        return mapped;
    }
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
