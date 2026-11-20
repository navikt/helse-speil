import { ReactElement } from 'react';

import { BodyShort, HStack, Loader, VStack } from '@navikt/ds-react';

import { ApiSaksbildeVarselstatus, ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { getFormattedDatetimeString } from '@utils/date';

import { useVarselvurdering } from '../useVarselvurdering';
import { VarselstatusType } from '../varselstatus';
import { Avhuking } from './Avhuking';

interface VarselProps {
    className?: string;
    varsel: ApiVarselDTO;
    type: VarselstatusType;
    laster?: boolean;
}

export function Varsel({ className, varsel, type, laster = false }: VarselProps): ReactElement {
    const varselVurdering = varsel.vurdering;
    const varselStatus = varselVurdering?.status ?? ApiSaksbildeVarselstatus.AKTIV;
    const { settVurdert, settAktiv, lagrer, feilmelding } = useVarselvurdering(varsel);

    return (
        <HStack align="center" gap="space-4" wrap={false} className={className}>
            <HStack
                data-ikke-ekspander
                align="center"
                paddingInline="space-24 space-16"
                className="cursor-default self-stretch"
            >
                {lagrer || laster ? (
                    <Loader size="medium" variant="interaction" />
                ) : (
                    <Avhuking
                        type={type}
                        varselstatus={varselStatus}
                        settVarselstatusAktiv={settAktiv}
                        settVarselstatusVurdert={settVurdert}
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
                {feilmelding && <BodyShort className="text-ax-text-danger-subtle">{feilmelding}</BodyShort>}
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
