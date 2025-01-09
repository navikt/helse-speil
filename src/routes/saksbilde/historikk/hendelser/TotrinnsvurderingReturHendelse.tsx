import React, { ReactElement } from 'react';

import { VStack } from '@navikt/ds-react';

import { BodyLongWithPreWrap } from '@components/BodyLongWithPreWrap';
import { PeriodehistorikkType } from '@io/graphql';
import { Expandable } from '@saksbilde/historikk/komponenter/Expandable';
import { HistorikkArrowUndoIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { KommentarSeksjon } from '@saksbilde/historikk/komponenter/kommentarer/KommentarSeksjon';
import { HistorikkhendelseObject } from '@typer/historikk';

import { Historikkhendelse } from '../komponenter/Historikkhendelse';

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
            icon={<HistorikkArrowUndoIkon />}
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
                            <BodyLongWithPreWrap>{øvrigeTekstlinjer}</BodyLongWithPreWrap>
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
