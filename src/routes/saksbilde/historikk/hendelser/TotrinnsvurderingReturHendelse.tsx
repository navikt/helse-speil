import React, { ReactElement } from 'react';

import { BodyLong, VStack } from '@navikt/ds-react';

import { PeriodehistorikkType } from '@io/graphql';
import { Expandable } from '@saksbilde/historikk/hendelser/Expandable';
import { TotrinnsvurderingReturIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { KommentarSeksjon } from '@saksbilde/historikk/komponenter/kommentarer/KommentarSeksjon';
import { HistorikkhendelseObject } from '@typer/historikk';

import { Historikkhendelse } from './Historikkhendelse';

type TotrinnsvurderingReturHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const TotrinnsvurderingReturHendelse = ({
    saksbehandler,
    timestamp,
    notattekst,
    dialogRef,
    historikkinnslagId,
    kommentarer,
}: TotrinnsvurderingReturHendelseProps): ReactElement => {
    const førsteTekstlinje = notattekst?.split(/\r?\n/, 1)[0];
    const øvrigeTekstlinjer = notattekst?.slice(førsteTekstlinje!.length)?.trim();

    return (
        <Historikkhendelse
            icon={<TotrinnsvurderingReturIkon />}
            title="Returnert"
            timestamp={timestamp}
            saksbehandler={saksbehandler ?? 'Automatisk'}
            aktiv={true}
        >
            {notattekst && (
                <VStack gap="0">
                    {førsteTekstlinje}
                    {øvrigeTekstlinjer !== '' && (
                        <Expandable>
                            <BodyLong style={{ whiteSpace: 'pre-wrap' }}>{øvrigeTekstlinjer}</BodyLong>
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
};
