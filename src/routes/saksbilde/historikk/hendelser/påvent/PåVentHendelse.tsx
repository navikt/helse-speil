import React from 'react';

import { BodyLong, BodyShort, HStack } from '@navikt/ds-react';

import { PeriodehistorikkType, PersonFragment } from '@io/graphql';
import { Expandable } from '@saksbilde/historikk/hendelser/Expandable';
import { PåVentIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { PåVentDropdown } from '@saksbilde/historikk/hendelser/påvent/PåVentDropdown';
import { ÅrsakListe } from '@saksbilde/historikk/hendelser/påvent/ÅrsakListe';
import { useActivePeriod } from '@state/periode';
import { HistorikkhendelseObject } from '@typer/historikk';
import { somNorskDato } from '@utils/date';
import { isBeregnetPeriode } from '@utils/typeguards';

interface PåVentHendelseProps {
    hendelse: HistorikkhendelseObject;
    person: PersonFragment;
}

export const PåVentHendelse = ({ hendelse, person }: PåVentHendelseProps) => {
    const aktivPeriode = useActivePeriod(person);
    const erAktivPeriodePåVent = isBeregnetPeriode(aktivPeriode) && aktivPeriode?.paVent !== null;
    return (
        <Historikkhendelse
            erNyesteHendelseAvType={hendelse.erNyestePåVentInnslag ?? false}
            title={`Lagt på vent${hendelse.historikktype === PeriodehistorikkType.EndrePaVent ? ' – endret' : ''}`}
            icon={<PåVentIkon />}
            timestamp={hendelse.timestamp}
            saksbehandler={hendelse.saksbehandler}
            kontekstknapp={
                erAktivPeriodePåVent ? (
                    <PåVentDropdown
                        person={person}
                        årsaker={hendelse.årsaker}
                        notattekst={hendelse.notattekst}
                        frist={hendelse.frist}
                    />
                ) : undefined
            }
            kommentarer={hendelse.kommentarer}
            dialogRef={hendelse.dialogRef}
            historikkinnslagId={hendelse.historikkinnslagId}
            historikktype={hendelse.historikktype}
        >
            <ÅrsakListe årsaker={hendelse.årsaker} />
            <HStack gap="1">
                <BodyShort>Frist:</BodyShort>
                <BodyShort weight="semibold">{somNorskDato(hendelse.frist ?? undefined)}</BodyShort>
            </HStack>
            {!!hendelse.notattekst && (
                <Expandable flattened={!hendelse.erNyestePåVentInnslag}>
                    <BodyShort weight="semibold">Notat</BodyShort>
                    <BodyLong style={{ whiteSpace: 'pre-wrap' }}>{hendelse.notattekst}</BodyLong>
                </Expandable>
            )}
        </Historikkhendelse>
    );
};
