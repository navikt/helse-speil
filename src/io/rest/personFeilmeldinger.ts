import { PersonErrorCode } from '@io/rest/generated/spesialist.schemas';

/**
 * Mapper PersonErrorCode-verdier til feilmeldingstekster.
 * Returnerer null om koden ikke er en PersonErrorCode, slik at kallstedet kan håndtere
 * route-spesifikke koder videre i sin egen switch.
 *
 * Bruk:
 *   const personFeilmelding = somPersonFeilmelding(code);
 *   if (personFeil != null) return personFeil;
 *   switch (code) { ... route-spesifikk håndtering ... }
 */
export function somPersonFeilmelding(code: string): string | null {
    switch (code) {
        case PersonErrorCode.PERSON_PSEUDO_ID_IKKE_FUNNET:
        case PersonErrorCode.PERSON_IKKE_FUNNET:
            return 'Det skjedde en feil, last siden på nytt og prøv igjen. Rapporter feilen videre om den fortsetter.';
        case PersonErrorCode.MANGLER_TILGANG_TIL_PERSON:
            return 'Du har ikke tilgang til denne personen';
        default:
            return null;
    }
}
