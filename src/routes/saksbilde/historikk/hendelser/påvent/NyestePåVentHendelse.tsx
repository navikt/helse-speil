import React, { ReactElement, useState } from 'react';

import { TimerPauseIcon } from '@navikt/aksel-icons';

import { PeriodehistorikkType, PersonFragment } from '@io/graphql';
import { ExpandableHistorikkContent } from '@saksbilde/historikk/hendelser/ExpandableHistorikkContent';
import { KommentarerContent } from '@saksbilde/historikk/hendelser/notat/KommentarerContent';
import { LagtPåventinnhold } from '@saksbilde/historikk/hendelser/påvent/LagtPåVentInnhold';
import { PåVentDropdown } from '@saksbilde/historikk/hendelser/påvent/PåVentDropdown';
import { useActivePeriod } from '@state/periode';
import { HistorikkhendelseObject } from '@typer/historikk';
import { isBeregnetPeriode } from '@utils/typeguards';

import { Expandable } from '../Expandable';
import { Hendelse } from '../Hendelse';
import { HendelseDate } from '../HendelseDate';

import styles from './NyestePåVentHendelse.module.css';

type NyestePåVentHendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'> & {
    person: PersonFragment;
};

export const NyestePåVentHendelse = ({
    person,
    historikktype,
    saksbehandler,
    timestamp,
    årsaker,
    frist,
    notattekst,
    dialogRef,
    historikkinnslagId,
    kommentarer,
}: NyestePåVentHendelseProps): ReactElement => {
    const [expanded, setExpanded] = useState(false);
    const aktivPeriode = useActivePeriod(person);
    const erAktivPeriodePåVent = isBeregnetPeriode(aktivPeriode) && aktivPeriode?.paVent !== null;
    return (
        <Hendelse
            title={`Lagt på vent${historikktype === PeriodehistorikkType.EndrePaVent ? ' – endret' : ''}`}
            icon={<TimerPauseIcon title="Timer-ikon" className={styles.ikon} />}
        >
            {erAktivPeriodePåVent && (
                <PåVentDropdown person={person} årsaker={årsaker} notattekst={notattekst} frist={frist} />
            )}
            <Expandable expandable={!!notattekst} expanded={expanded} setExpanded={setExpanded}>
                <LagtPåventinnhold
                    expanded={expanded}
                    tekst={notattekst}
                    årsaker={årsaker}
                    frist={frist}
                    erNyestePåVentInnslag={true}
                />
            </Expandable>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
            {dialogRef && (
                <ExpandableHistorikkContent
                    openText={`Kommentarer (${kommentarer?.length})`}
                    closeText="Lukk kommentarer"
                >
                    <KommentarerContent
                        historikktype={historikktype}
                        kommentarer={kommentarer}
                        dialogRef={dialogRef}
                        historikkinnslagId={historikkinnslagId}
                    />
                </ExpandableHistorikkContent>
            )}
        </Hendelse>
    );
};
