type InnblikkPayload = {
    url?: string;
    data?: Record<string, unknown>;
    [key: string]: unknown;
};

type LagretPerson = {
    id: string;
    sistBrukt: number;
};

type LagredePersoner = Record<string, LagretPerson>;

const lagringsnøkkel = 'innblikk.personer';
// Samme levetid som personPseudoId-en i spesialist, så vi ikke tar vare på id-er lenger enn de kan gjenbrukes.
const levetidMs = 7 * 24 * 60 * 60 * 1000;
export const innblikkHookNavn = 'innblikkBeforeSend';

export function installerInnblikkHook(): void {
    if (typeof window === 'undefined') return;
    Object.assign(window, { [innblikkHookNavn]: leggPåInnblikkPerson });
}

export function leggPåInnblikkPerson(type: string, payload: InnblikkPayload): InnblikkPayload {
    if (type !== 'event' || payload.data?.person !== undefined) return payload;

    const personPseudoId = personPseudoIdFraUrl(window.location.pathname);
    if (personPseudoId === null) return payload;

    return { ...payload, data: { ...payload.data, person: finnInnblikkPerson(personPseudoId) } };
}

export function finnInnblikkPerson(personPseudoId: string): string {
    const nå = Date.now();
    const personer = fjernUtløpte(lesLagredePersoner(), nå);
    const id = personer[personPseudoId]?.id ?? lagInnblikkPersonId();

    personer[personPseudoId] = { id, sistBrukt: nå };
    window.localStorage.setItem(lagringsnøkkel, JSON.stringify(personer));
    return id;
}

function lesLagredePersoner(): LagredePersoner {
    try {
        const verdi = window.localStorage.getItem(lagringsnøkkel);
        return verdi ? (JSON.parse(verdi) as LagredePersoner) : {};
    } catch {
        return {};
    }
}

function fjernUtløpte(personer: LagredePersoner, nå: number): LagredePersoner {
    return Object.fromEntries(Object.entries(personer).filter(([, person]) => nå - person.sistBrukt < levetidMs));
}

function personPseudoIdFraUrl(pathname: string): string | null {
    return pathname.match(/\/person\/([^/]+)/)?.[1] ?? null;
}

// Kun små bokstaver: personvernfilteret i Innblikk fjerner UUID-er og sifferrekker (fnr, orgnr, telefon, navident).
function lagInnblikkPersonId(): string {
    const alfabet = 'abcdefghijklmnopqrstuvwxyz';
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => alfabet[byte % alfabet.length]).join('');
}
