import React, { useState } from 'react';

import { XMarkIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, Heading, VStack } from '@navikt/ds-react';

import { LeggTilDagerForm } from '@saksbilde/utbetaling/utbetalingstabell/LeggTilDagerForm';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

interface OverstyringToolBarProps {
    toggleOverstyring: () => void;
    onSubmitPølsestrekk: (dagerLagtTil: Map<string, Utbetalingstabelldag>) => void;
    kanStrekkes: boolean;
    periodeFom: DateString;
    erRevurdering: boolean;
    erSelvstendig: boolean;
}

export const OverstyringToolBar = ({
    toggleOverstyring,
    onSubmitPølsestrekk,
    kanStrekkes,
    periodeFom,
    erRevurdering,
    erSelvstendig,
}: OverstyringToolBarProps) => {
    const [visLeggTilDagerForm, setVisLeggTilDagerForm] = useState(false);

    return (
        <Box marginInline="space-24">
            <HStack paddingBlock="space-0 space-16" gap="space-8">
                <Heading size="small">{erRevurdering ? 'Revurder' : 'Endre'} dager</Heading>
                <Button
                    size="xsmall"
                    variant="tertiary"
                    icon={<XMarkIcon />}
                    onClick={() => {
                        toggleOverstyring();
                        setVisLeggTilDagerForm(false);
                    }}
                >
                    Avbryt
                </Button>
            </HStack>
            {kanStrekkes && !visLeggTilDagerForm && (
                <Button size="xsmall" variant="tertiary" onClick={() => setVisLeggTilDagerForm(true)}>
                    + Legg til dager i tabellen
                </Button>
            )}
            {visLeggTilDagerForm && (
                <VStack gap="space-16" align="start">
                    <LeggTilDagerForm
                        onSubmitPølsestrekk={onSubmitPølsestrekk}
                        periodeFom={periodeFom}
                        erSelvstendig={erSelvstendig}
                    />
                    <Button size="xsmall" variant="tertiary" onClick={() => setVisLeggTilDagerForm(false)}>
                        Lukk legg til dager
                    </Button>
                </VStack>
            )}
        </Box>
    );
};
