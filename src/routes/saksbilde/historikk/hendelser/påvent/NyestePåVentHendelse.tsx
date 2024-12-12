import React, { ReactElement } from 'react';

import { BodyLong, BodyShort, HStack, VStack } from '@navikt/ds-react';

import { PeriodehistorikkType, PersonFragment } from '@io/graphql';
import { ExpandableHistorikkContent } from '@saksbilde/historikk/hendelser/ExpandableHistorikkContent';
import { PåVentIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { KommentarerContent } from '@saksbilde/historikk/hendelser/notat/KommentarerContent';
import { PåVentDropdown } from '@saksbilde/historikk/hendelser/påvent/PåVentDropdown';
import { ÅrsakListe } from '@saksbilde/historikk/hendelser/påvent/ÅrsakListe';
import { useActivePeriod } from '@state/periode';
import { HistorikkhendelseObject } from '@typer/historikk';
import { somNorskDato } from '@utils/date';
import { isBeregnetPeriode } from '@utils/typeguards';

import { Expandable } from '../Expandable';
import { Hendelse } from '../Hendelse';
import { HendelseDate } from '../HendelseDate';

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
    const aktivPeriode = useActivePeriod(person);
    const erAktivPeriodePåVent = isBeregnetPeriode(aktivPeriode) && aktivPeriode?.paVent !== null;
    return (
        <Hendelse
            title={`Lagt på vent${historikktype === PeriodehistorikkType.EndrePaVent ? ' – endret' : ''}`}
            icon={<PåVentIkon />}
        >
            {erAktivPeriodePåVent && (
                <PåVentDropdown person={person} årsaker={årsaker} notattekst={notattekst} frist={frist} />
            )}
            <VStack gap="2">
                <ÅrsakListe årsaker={årsaker} />
                <HStack gap="1">
                    <BodyShort>Frist:</BodyShort>
                    <BodyShort weight="semibold">{somNorskDato(frist ?? undefined)}</BodyShort>
                </HStack>
            </VStack>
            {!!notattekst && (
                <Expandable>
                    <BodyShort weight="semibold">Notat</BodyShort>
                    <BodyLong style={{ whiteSpace: 'pre-wrap' }}>{notattekst}</BodyLong>
                </Expandable>
            )}
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
