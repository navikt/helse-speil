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
        <Box paddingBlock="6" width="460px">
            <HStack paddingInline="2 0" paddingBlock="0 1">
                <Heading size="small">Legg til periode</Heading>
            </HStack>
            <Box
                background="surface-subtle"
                paddingBlock="4 4"
                paddingInline="2 0"
                borderWidth="0 0 0 3"
                borderColor="border-action"
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
                background="surface-subtle"
                paddingInline="10"
                paddingBlock="6 0"
                borderWidth="0 0 0 3"
                borderColor="border-action"
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
