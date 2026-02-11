import React, { ReactElement } from 'react';

import { VStack } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { PeriodehistorikkType } from '@io/graphql';
import { Expandable } from '@saksbilde/historikk/komponenter/Expandable';
import { HistorikkArrowUndoIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { HendelseKommentarSeksjon } from '@saksbilde/historikk/komponenter/kommentarer/hendelse/HendelseKommentarSeksjon';
import { HistorikkhendelseObject } from '@typer/historikk';

import { Historikkhendelse } from '../komponenter/Historikkhendelse';

type TotrinnsvurderingReturHendelseProps = {
    hendelse: HistorikkhendelseObject;
};

export const TotrinnsvurderingReturHendelse = ({
    hendelse: { saksbehandler, timestamp, notattekst, dialogRef, historikkinnslagId, kommentarer },
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
                    historikktype={PeriodehistorikkType.TotrinnsvurderingRetur}
                />
            )}
        </Historikkhendelse>
    );
};
