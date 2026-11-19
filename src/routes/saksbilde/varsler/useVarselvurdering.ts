import { ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { getVarsel, useDeleteVarselvurdering, usePutVarselvurdering } from '@io/rest/generated/varsler/varsler';
import { mapPerioder, useOppdaterPersonICache } from '@state/person';

export type Varselvurdering = {
    settVurdert: () => void;
    settAktiv: () => void;
    lagrer: boolean;
    feilmelding?: string;
};

export function useVarselvurdering(varsel: ApiVarselDTO): Varselvurdering {
    const oppdaterPersonICache = useOppdaterPersonICache();

    async function hentOppdatertVarsel() {
        const data = await getVarsel(varsel.id);
        const vurdering = data.vurdering
            ? { ident: data.vurdering.ident, status: data.status, tidsstempel: data.vurdering.tidsstempel }
            : null;
        oppdaterPersonICache((person) =>
            mapPerioder(person, (periode) => ({
                ...periode,
                varsler: periode.varsler.map((it) => (it.id === varsel.id ? { ...it, vurdering } : it)),
            })),
        );
    }

    const putVarselvurdering = usePutVarselvurdering({ mutation: { onSuccess: hentOppdatertVarsel } });
    const deleteVarselvurdering = useDeleteVarselvurdering({ mutation: { onSuccess: hentOppdatertVarsel } });
    const feilstatus = (putVarselvurdering.error ?? deleteVarselvurdering.error)?.status;

    return {
        settVurdert: () =>
            putVarselvurdering.mutate({ varselId: varsel.id, data: { definisjonId: varsel.definisjonId } }),
        settAktiv: () => deleteVarselvurdering.mutate({ varselId: varsel.id }),
        lagrer: putVarselvurdering.isPending || deleteVarselvurdering.isPending,
        feilmelding: feilstatus ? feilmelding(feilstatus) : undefined,
    };
}

function feilmelding(feilkode: number) {
    switch (feilkode) {
        case 404:
            return 'Varselet finnes ikke lenger. Oppdater siden (F5).';
        case 409:
            return 'Varselet har allerede endret status. Oppdater siden (F5).';
        default:
            return `Det har skjedd en feil. Prøv igjen senere eller kontakt en utvikler. (Feilkode: ${feilkode})`;
    }
}
