import { erUtvikling } from '@/env';

const groupIdNaisTeamTbd = 'c0227409-2085-4eb2-b487-c4ba270986a3';
const groupIdForBesluttere = '59f26eef-0a4f-4038-bf46-3a5b2f252155';

const supersaksbehandlere = ['N115007', 'K164523', 'A148751', 'S161635'];

// Fagkoordinatorer: https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Fagnettverk-for-sykepenger.aspx
const fagkoordinatorer = [
    'A142467',
    'B137568',
    'D123751',
    'F160464',
    'G157538',
    'H126784',
    'H149897',
    'J141450',
    'K123956',
    'M136300',
    'S108267',
];

// Avdelingsledere: https://navno.sharepoint.com/:x:/s/enhet-arbeid-og-ytelser/EVg9YaONIHdDsFjGYGnJab0BIgOxx0724elo9dtsOBoAnw?e=kNIbmh
const avdelingsledere = [
    'A147735',
    'A147735',
    'A151722',
    'J120735',
    'J151721',
    'K105348',
    'L105454',
    'N106601',
    'N147606',
    'N172031',
    'R159363',
    'S131764',
    'S135852',
    'S139986',
    'S145454',
    'S171968',
    'T109457',
    'T147443',
    'W110179',
];

// Coacher: https://navno.sharepoint.com/sites/44/NAYsykepenger/SitePages/Speilverden.aspx
const coaches = [
    'B164848',
    'F131883',
    'F158061', // Midlertidig coach
    'G155258',
    'H160235',
    'K162139',
    'S157539',
    'S165568',
    'V149621',
];

// const erSupersaksbehandler = (ident: string) => supersaksbehandlere.includes(ident);
// const erCoach = (ident: string) => coaches.includes(ident);
// const erFagkoordinator = (ident: string) => fagkoordinatorer.includes(ident);
// const erAvdelingsleder = (ident: string) => avdelingsledere.includes(ident);

const grupperFraNAY = (ident: string) =>
    [...coaches, ...avdelingsledere, ...fagkoordinatorer, ...supersaksbehandlere].includes(ident);
const erPåTeamBømlo = (grupper: string[]) => grupper.includes(groupIdNaisTeamTbd);
const harTilgangTilAnnulleringsriggISpleis = (ident: string) =>
    ['S161635', 'A148751', 'V149621', 'H160235'].includes(ident);

export const kanGjøreTilkommenInntektEndringer = (): boolean => erUtvikling;
export const kanSeSelvstendigNæringsdrivende: boolean = erUtvikling;
export const kanBrukeUtviklersnarveier = (grupper: string[]) => erUtvikling || erPåTeamBømlo(grupper);
export const kanSøkeOppTildelteOppgaver = (ident: string, grupper: string[]) =>
    grupperFraNAY(ident) || erPåTeamBømlo(grupper) || erUtvikling;
export const kanSeNyAnnulleringsrigg = (ident: string, grupper: string[]) =>
    harTilgangTilAnnulleringsriggISpleis(ident) || erPåTeamBømlo(grupper) || erUtvikling;

export const harBeslutterrolle = (grupper: string[]): boolean => grupper.includes(groupIdForBesluttere);
