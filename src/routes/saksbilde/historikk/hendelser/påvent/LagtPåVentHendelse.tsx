import React from 'react';

import { BodyLong, BodyShort, HStack } from '@navikt/ds-react';

import { PeriodehistorikkType, PersonFragment } from '@io/graphql';
import { Expandable } from '@saksbilde/historikk/hendelser/Expandable';
import { PåVentIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { LagtPåVentDropdown } from '@saksbilde/historikk/hendelser/påvent/LagtPåVentDropdown';
import { ÅrsakListe } from '@saksbilde/historikk/hendelser/påvent/ÅrsakListe';
import { KommentarSeksjon } from '@saksbilde/historikk/komponenter/kommentarer/KommentarSeksjon';
import { Kommentarer } from '@saksbilde/historikk/komponenter/kommentarer/Kommentarer';
import { useActivePeriod } from '@state/periode';
import { HistorikkhendelseObject } from '@typer/historikk';
import { somNorskDato } from '@utils/date';
import { isBeregnetPeriode } from '@utils/typeguards';

interface LagtPåVentHendelseProps {
    hendelse: HistorikkhendelseObject;
    person: PersonFragment;
}

export const LagtPåVentHendelse = ({ hendelse, person }: LagtPåVentHendelseProps) => {
    const aktivPeriode = useActivePeriod(person);
    const erAktivPeriodePåVent = isBeregnetPeriode(aktivPeriode) && aktivPeriode?.paVent !== null;
    return (
        <Historikkhendelse
            icon={<PåVentIkon />}
            title={`Lagt på vent${hendelse.historikktype === PeriodehistorikkType.EndrePaVent ? ' – endret' : ''}`}
            timestamp={hendelse.timestamp}
            saksbehandler={hendelse.saksbehandler ?? undefined}
            kontekstknapp={
                hendelse.erNyestePåVentInnslag && erAktivPeriodePåVent ? (
                    <LagtPåVentDropdown
                        person={person}
                        periode={aktivPeriode}
                        årsaker={hendelse.årsaker}
                        notattekst={hendelse.notattekst}
                        frist={hendelse.frist}
                    />
                ) : undefined
            }
            aktiv={hendelse.erNyestePåVentInnslag}
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
            {hendelse.erNyestePåVentInnslag && (
                <KommentarSeksjon
                    kommentarer={hendelse.kommentarer!}
                    dialogRef={hendelse.dialogRef ?? undefined}
                    historikkinnslagId={hendelse.historikkinnslagId!}
                    historikktype={hendelse.historikktype}
                />
            )}
            {!hendelse.erNyestePåVentInnslag && hendelse.kommentarer && (
                <Kommentarer kommentarer={hendelse.kommentarer} />
            )}
        </Historikkhendelse>
    );
};
