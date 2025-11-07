import React, { ReactElement } from 'react';
import { Control, useController } from 'react-hook-form';

import { BodyShort, HelpText, Select, VStack } from '@navikt/ds-react';

import { LeggTilDagerFormFields } from '@/form-schemas/leggTilDagerSkjema';
import styles from '@saksbilde/utbetaling/utbetalingstabell/endringForm/EndringForm.module.css';
import {
    OverstyrbarDagtype,
    alleTypeendringer,
    overstyringsdagtyperArbeidstaker,
    overstyringsdagtyperSelvstendig,
    typeendringerAndreYtelser,
} from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endringFormUtils';

interface DagtypeSelecProps {
    erSelvstendig: boolean;
    control: Control<LeggTilDagerFormFields>;
}

export function DagtypeSelect({ erSelvstendig, control }: DagtypeSelecProps): ReactElement {
    const { field, fieldState } = useController({ control: control, name: 'dag' });
    const overstyringsdagtyper = erSelvstendig ? overstyringsdagtyperSelvstendig : overstyringsdagtyperArbeidstaker;

    return (
        <>
            <Select
                size="small"
                label={<DagtypevelgerLabel erSelvstendig={erSelvstendig} />}
                error={fieldState.error?.message}
                data-testid="dagtypevelger"
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

interface DagtypeSelectOldProps {
    errorMessage?: string;
    clearErrors: () => void;
    setType: (type: OverstyrbarDagtype) => void;
    erSelvstendig: boolean;
}

export const DagtypeSelectOld = ({
    errorMessage,
    clearErrors,
    setType,
    erSelvstendig,
}: DagtypeSelectOldProps): ReactElement => {
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
                label={<DagtypevelgerLabel erSelvstendig={erSelvstendig} />}
                onChange={oppdaterDagtype}
                error={errorMessage}
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
