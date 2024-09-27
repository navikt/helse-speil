import { erDev, erLokal, erUtvikling } from '@/env';

const groupIdForTbd = 'f787f900-6697-440d-a086-d5bb56e26a9c';
const groupIdForBesluttere = '59f26eef-0a4f-4038-bf46-3a5b2f252155';
const groupIdSpesialsaker = '39c09f12-4a2f-44da-ab6a-ac43d680294c';

const eminem = 'G103083';
const supersaksbehandlere = [eminem, 'N115007', 'C117102', 'K164523'];

const fagkoordinatorer = ['M136300', 'S108267', 'K123956', 'G157538'];

const enhetsledere = ['K105348', 'L105454'];

const coaches = [
    'J153777',
    'F131883',
    'K104953',
    'V149621',
    'S160466',
    'O123659',
    'B164848',
    'K162139',
    'F160464',
    'M136300',
    'F158061',
    ...enhetsledere,
];

export const erCoachEllerSuper = (ident: string) => erCoach(ident) || erSupersaksbehandler(ident);
const erSupersaksbehandler = (ident: string) => supersaksbehandlere.includes(ident);
const harTilgangTilAlt = (ident: string) =>
    [...supersaksbehandlere, ...fagkoordinatorer, ...enhetsledere].includes(ident);
const erCoach = (ident: string) => coaches.includes(ident);
const kanFrigiSaker = (ident: string) => ['K162139'].includes(ident);
const erFunksjoneltAnsvarligIPoHelse = (ident: string) => ['S114950'].includes(ident);

const erPåTeamBømlo = (grupper: string[]) => grupper.includes(groupIdForTbd);

export const kanFrigiAndresOppgaver = (ident: string) =>
    kanFrigiSaker(ident) || harTilgangTilAlt(ident) || erLokal || erDev;

export const graphqlplayground = (grupper: string[]) => erLokal || erDev || erPåTeamBømlo(grupper);

export const harBeslutterrolle = (grupper: string[]): boolean => grupper.includes(groupIdForBesluttere);

export const harSpesialsaktilgang = (grupper: string[]): boolean =>
    grupper.includes(groupIdSpesialsaker) || erUtvikling;

export const kanFiltrerePåGosysEgenskap = (ident: string, grupper: string[]) =>
    erCoachEllerSuper(ident) || erFunksjoneltAnsvarligIPoHelse(ident) || erPåTeamBømlo(grupper) || erLokal;

export const erLokalEllerDev: boolean = erLokal || erDev;

export const kanOverstyreMinimumSykdomsgradToggle = (ident: string): boolean =>
    erLokalEllerDev || erCoachEllerSuper(ident);

export const skalViseTilkommenInntekt: boolean = erLokalEllerDev;
