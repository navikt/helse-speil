import { ReactElement, useState } from 'react';

import { BodyShort, Button, VStack } from '@navikt/ds-react';

import {
    dagenEllerDagene,
    dagerAvslåttForSenMeldingTilNav,
    somDagliste,
} from '@saksbilde/utbetaling/utbetalingstabell/oppholdskravSperrer';
import { useKanVurdereOppholdskrav } from '@state/toggles';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import { OppholdskravDialog } from './OppholdskravDialog';

interface VurderOppholdskravProps {
    personPseudoId: string;
    behandlingId: string;
    markerteDager: Map<string, Utbetalingstabelldag>;
    harUsendteEndringer: boolean;
}

export function VurderOppholdskrav({
    personPseudoId,
    behandlingId,
    markerteDager,
    harUsendteEndringer,
}: VurderOppholdskravProps): ReactElement | null {
    const [visSkjema, setVisSkjema] = useState(false);
    const kanVurdereOppholdskrav = useKanVurdereOppholdskrav();

    if (!kanVurdereOppholdskrav) return null;

    const dager = Array.from(markerteDager.values());
    const sperre = finnSperre(dager, harUsendteEndringer);

    return (
        <VStack gap="space-4" paddingInline="space-32" align="start">
            <Button size="small" variant="secondary" disabled={sperre !== undefined} onClick={() => setVisSkjema(true)}>
                Vurder oppholdskrav
            </Button>
            {sperre && <BodyShort size="small">{sperre}</BodyShort>}
            {visSkjema && (
                <OppholdskravDialog
                    personPseudoId={personPseudoId}
                    behandlingId={behandlingId}
                    dager={dager.map((dag) => dag.dato)}
                    onLukk={() => setVisSkjema(false)}
                />
            )}
        </VStack>
    );
}

function finnSperre(dager: Utbetalingstabelldag[], harUsendteEndringer: boolean): string | undefined {
    if (harUsendteEndringer) return 'Send eller forkast endringene av dager før du vurderer oppholdskravet.';
    if (dager.length === 0) return 'Marker dagene som skal vurderes.';
    const avslåtteDager = dagerAvslåttForSenMeldingTilNav(dager);
    if (avslåtteDager.length > 0)
        return `En dag kan bare ha én avslagsårsak. ${somDagliste(avslåtteDager.map((dag) => dag.dato))} er avslått fordi melding til Nav kom for sent. Endre ${dagenEllerDagene(avslåtteDager.length)} før du vurderer oppholdskravet.`;
    return undefined;
}
