import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { XMarkIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack, Heading, Radio, RadioGroup } from '@navikt/ds-react';

import { LeggTilAndreYtelser } from '@saksbilde/leggTilPeriode/andreytelser/LeggTilAndreYtelser';
import { LeggTilTilkommenInntektViewNy } from '@saksbilde/leggTilPeriode/tilkommenInntektNy/LeggTilTilkommenInntektViewNy';

export const LeggTilPeriodeRadiobuttons = () => {
    const [valg, setValg] = useState('');
    const router = useRouter();

    return (
        <Box paddingBlock="space-24" width="460px">
            <HStack paddingInline="space-8 space-0" paddingBlock="space-0 space-4">
                <Heading size="small">Legg til periode</Heading>
            </HStack>
            <Box
                background="neutral-soft"
                paddingBlock="space-16 space-16"
                paddingInline="space-8 space-0"
                borderWidth="0 0 0 3"
                borderColor="accent"
                height="2.5rem"
            >
                <Button
                    icon={<XMarkIcon />}
                    size="xsmall"
                    variant="tertiary"
                    type="button"
                    onClick={() => router.back()}
                >
                    Avbryt
                </Button>
            </Box>
            <Box
                background="neutral-soft"
                paddingInline="space-40"
                paddingBlock="space-24 space-0"
                borderWidth="0 0 0 3"
                borderColor="accent"
            >
                <RadioGroup legend="Legg til" value={valg} onChange={(value) => setValg(value)}>
                    <Radio size="small" value="tilkommeninntekt">
                        Tilkommen inntekt
                    </Radio>
                    <Radio size="small" value="andreytelser">
                        Annen ytelse
                    </Radio>
                </RadioGroup>
            </Box>
            {valg === 'tilkommeninntekt' && <LeggTilTilkommenInntektViewNy />}
            {valg === 'andreytelser' && <LeggTilAndreYtelser />}
        </Box>
    );
};
