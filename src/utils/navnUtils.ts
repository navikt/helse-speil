import { ApiNavn } from '@io/rest/generated/sporhund.schemas';

export function formatNavn(navn: ApiNavn): string {
    return [navn.fornavn, navn.mellomnavn, navn.etternavn].filter(Boolean).join(' ');
}
