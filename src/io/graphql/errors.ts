import { SpeilError } from '@utils/error';

export class FetchError extends SpeilError {
    constructor(message?: string) {
        super(message ?? 'Det har skjedd en feil. Prøv igjen senere eller kontakt en utvikler.');
        this.severity = 'error';
    }
}

export class NotFoundError extends FetchError {
    constructor() {
        super('Personen er ikke i Speil');
        this.severity = 'info';
        this.scope = '/';
    }
}

export class NotReadyError extends FetchError {
    constructor(søketekst: string) {
        super(
            `Det er ikke mottatt korrekt inntektsmelding eller søknad utover arbeidsgiverperioden for ${søketekst}.
             Se i Gosys.`,
        );
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

export class FlereFodselsnumreError extends FetchError {
    constructor(fodselsnumre: string[]) {
        super(
            `Denne aktør-ID-en er registrert med flere fødselsnumre: ${fodselsnumre.join(
                ', ',
            )}. Fordi fødselsnumrene er behandlet hver for seg, må du sjekke om systemet har beregnet en periode feil.`,
        );
        this.severity = 'error';
    }
}
