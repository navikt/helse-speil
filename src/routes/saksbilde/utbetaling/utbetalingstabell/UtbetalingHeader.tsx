import { Fragment, ReactElement } from 'react';

import { Box, Button, HStack, HelpText, VStack } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { InntektsforholdReferanse } from '@state/inntektsforhold/inntektsforhold';
import { useSkalSeGraderteAndreYtelser } from '@utils/featureToggles';

import styles from './UtbetalingHeader.module.css';

export type Endringshandling = 'Legg til dager' | 'Endre dagtype' | 'Legg til graderte ytelser';

interface UtbetalingHeaderProps {
    periodeErForkastet: boolean;
    velgEndringshandling: (handling: Endringshandling) => void;
    kanLeggeTilDager: boolean;
    inntektsforholdReferanse: InntektsforholdReferanse;
}

export function UtbetalingHeader({
    periodeErForkastet,
    velgEndringshandling,
    kanLeggeTilDager,
    inntektsforholdReferanse,
}: UtbetalingHeaderProps): ReactElement {
    const skalSeGraderteAndreYtelser = useSkalSeGraderteAndreYtelser();
    const endringshandlinger = [
        kanLeggeTilDager && 'Legg til dager',
        'Endre dagtype',
        skalSeGraderteAndreYtelser && 'Legg til graderte ytelser',
    ].filter((handling): handling is Endringshandling => handling !== false);

    return (
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
                        {endringshandlinger.map((handling, index) => (
                            <Fragment key={handling}>
                                {index > 0 && <Box borderWidth="0 0 0 1" borderColor="neutral-subtle" aria-hidden />}
                                <Button size="xsmall" variant="tertiary" onClick={() => velgEndringshandling(handling)}>
                                    {handling}
                                </Button>
                            </Fragment>
                        ))}
                    </HStack>
                )}
            </VStack>
        </Box>
    );
}
