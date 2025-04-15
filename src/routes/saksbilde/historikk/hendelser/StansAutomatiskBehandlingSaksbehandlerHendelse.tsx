import React, { ReactElement } from 'react';

import { VStack } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { PeriodehistorikkType } from '@io/graphql';
import { Expandable } from '@saksbilde/historikk/komponenter/Expandable';
import { HistorikkTimerPauseIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { KommentarSeksjon } from '@saksbilde/historikk/komponenter/kommentarer/KommentarSeksjon';
import { HistorikkhendelseObject } from '@typer/historikk';

type StansAutomatiskBehandlingSaksbehandlerHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export function StansAutomatiskBehandlingSaksbehandlerHendelse({
    timestamp,
    saksbehandler,
    notattekst,
    dialogRef,
    kommentarer,
    historikkinnslagId,
}: StansAutomatiskBehandlingSaksbehandlerHendelseProps): ReactElement {
    const førsteTekstlinje = notattekst?.split(/\r?\n/, 1)[0];
    const øvrigeTekstlinjer = notattekst?.slice(førsteTekstlinje!.length)?.trim();

    return (
        <Historikkhendelse
            icon={<HistorikkTimerPauseIkon />}
            title="Automatisk behandling stanset"
            timestamp={timestamp}
            saksbehandler={saksbehandler ?? undefined}
        >
            {notattekst && (
                <VStack gap="0">
                    {førsteTekstlinje}
                    {øvrigeTekstlinjer !== '' && (
                        <Expandable>
                            <BodyShortWithPreWrap>{øvrigeTekstlinjer}</BodyShortWithPreWrap>
                        </Expandable>
                    )}
                </VStack>
            )}
            <KommentarSeksjon
                kommentarer={kommentarer}
                dialogRef={dialogRef ?? undefined}
                historikkinnslagId={historikkinnslagId}
                historikktype={PeriodehistorikkType.TotrinnsvurderingRetur}
            />
        </Historikkhendelse>
    );
}
