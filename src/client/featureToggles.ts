import { extractIdent } from './utils/cookie';

const erLocal = () => location.hostname === 'localhost';
const erPreprod = () => location.hostname === 'speil.nais.preprod.local';
const erSupersaksbehandler = () => erEminem() || erDonika() || erDaniel() || erMorten() || erAminet();

const erEminem = () => extractIdent() === 'G103083';
const erDonika = () => extractIdent() === 'D117949';
const erUlrik = () => extractIdent() === 'P141762';
const erDaniel = () => extractIdent() === 'A148751';
const erMorten = () => extractIdent() === 'N115007';
const erAminet = () => extractIdent() === 'C117102';
const erDigiMort = () => extractIdent() === 'T127350';
const erStephen = () => extractIdent() === 'R154509';
const erMartin = () => extractIdent() === 'S149030';
const erJonas = () => extractIdent() === 'H159657';
const erOddur = () => extractIdent() === 'S145454';

export const overstyrbareTabellerEnabled = true;
export const annulleringerEnabled = erPreprod() || erLocal() || erSupersaksbehandler();
export const speilTildeling = true;
export const speilV2 =
    erLocal() ||
    erUlrik() ||
    erDaniel() ||
    erDigiMort() ||
    erStephen() ||
    erAminet() ||
    erMartin() ||
    erJonas() ||
    erMorten() ||
    erOddur();
