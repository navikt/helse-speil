import React from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { PeriodehistorikkType, PersonFragment } from '@io/graphql';
import { LagtPåVentDropdown } from '@saksbilde/historikk/hendelser/påvent/LagtPåVentDropdown';
import { ÅrsakListe } from '@saksbilde/historikk/hendelser/påvent/ÅrsakListe';
import { Expandable } from '@saksbilde/historikk/komponenter/Expandable';
import { HistorikkTimerPauseIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { HendelseKommentarSeksjon } from '@saksbilde/historikk/komponenter/kommentarer/hendelse/HendelseKommentarSeksjon';
import { HendelseKommentarer } from '@saksbilde/historikk/komponenter/kommentarer/hendelse/HendelseKommentarer';
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
            icon={<HistorikkTimerPauseIkon />}
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
            <HStack gap="space-4">
                <BodyShort>Oppfølgingsdato:</BodyShort>
                <BodyShort weight="semibold">{somNorskDato(hendelse.frist ?? undefined)}</BodyShort>
            </HStack>
            {!!hendelse.notattekst && (
                <Expandable flattened={!hendelse.erNyestePåVentInnslag}>
                    <BodyShort weight="semibold">Notat</BodyShort>
                    <BodyShortWithPreWrap>{hendelse.notattekst}</BodyShortWithPreWrap>
                </Expandable>
            )}
            {hendelse.erNyestePåVentInnslag && hendelse.dialogRef && (
                <HendelseKommentarSeksjon
                    kommentarer={hendelse.kommentarer!}
                    dialogRef={hendelse.dialogRef}
                    historikkinnslagId={hendelse.historikkinnslagId!}
                    historikktype={hendelse.historikktype}
                />
            )}
            {!hendelse.erNyestePåVentInnslag && hendelse.kommentarer && hendelse.dialogRef && (
                <HendelseKommentarer dialogRef={hendelse.dialogRef} kommentarer={hendelse.kommentarer} />
            )}
        </Historikkhendelse>
    );
};
