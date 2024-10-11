import React, { useState } from 'react';

import { PadlockUnlockedIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, Heading, VStack } from '@navikt/ds-react';

import { LeggTilDagerForm } from '@saksbilde/utbetaling/utbetalingstabell/LeggTilDager';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

interface OverstyringToolBarProps {
    toggleOverstyring: () => void;
    onSubmitPølsestrekk: (dagerLagtTil: Map<string, Utbetalingstabelldag>) => void;
    setVisDagtypeModal: () => void;
    erFørstePeriodePåSkjæringstidspunkt: boolean;
    periodeFom: DateString;
}

export const OverstyringToolBar = ({
    toggleOverstyring,
    onSubmitPølsestrekk,
    setVisDagtypeModal,
    erFørstePeriodePåSkjæringstidspunkt,
    periodeFom,
}: OverstyringToolBarProps) => {
    const [visLeggTilDagerForm, setVisLeggTilDagerForm] = useState(false);

    return (
        <Box marginInline="6">
            <HStack paddingBlock="0 4" gap="2">
                <Heading size="small">Overstyr dager</Heading>
                <Button
                    size="xsmall"
                    variant="tertiary"
                    icon={<PadlockUnlockedIcon fontSize="1.5rem" />}
                    onClick={() => {
                        toggleOverstyring();
                        setVisLeggTilDagerForm(false);
                    }}
                >
                    Avbryt
                </Button>
            </HStack>
            {erFørstePeriodePåSkjæringstidspunkt && !visLeggTilDagerForm && (
                <Button size="xsmall" variant="tertiary" onClick={() => setVisLeggTilDagerForm(true)}>
                    + Legg til dager i tabellen
                </Button>
            )}
            {visLeggTilDagerForm && (
                <VStack gap="4" align="start">
                    <LeggTilDagerForm
                        onSubmitPølsestrekk={onSubmitPølsestrekk}
                        periodeFom={periodeFom}
                        setVisDagtypeModal={setVisDagtypeModal}
                    />
                    <Button size="xsmall" variant="tertiary" onClick={() => setVisLeggTilDagerForm(false)}>
                        Lukk legg til dager
                    </Button>
                </VStack>
            )}
        </Box>
    );
};
