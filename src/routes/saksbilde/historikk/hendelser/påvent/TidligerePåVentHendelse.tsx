import React, { ReactElement } from 'react';

import { TimerPauseIcon } from '@navikt/aksel-icons';
import { BodyLong, BodyShort, HStack, VStack } from '@navikt/ds-react';

import { ExpandableHendelse } from '@saksbilde/historikk/hendelser/ExpandableHendelse';
import { Kommentarer } from '@saksbilde/historikk/hendelser/notat/Kommentarer';
import { ÅrsakListe } from '@saksbilde/historikk/hendelser/påvent/ÅrsakListe';
import { HistorikkhendelseObject } from '@typer/historikk';
import { somNorskDato } from '@utils/date';

import styles from './TidligerePåVentHendelse.module.css';

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
            icon={<TimerPauseIcon title="Timer-ikon" className={styles.ikon} />}
            timestamp={timestamp}
            saksbehandler={saksbehandler}
        >
            <VStack gap="2">
                <ÅrsakListe årsaker={årsaker} />
                <div>
                    {notattekst && <BodyShort weight="semibold">Notat</BodyShort>}
                    <BodyLong className={styles.tekstMedLinjeskift}>{notattekst}</BodyLong>
                </div>
                {frist && (
                    <HStack gap="1">
                        <BodyShort>Frist:</BodyShort>
                        <BodyShort weight="semibold">{somNorskDato(frist)}</BodyShort>
                    </HStack>
                )}
                {kommentarer && (
                    <HStack gap="4">
                        <Kommentarer kommentarer={kommentarer} />
                    </HStack>
                )}
            </VStack>
        </ExpandableHendelse>
    );
};
