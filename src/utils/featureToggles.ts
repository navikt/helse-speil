import { erLokal, erUtvikling } from '@/env';

const groupIdForTbd = 'f787f900-6697-440d-a086-d5bb56e26a9c';
const groupIdForBesluttere = '59f26eef-0a4f-4038-bf46-3a5b2f252155';

const supersaksbehandlere = ['N115007', 'K164523', 'A148751', 'S161635'];

const fagkoordinatorer = ['M136300', 'S108267', 'K123956', 'G157538'];

const avdelingsledere = ['K105348', 'L105454'];

const coaches = [
    'F131883',
    'V149621',
    'S160466',
    'B164848',
    'K162139',
    'F160464',
    'M136300',
    'F158061',
    'S157539',
    'S165568',
    'G155258',
    'H160235',
];

// const erSupersaksbehandler = (ident: string) => supersaksbehandlere.includes(ident);
// const erCoach = (ident: string) => coaches.includes(ident);
// const erFagkoordinator = (ident: string) => fagkoordinatorer.includes(ident);
// const erAvdelingsleder = (ident: string) => avdelingsledere.includes(ident);

const grupperFraNAY = (ident: string) =>
    [...coaches, ...avdelingsledere, ...fagkoordinatorer, ...supersaksbehandlere].includes(ident);
const erPåTeamBømlo = (grupper: string[]) => grupper.includes(groupIdForTbd);

export const kanGjøreTilkommenInntektEndringer = (): boolean => erUtvikling;
export const kanSeSelvstendigNæringsdrivende: boolean = erUtvikling;
export const kanFrigiAndresOppgaver = (ident: string) => grupperFraNAY(ident) || erUtvikling;
export const kanBrukeUtviklersnarveier = (grupper: string[]) => erUtvikling || erPåTeamBømlo(grupper);
export const kanFiltrerePåGosysEgenskap = (ident: string, grupper: string[]) =>
    grupperFraNAY(ident) || erPåTeamBømlo(grupper) || erLokal;
export const kanSøkeOppTildelteOppgaver = (ident: string, grupper: string[]) =>
    grupperFraNAY(ident) || erPåTeamBømlo(grupper) || erUtvikling;

export const harBeslutterrolle = (grupper: string[]): boolean => grupper.includes(groupIdForBesluttere);
