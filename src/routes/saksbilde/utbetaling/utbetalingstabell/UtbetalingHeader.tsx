import { ReactElement } from 'react';

import { Box, Button, HStack, HelpText, VStack } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { InntektsforholdReferanse } from '@state/inntektsforhold/inntektsforhold';

import styles from './UtbetalingHeader.module.css';

export type Endringshandling = 'Legg til dager' | 'Endre dagtype';

interface UtbetalingHeaderProps {
    periodeErForkastet: boolean;
    velgEndringshandling: (handling: Endringshandling) => void;
    kanLeggeTilDager: boolean;
    inntektsforholdReferanse: InntektsforholdReferanse;
}

export const UtbetalingHeader = ({
    periodeErForkastet,
    velgEndringshandling,
    kanLeggeTilDager,
    inntektsforholdReferanse,
}: UtbetalingHeaderProps): ReactElement | null => (
    <Box
        background="neutral-soft"
        borderWidth="1"
        borderColor="neutral-subtle"
        paddingInline="space-20"
        paddingBlock="space-12"
    >
        <VStack gap="space-4">
            <Inntektsforholdnavn
                inntektsforholdReferanse={inntektsforholdReferanse}
                weight="semibold"
                className={styles.mediumFontSize}
            />
            {periodeErForkastet ? (
                <HelpText>Kan ikke revurdere perioden på grunn av manglende datagrunnlag</HelpText>
            ) : (
                <HStack gap="space-4">
                    {kanLeggeTilDager && (
                        <>
                            <Button
                                size="xsmall"
                                variant="tertiary"
                                onClick={() => velgEndringshandling('Legg til dager')}
                            >
                                Legg til dager
                            </Button>
                            <Box borderWidth="0 0 0 1" borderColor="neutral-subtle" aria-hidden />
                        </>
                    )}
                    <Button size="xsmall" variant="tertiary" onClick={() => velgEndringshandling('Endre dagtype')}>
                        Endre dagtype
                    </Button>
                </HStack>
            )}
        </VStack>
    </Box>
);
