import React from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { PeriodehistorikkType, PersonFragment } from '@io/graphql';
import { LagtPåVentDropdown } from '@saksbilde/historikk/hendelser/påvent/LagtPåVentDropdown';
import { ÅrsakListe } from '@saksbilde/historikk/hendelser/påvent/ÅrsakListe';
import { Expandable } from '@saksbilde/historikk/komponenter/Expandable';
import { HistorikkTimerPauseIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
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
            <HStack gap="1">
                <BodyShort>Oppfølgningsdato:</BodyShort>
                <BodyShort weight="semibold">{somNorskDato(hendelse.frist ?? undefined)}</BodyShort>
            </HStack>
            {!!hendelse.notattekst && (
                <Expandable flattened={!hendelse.erNyestePåVentInnslag}>
                    <BodyShort weight="semibold">Notat</BodyShort>
                    <BodyShortWithPreWrap>{hendelse.notattekst}</BodyShortWithPreWrap>
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
