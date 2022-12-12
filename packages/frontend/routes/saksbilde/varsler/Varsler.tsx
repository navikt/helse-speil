import React from 'react';

import { EkspanderbartVarsel } from '@components/EkspanderbartVarsel';
import { VarselDto } from '@io/graphql';

import { Varsel } from './Varsel';
import { Varselseksjon } from './Varselseksjon';

interface VarslerProps {
    varsler: Array<VarselDto>;
}

export const Varsler: React.FC<VarslerProps> = React.memo(({ varsler }) => {
    const varslerSomIkkeSkalVises = ['SB_EX_2'];
    const varslerSomSkalVisesSomFeil = ['RV_IV_2'];

    return (
        <>
            {varsler
                .filter((it) => !varslerSomIkkeSkalVises.includes(it.kode))
                .map((varsel, index) => {
                    if (varsel.forklaring != null && varsel.handling != null) {
                        const visSomFeil = varslerSomSkalVisesSomFeil.includes(varsel.kode);
                        return (
                            <EkspanderbartVarsel
                                key={index}
                                label={varsel.tittel}
                                type={visSomFeil ? 'error' : 'warning'}
                            >
                                <Varselseksjon tittel="Hva betyr det?">{varsel.forklaring}</Varselseksjon>
                                <Varselseksjon tittel="Hva gjør du?">{varsel.handling}</Varselseksjon>
                            </EkspanderbartVarsel>
                        );
                    } else {
                        return <Varsel varsel={varsel} key={index} />;
                    }
                })}
        </>
    );
});
