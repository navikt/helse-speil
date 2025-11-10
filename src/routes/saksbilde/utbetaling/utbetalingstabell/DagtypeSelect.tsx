import React, { ReactElement } from 'react';
import { useController } from 'react-hook-form';

import { BodyShort, HelpText, Select, VStack } from '@navikt/ds-react';

import styles from '@saksbilde/utbetaling/utbetalingstabell/endringForm/EndringForm.module.css';
import {
    overstyringsdagtyperArbeidstaker,
    overstyringsdagtyperSelvstendig,
    typeendringerAndreYtelser,
} from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endringFormUtils';

interface DagtypeSelecProps {
    name: string;
    erSelvstendig: boolean;
    className?: string;
    hideError?: boolean;
}

export function DagtypeSelect({ name, erSelvstendig, className, hideError = false }: DagtypeSelecProps): ReactElement {
    const { field, fieldState } = useController({ name });
    const overstyringsdagtyper = erSelvstendig ? overstyringsdagtyperSelvstendig : overstyringsdagtyperArbeidstaker;

    return (
        <>
            <Select
                size="small"
                label={<DagtypevelgerLabel erSelvstendig={erSelvstendig} />}
                error={hideError ? fieldState.error?.message != undefined : fieldState.error?.message}
                data-testid="dagtypevelger"
                className={className}
                {...field}
            >
                <>
                    {overstyringsdagtyper.map((dag) => (
                        <option key={dag.speilDagtype} value={dag.speilDagtype}>
                            {dag.visningstekst}
                        </option>
                    ))}
                    <option disabled>-- Andre ytelser --</option>
                    {typeendringerAndreYtelser.map((dag) => (
                        <option key={dag.speilDagtype} value={dag.speilDagtype}>
                            {dag.visningstekst}
                        </option>
                    ))}
                </>
            </Select>
        </>
    );
}

function DagtypevelgerLabel({ erSelvstendig }: { erSelvstendig: boolean }) {
    return (
        <span className={styles.dagtypelabel}>
            Dagtype&nbsp;
            {!erSelvstendig && (
                <HelpText title="Forklaring av dagtyper">
                    <VStack gap="space-16">
                        <VStack>
                            <BodyShort weight="semibold">Syk (NAV)</BodyShort>
                            <BodyShort>NAV skal betale alle eller noen av de første 16 dagene</BodyShort>
                        </VStack>
                        <VStack>
                            <BodyShort weight="semibold">Ferie</BodyShort>
                            <BodyShort>Bruker tok ferie i sykmeldingsperioden</BodyShort>
                        </VStack>
                        <VStack>
                            <BodyShort weight="semibold">Arbeid ikke gjenopptatt</BodyShort>
                            <BodyShort>
                                Bruker tok ferie uten sykmelding
                                <br />
                                Bruker tok turnusfri
                                <br />
                                Brukers stillingsandel ikke fullt gjenopptatt
                            </BodyShort>
                        </VStack>
                        <VStack>
                            <BodyShort weight="semibold">Egenmelding</BodyShort>
                            <BodyShort>Bruker hadde egenmeldt sykefravær</BodyShort>
                        </VStack>
                        <VStack>
                            <BodyShort weight="semibold">Permisjon</BodyShort>
                            <BodyShort>Bruker hadde permisjon</BodyShort>
                        </VStack>
                        <VStack>
                            <BodyShort weight="semibold">Arbeid</BodyShort>
                            <BodyShort>Bruker var i arbeid</BodyShort>
                        </VStack>
                    </VStack>
                </HelpText>
            )}
        </span>
    );
}
