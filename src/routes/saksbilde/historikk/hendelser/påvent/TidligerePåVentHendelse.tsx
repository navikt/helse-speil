import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { TimerPauseIcon } from '@navikt/aksel-icons';
import { HStack } from '@navikt/ds-react';

import { PeriodehistorikkType } from '@io/graphql';
import { ExpandableHendelse } from '@saksbilde/historikk/hendelser/ExpandableHendelse';
import { Kommentarer } from '@saksbilde/historikk/hendelser/notat/Kommentarer';
import { TidligerePåVentHendelseInnhold } from '@saksbilde/historikk/hendelser/påvent/TidligerePåVentHendelseInnhold';
import { HistorikkhendelseObject } from '@typer/historikk';

import styles from './TidligerePåVentHendelse.module.css';

type TidligerePåVentHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const TidligerePåVentHendelse = ({
    historikktype,
    saksbehandler,
    timestamp,
    årsaker,
    frist,
    notattekst,
    kommentarer,
}: TidligerePåVentHendelseProps): ReactElement => {
    const [expanded, setExpanded] = useState(false);

    return (
        <ExpandableHendelse
            title={`Lagt på vent${historikktype === PeriodehistorikkType.EndrePaVent ? ' – endret' : ''}`}
            icon={<TimerPauseIcon title="Timer ikon" className={classNames(styles.Innrammet, styles.pavent)} />}
            expanded={expanded}
            setExpanded={setExpanded}
            timestamp={timestamp}
            saksbehandler={saksbehandler}
        >
            <TidligerePåVentHendelseInnhold expanded={expanded} tekst={notattekst} årsaker={årsaker} frist={frist} />
            {expanded && kommentarer && (
                <HStack gap="4">
                    <Kommentarer kommentarer={kommentarer} />
                </HStack>
            )}
        </ExpandableHendelse>
    );
};
