import { Kjønn } from 'internal-types';

export const anonymisertPersoninfo = {
    fornavn: 'Agurk',
    mellomnavn: 'Squash',
    etternavn: 'Agurksen',
    fødselsdato: null,
    kjønn: 'ukjent' as Kjønn,
    fnr: '11001100111',
};

const agurkArbeidsgivere = [
    { navn: 'Pølseboden', orgnr: '999999999' },
    { navn: 'CucumberService AS', orgnr: '888888888' },
    { navn: 'CucumberHeaven', orgnr: '777777777' },
    { navn: 'AgurkNytt', orgnr: '666666666' },
    { navn: 'Agurk Bilglass', orgnr: '555555555' },
    { navn: 'Agurk Skole', orgnr: '444444444' },
    { navn: 'Pølse og Agurk ASA', orgnr: '333333333' },
    { navn: 'Nissemyra', orgnr: '222222222' },
];

let navneliste = [...agurkArbeidsgivere];
let anonymeArbeidsgiverNavn: { [key: string]: { navn: string; orgnr: string } } = {};

export const nullstillAgurkData = () => {
    anonymeArbeidsgiverNavn = {};
    navneliste = [...agurkArbeidsgivere];
};

export const getAnonymArbeidsgiverForOrgnr = (organisasjonsnummer: string): { navn: string; orgnr: string } => {
    if (anonymeArbeidsgiverNavn[organisasjonsnummer]) return anonymeArbeidsgiverNavn[organisasjonsnummer];

    anonymeArbeidsgiverNavn[organisasjonsnummer] = navneliste
        .splice(Math.floor(Math.random() * navneliste.length), 1)
        .pop() ?? {
        navn: 'Enda en arbeidsgiver',
        orgnr: '000000000',
    };
    return anonymeArbeidsgiverNavn[organisasjonsnummer];
};
