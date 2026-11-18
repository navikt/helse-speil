import React, { ReactElement } from 'react';

import { Skeleton, VStack } from '@navikt/ds-react';

import { ApiSaksbildeVarselstatus, ApiVarselDTO, ApiVarselvurderingDTO } from '@io/rest/generated/spesialist.schemas';
import { useSkalViseUnder20SykdomsgradsvarselSomFeil } from '@saksbilde/varsler/useSkalViseUnder20Sykdomsgradsvarsel';
import { cn } from '@utils/tw';

import { Varsel, varselfarge } from './Varsel';
import { VarselMedHandling } from './VarselMedHandling';
import { useSkalViseAvviksvarselSomFeil } from './useSkalViseAvviksvarselSomFeil';
import { useSkalViseMedlemskapsvarselSomFeil } from './useSkalViseMedlemskapsvarselSomFeil';

const finnType = (varselvurdering: ApiVarselvurderingDTO | null | undefined) => {
    if (!varselvurdering) return 'aktiv';
    switch (varselvurdering.status) {
        case ApiSaksbildeVarselstatus.VURDERT:
            return 'vurdert';
        case ApiSaksbildeVarselstatus.GODKJENT:
            return 'ferdig-behandlet';
        case ApiSaksbildeVarselstatus.AVVIST:
        case ApiSaksbildeVarselstatus.AKTIV:
            return 'aktiv';
    }
};
const byKode = (a: ApiVarselDTO, b: ApiVarselDTO) => {
    if (a.kode > b.kode) return 1;
    if (a.kode < b.kode) return -1;
    return 0;
};

export type VarselstatusType = 'feil' | 'aktiv' | 'vurdert' | 'ferdig-behandlet';

interface VarslerProps {
    varsler: ApiVarselDTO[];
}

export const Varsler = React.memo(({ varsler }: VarslerProps): ReactElement => {
    const skalViseAvviksvarselSomFeil = useSkalViseAvviksvarselSomFeil();
    const skalViseUnder20SykdomsgradsvarselSomFeil = useSkalViseUnder20SykdomsgradsvarselSomFeil();
    const medlemskapsvarselvisning = useSkalViseMedlemskapsvarselSomFeil();

    const varslerSomIkkeSkalVises = ['SB_EX_2'];
    const avviksvarsel = 'RV_IV_2';
    const under20Sykdomsgradsvarsel = 'RV_VV_4';
    const medlemskapsvarsel = 'RV_MV_1';

    const synligeVarsler = varsler.filter((it) => !varslerSomIkkeSkalVises.includes(it.kode)).sort(byKode);
    const venterPåMedlemskapsstatus =
        medlemskapsvarselvisning.henterStatus &&
        synligeVarsler.some((it) => it.kode === medlemskapsvarsel && finnType(it.vurdering) !== 'ferdig-behandlet');

    if (venterPåMedlemskapsstatus) {
        return (
            <VStack gap="space-2" aria-busy="true">
                {synligeVarsler.map((varsel) => (
                    <Skeleton key={varsel.id} variant="rectangle" height={72} />
                ))}
            </VStack>
        );
    }

    return (
        <>
            {synligeVarsler.map((varsel, index) => {
                const type = finnType(varsel.vurdering);
                if (varsel.forklaring != null && varsel.handling != null) {
                    const visSomFeil =
                        (varsel.kode === avviksvarsel && skalViseAvviksvarselSomFeil) ||
                        (varsel.kode === under20Sykdomsgradsvarsel &&
                            skalViseUnder20SykdomsgradsvarselSomFeil &&
                            type !== 'ferdig-behandlet') ||
                        (varsel.kode === medlemskapsvarsel &&
                            medlemskapsvarselvisning.skalViseSomFeil &&
                            type !== 'ferdig-behandlet');
                    return <VarselMedHandling key={index} varsel={varsel} type={visSomFeil ? 'feil' : type} />;
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
