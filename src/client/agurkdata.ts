import { Kjønn } from 'internal-types';

export const anonymisertPersoninfo = {
    fornavn: 'Agurk',
    mellomnavn: 'Squash',
    etternavn: 'Agurksen',
    fødselsdato: null,
    kjønn: 'ukjent' as Kjønn,
    fnr: '11001100111',
};

const navneliste = [
    'Pølseboden',
    'CucumberService AS',
    'CucumberHeaven',
    'AgurkNytt',
    'Agurk Bilglass',
    'Agurk Skole',
    'Pølse og Agurk ASA',
];
const orgnrGenerator = () => Math.random().toString().substr(2, 9);

const anonymeArbeidsgiverNavn: { [key: string]: { navn: string; orgnr: string } } = {};

export const getAnonymArbeidsgiverForOrgnr = (organisasjonsnummer: string): { navn: string; orgnr: string } => {
    if (anonymeArbeidsgiverNavn[organisasjonsnummer]) return anonymeArbeidsgiverNavn[organisasjonsnummer];
    console.log({ navneliste });

    anonymeArbeidsgiverNavn[organisasjonsnummer] = {
        navn: navneliste.splice(Math.floor(Math.random() * navneliste.length), 1).pop() ?? 'Enda en arbeidsgiver',
        orgnr: orgnrGenerator(),
    };
    return anonymeArbeidsgiverNavn[organisasjonsnummer];
};
