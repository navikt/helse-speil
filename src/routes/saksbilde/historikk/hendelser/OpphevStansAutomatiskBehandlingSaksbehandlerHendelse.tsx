import React, { ReactElement } from 'react';

import { VStack } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { PeriodehistorikkType } from '@io/graphql';
import { Expandable } from '@saksbilde/historikk/komponenter/Expandable';
import { HistorikkTimerPauseIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { HendelseKommentarSeksjon } from '@saksbilde/historikk/komponenter/kommentarer/hendelse/HendelseKommentarSeksjon';
import { HistorikkhendelseObject } from '@typer/historikk';

type OpphevStansAutomatiskBehandlingSaksbehandlerHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export function OpphevStansAutomatiskBehandlingSaksbehandlerHendelse({
    timestamp,
    saksbehandler,
    notattekst,
    dialogRef,
    kommentarer,
    historikkinnslagId,
}: OpphevStansAutomatiskBehandlingSaksbehandlerHendelseProps): ReactElement {
    const førsteTekstlinje = notattekst?.split(/\r?\n/, 1)[0];
    const øvrigeTekstlinjer = notattekst?.slice(førsteTekstlinje!.length)?.trim();

    return (
        <Historikkhendelse
            icon={<HistorikkTimerPauseIkon />}
            title="Stans av automatisk behandling opphevet"
            timestamp={timestamp}
            saksbehandler={saksbehandler ?? undefined}
        >
            {notattekst && (
                <VStack gap="space-0">
                    {førsteTekstlinje}
                    {øvrigeTekstlinjer !== '' && (
                        <Expandable>
                            <BodyShortWithPreWrap>{øvrigeTekstlinjer}</BodyShortWithPreWrap>
                        </Expandable>
                    )}
                </VStack>
            )}
            <HendelseKommentarSeksjon
                kommentarer={kommentarer}
                dialogRef={dialogRef ?? undefined}
                historikkinnslagId={historikkinnslagId}
                historikktype={PeriodehistorikkType.OpphevStansAutomatiskBehandlingSaksbehandler}
            />
        </Historikkhendelse>
    );
}
