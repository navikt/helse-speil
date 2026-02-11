import React, { ReactElement } from 'react';

import { VStack } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { PeriodehistorikkType } from '@io/graphql';
import { Expandable } from '@saksbilde/historikk/komponenter/Expandable';
import { HistorikkTimerPauseIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { HendelseKommentarSeksjon } from '@saksbilde/historikk/komponenter/kommentarer/hendelse/HendelseKommentarSeksjon';
import { HistorikkhendelseObject } from '@typer/historikk';

type StansAutomatiskBehandlingSaksbehandlerHendelseProps = {
    hendelse: HistorikkhendelseObject;
};

export function StansAutomatiskBehandlingSaksbehandlerHendelse({
    hendelse: { timestamp, saksbehandler, notattekst, dialogRef, kommentarer, historikkinnslagId },
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
                <VStack gap="space-0">
                    {førsteTekstlinje}
                    {øvrigeTekstlinjer !== '' && (
                        <Expandable>
                            <BodyShortWithPreWrap>{øvrigeTekstlinjer}</BodyShortWithPreWrap>
                        </Expandable>
                    )}
                </VStack>
            )}
            {dialogRef && (
                <HendelseKommentarSeksjon
                    kommentarer={kommentarer}
                    dialogRef={dialogRef}
                    historikkinnslagId={historikkinnslagId}
                    historikktype={PeriodehistorikkType.StansAutomatiskBehandlingSaksbehandler}
                />
            )}
        </Historikkhendelse>
    );
}
