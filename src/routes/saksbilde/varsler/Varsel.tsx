import React, { ReactElement } from 'react';

import { BodyShort, HStack, Loader, VStack } from '@navikt/ds-react';

import { ApiSaksbildeVarselstatus, ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { getVarsel, useDeleteVarselvurdering, usePutVarselvurdering } from '@io/rest/generated/varsler/varsler';
import { mapPerioder, useOppdaterPersonICache } from '@state/person';
import { getFormattedDatetimeString } from '@utils/date';

import { Avhuking } from './Avhuking';
import { VarselstatusType } from './Varsler';

interface VarselProps {
    className?: string;
    varsel: ApiVarselDTO;
    type: VarselstatusType;
}

export function Varsel({ className, varsel, type }: VarselProps): ReactElement {
    const varselVurdering = varsel.vurdering;
    const varselStatus = varselVurdering?.status ?? ApiSaksbildeVarselstatus.AKTIV;
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
    const isLoading = putVarselvurdering.isPending || deleteVarselvurdering.isPending;
    const feilstatus = (putVarselvurdering.error ?? deleteVarselvurdering.error)?.status;

    return (
        <HStack align="center" gap="space-4" className={className}>
            <HStack
                data-ikke-ekspander
                align="center"
                paddingInline="space-24 space-16"
                className="cursor-default self-stretch"
            >
                {isLoading ? (
                    <Loader size="medium" variant="interaction" />
                ) : (
                    <Avhuking
                        type={type}
                        varselstatus={varselStatus}
                        settVarselstatusAktiv={() => deleteVarselvurdering.mutate({ varselId: varsel.id })}
                        settVarselstatusVurdert={() =>
                            putVarselvurdering.mutate({
                                varselId: varsel.id,
                                data: { definisjonId: varsel.definisjonId },
                            })
                        }
                    />
                )}
            </HStack>
            <VStack justify="center" className="min-h-12">
                <BodyShort className="text-ax-text-neutral">{varsel.tittel}</BodyShort>
                {(varselStatus === ApiSaksbildeVarselstatus.VURDERT ||
                    varselStatus === ApiSaksbildeVarselstatus.GODKJENT) && (
                    <BodyShort className="text-ax-text-neutral-subtle">
                        {getFormattedDatetimeString(varselVurdering?.tidsstempel)} av{' '}
                        <span data-sensitive>{varselVurdering?.ident}</span>
                    </BodyShort>
                )}
                {feilstatus && <BodyShort className="text-ax-text-danger-subtle">{feilmelding(feilstatus)}</BodyShort>}
            </VStack>
        </HStack>
    );
}

export const varselfarge: Record<VarselstatusType, string> = {
    aktiv: 'bg-ax-bg-warning-soft border-ax-border-warning',
    vurdert: 'bg-ax-bg-success-soft border-ax-border-success',
    'ferdig-behandlet': 'bg-ax-bg-neutral-soft border-ax-border-success',
    feil: 'bg-ax-bg-danger-soft border-ax-border-danger',
};

function feilmelding(feilkode: number): string {
    switch (feilkode) {
        case 404:
            return 'Varselet finnes ikke lenger. Oppdater siden (F5).';
        case 409:
            return 'Varselet har allerede endret status. Oppdater siden (F5).';
        default:
            return `Det har skjedd en feil. Prøv igjen senere eller kontakt en utvikler. (Feilkode: ${feilkode})`;
    }
}
