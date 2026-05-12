import { ApiBehandler, ApiBehandlerKategori, ApiBehandlerType } from '@io/rest/generated/sporhund.schemas';

import { IsyfoBehandler } from './useBehandlerSearch';

const validKategorier = new Set<string>(Object.values(ApiBehandlerKategori));
const validTyper = new Set<string>(Object.values(ApiBehandlerType));

function castKategori(kategori: string): ApiBehandlerKategori {
    if (!validKategorier.has(kategori)) {
        throw new Error(`Ugyldig behandlerkategori: "${kategori}"`);
    }
    return kategori as ApiBehandlerKategori;
}

function castType(type: string | null): ApiBehandlerType | null {
    if (type === null) return null;
    if (!validTyper.has(type)) {
        throw new Error(`Ugyldig behandlertype: "${type}"`);
    }
    return type as ApiBehandlerType;
}

export function isyfoBehandlerToApiBehandler(b: IsyfoBehandler): ApiBehandler {
    return {
        id: b.behandlerRef,
        kategori: castKategori(b.kategori),
        navn: {
            fornavn: b.fornavn,
            etternavn: b.etternavn,
            mellomnavn: b.mellomnavn,
        },
        legekontor: {
            kontor: b.kontor,
            orgnummer: b.orgnummer,
            adresse: b.adresse,
        },
        telefonnummer: b.telefon,
        type: castType(b.type),
    };
}
