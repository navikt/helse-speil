import React, { ReactElement } from 'react';

import { Skeleton, VStack } from '@navikt/ds-react';

import { ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { cn } from '@utils/tw';

import { useVisSomFeilRegler } from '../useVisSomFeilRegler';
import { finnVarselstatus, synligeVarsler, venterPåMedlemskapsstatus } from '../varselstatus';
import { Varsel, varselfarge } from './Varsel';
import { VarselMedHandling } from './VarselMedHandling';

interface VarslerProps {
    varsler: ApiVarselDTO[];
}

export const Varsler = React.memo(({ varsler }: VarslerProps): ReactElement => {
    const { visSomFeil, henterMedlemskapsstatus } = useVisSomFeilRegler();

    const varslerSomVises = synligeVarsler(varsler);
    if (venterPåMedlemskapsstatus(varslerSomVises, visSomFeil, henterMedlemskapsstatus)) {
        return (
            <VStack gap="space-2" aria-busy="true">
                {varslerSomVises.map((varsel) => (
                    <Skeleton key={varsel.id} variant="rectangle" height={72} />
                ))}
            </VStack>
        );
    }

    return (
        <>
            {varslerSomVises.map((varsel, index) => {
                const type = finnVarselstatus(varsel, visSomFeil);
                if (varsel.forklaring != null && varsel.handling != null) {
                    return <VarselMedHandling key={index} varsel={varsel} type={type} />;
                } else {
                    return (
                        <Varsel
                            className={cn('border-b py-1 pe-4', varselfarge[type])}
                            key={index}
                            varsel={varsel}
                            type={type}
                        />
                    );
                }
            })}
        </>
    );
});

Varsler.displayName = 'Varsler';
