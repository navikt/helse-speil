import React, { ReactElement } from 'react';

import { BodyLong, BodyShort, HStack, VStack } from '@navikt/ds-react';

import { PeriodehistorikkType, PersonFragment } from '@io/graphql';
import { PåVentIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { Kommentarer } from '@saksbilde/historikk/hendelser/notat/Kommentarer';
import { PåVentDropdown } from '@saksbilde/historikk/hendelser/påvent/PåVentDropdown';
import { PåVentLeggTilKommentar } from '@saksbilde/historikk/hendelser/påvent/PåVentLeggTilKommentar';
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
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
            <VStack gap="2">
                <ÅrsakListe årsaker={årsaker} />
                <HStack gap="1">
                    <BodyShort>Frist:</BodyShort>
                    <BodyShort weight="semibold">{somNorskDato(frist ?? undefined)}</BodyShort>
                </HStack>
                {!!notattekst && (
                    <Expandable>
                        <BodyShort weight="semibold">Notat</BodyShort>
                        <BodyLong style={{ whiteSpace: 'pre-wrap' }}>{notattekst}</BodyLong>
                    </Expandable>
                )}
                {dialogRef && (
                    <>
                        {kommentarer?.length > 0 && (
                            <Expandable
                                expandText={`Kommentarer (${kommentarer?.length})`}
                                collapseText="Lukk kommentarer"
                            >
                                <Kommentarer kommentarer={kommentarer} readOnly={false} />
                            </Expandable>
                        )}
                        <PåVentLeggTilKommentar
                            historikktype={historikktype}
                            dialogRef={dialogRef}
                            historikkinnslagId={historikkinnslagId}
                        />
                    </>
                )}
            </VStack>
        </Hendelse>
    );
};
