import React, { ReactElement } from 'react';

import { BodyShort, HelpText, Select, VStack } from '@navikt/ds-react';

import styles from '@saksbilde/utbetaling/utbetalingstabell/endringForm/EndringForm.module.css';
import {
    OverstyrbarDagtype,
    alleTypeendringer,
    overstyringsdagtyperArbeidstaker,
    overstyringsdagtyperSelvstendig,
    typeendringerAndreYtelser,
} from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endringFormUtils';

interface DagtypeSelectProps {
    errorMessage?: string;
    clearErrors: () => void;
    setType: (type: OverstyrbarDagtype) => void;
    erSelvstendig: boolean;
}

export const DagtypeSelect = ({
    errorMessage,
    clearErrors,
    setType,
    erSelvstendig,
}: DagtypeSelectProps): ReactElement => {
    const oppdaterDagtype = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (alleTypeendringer.map((dag) => dag.speilDagtype).includes(event.target.value as OverstyrbarDagtype)) {
            clearErrors();
            const type = event.target.value as OverstyrbarDagtype;
            setType(type);
        }
    };
    const overstyringsdagtyper = erSelvstendig ? overstyringsdagtyperSelvstendig : overstyringsdagtyperArbeidstaker;

    return (
        <>
            <Select
                className={styles.Dagtypevelger}
                size="small"
                label={
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
                }
                onChange={oppdaterDagtype}
                error={errorMessage ? <>{errorMessage}</> : null}
                data-testid="dagtypevelger"
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
};
