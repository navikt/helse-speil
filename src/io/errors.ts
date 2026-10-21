import { SpeilError } from '@utils/error';

export class FetchError extends SpeilError {
    constructor(message?: string) {
        super(message ?? 'Det har skjedd en feil. Prøv igjen senere eller kontakt en utvikler.');
        this.severity = 'error';
    }
}

export class UgyldigIdentifikatorError extends FetchError {
    constructor(søketekst: string) {
        super(`"${søketekst}" er ikke en gyldig identifikator for søk`);
        this.severity = 'info';
        this.scope = '/';
    }
}

export class UgyldigFødselsnummerError extends FetchError {
    constructor(søketekst: string) {
        super(`"${søketekst}" er ikke et gyldig fødselsnummer.`);
        this.severity = 'info';
        this.scope = '/';
    }
}

export class NotFoundError extends FetchError {
    constructor() {
        super('Personen er ikke i Speil');
        this.severity = 'info';
        this.scope = '/';
    }
}

export class ProtectedError extends FetchError {
    constructor() {
        super('Du har ikke tilgang til å søke opp denne personen');
        this.severity = 'info';
    }
}
