import React, { ReactElement } from 'react';

import { BodyLong, BodyShort, HStack, VStack } from '@navikt/ds-react';

import { ExpandableHendelse } from '@saksbilde/historikk/hendelser/ExpandableHendelse';
import { PåVentIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { Kommentarer } from '@saksbilde/historikk/hendelser/notat/Kommentarer';
import { ÅrsakListe } from '@saksbilde/historikk/hendelser/påvent/ÅrsakListe';
import { HistorikkhendelseObject } from '@typer/historikk';
import { somNorskDato } from '@utils/date';

type TidligerePåVentHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'> & {
    erEndring: boolean;
};

export const TidligerePåVentHendelse = ({
    erEndring,
    saksbehandler,
    timestamp,
    årsaker,
    frist,
    notattekst,
    kommentarer,
}: TidligerePåVentHendelseProps): ReactElement => {
    return (
        <ExpandableHendelse
            title={`Lagt på vent${erEndring ? ' – endret' : ''}`}
            icon={<PåVentIkon />}
            timestamp={timestamp}
            saksbehandler={saksbehandler ?? undefined}
        >
            <VStack gap="2">
                <ÅrsakListe årsaker={årsaker} />
                <HStack gap="1">
                    <BodyShort>Frist:</BodyShort>
                    <BodyShort weight="semibold">{somNorskDato(frist ?? undefined)}</BodyShort>
                </HStack>
                <div>
                    {notattekst && <BodyShort weight="semibold">Notat</BodyShort>}
                    <BodyLong style={{ whiteSpace: 'pre-wrap' }}>{notattekst}</BodyLong>
                </div>
                {kommentarer && <Kommentarer kommentarer={kommentarer} />}
            </VStack>
        </ExpandableHendelse>
    );
};
