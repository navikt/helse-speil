import React, { ReactElement } from 'react';

import { Skeleton, VStack } from '@navikt/ds-react';

import { ApiVarselDTO } from '@io/rest/generated/spesialist.schemas';
import { useSkalViseUnder20SykdomsgradsvarselSomFeil } from '@saksbilde/varsler/useSkalViseUnder20Sykdomsgradsvarsel';
import { cn } from '@utils/tw';

import { Varsel, varselfarge } from './Varsel';
import { VarselMedHandling } from './VarselMedHandling';
import { useSkalViseAvviksvarselSomFeil } from './useSkalViseAvviksvarselSomFeil';
import { useSkalViseMedlemskapsvarselSomFeil } from './useSkalViseMedlemskapsvarselSomFeil';
import { VisSomFeilRegler, finnVarselstatus, medlemskapsvarsel, synligeVarsler } from './varselstatus';

interface VarslerProps {
    varsler: ApiVarselDTO[];
}

export const Varsler = React.memo(({ varsler }: VarslerProps): ReactElement => {
    const skalViseAvviksvarselSomFeil = useSkalViseAvviksvarselSomFeil();
    const skalViseUnder20SykdomsgradsvarselSomFeil = useSkalViseUnder20SykdomsgradsvarselSomFeil();
    const medlemskapsvarselvisning = useSkalViseMedlemskapsvarselSomFeil();

    const visSomFeil: VisSomFeilRegler = {
        avviksvarsel: skalViseAvviksvarselSomFeil,
        under20Sykdomsgradsvarsel: skalViseUnder20SykdomsgradsvarselSomFeil,
        medlemskapsvarsel: medlemskapsvarselvisning.skalViseSomFeil,
    };
    const varslerSomVises = synligeVarsler(varsler);
    const venterPåMedlemskapsstatus =
        medlemskapsvarselvisning.henterStatus &&
        varslerSomVises.some(
            (it) => it.kode === medlemskapsvarsel && finnVarselstatus(it, visSomFeil) !== 'ferdig-behandlet',
        );

    if (venterPåMedlemskapsstatus) {
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
