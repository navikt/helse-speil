import { Fragment, ReactElement } from 'react';

import { Box, Button, HStack, HelpText, VStack } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { useErCoachFagkoordinatorEllerSupersaksbehandler } from '@hooks/brukerrolleHooks';
import { InntektsforholdReferanse } from '@state/inntektsforhold/inntektsforhold';
import { useKanVurdereOppholdskrav } from '@state/toggles';

export type Endringshandling = 'Legg til dager' | 'Endre dagtype' | 'Legg til graderte ytelser' | 'Vurder oppholdskrav';

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
    const skalSeGraderteAndreYtelser = useErCoachFagkoordinatorEllerSupersaksbehandler();
    const kanVurdereOppholdskrav = useKanVurdereOppholdskrav();
    const endringshandlinger = [
        kanLeggeTilDager && 'Legg til dager',
        'Endre dagtype',
        skalSeGraderteAndreYtelser && 'Legg til graderte ytelser',
        kanVurdereOppholdskrav && 'Vurder oppholdskrav',
    ].filter((handling): handling is Endringshandling => handling !== false);

    return (
        <Box
            background="neutral-soft"
            borderWidth="0 0 1 0"
            borderColor="neutral-subtle"
            paddingInline="space-20"
            paddingBlock="space-12"
        >
            <VStack gap="space-4">
                <Inntektsforholdnavn
                    inntektsforholdReferanse={inntektsforholdReferanse}
                    weight="semibold"
                    size="medium"
                />
                {periodeErForkastet ? (
                    <HelpText>Kan ikke revurdere perioden på grunn av manglende datagrunnlag</HelpText>
                ) : (
                    <HStack gap="space-4">
                        {endringshandlinger.map((handling, index) => (
                            <Fragment key={`handling-${index}`}>
                                {index > 0 && <Box borderWidth="0 0 0 1" borderColor="neutral-subtle" aria-hidden />}
                                <Button size="small" variant="tertiary" onClick={() => velgEndringshandling(handling)}>
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
