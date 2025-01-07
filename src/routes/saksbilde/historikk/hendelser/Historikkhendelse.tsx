import React, { PropsWithChildren, ReactElement } from 'react';

import { VStack } from '@navikt/ds-react';

import { Kommentar, Maybe, PeriodehistorikkType } from '@io/graphql';
import { ExpandableHendelse } from '@saksbilde/historikk/hendelser/ExpandableHendelse';
import { Hendelse } from '@saksbilde/historikk/hendelser/Hendelse';
import { HendelseDate } from '@saksbilde/historikk/hendelser/HendelseDate';
import { KommentarSeksjon } from '@saksbilde/historikk/komponenter/kommentarer/KommentarSeksjon';
import { Kommentarer } from '@saksbilde/historikk/komponenter/kommentarer/Kommentarer';
import { DateString } from '@typer/shared';

type HistorikkhendelseProps = {
    erNyesteHendelseAvType: boolean;
    historikkinnslagId: number;
    historikktype: PeriodehistorikkType;
    timestamp: DateString;
    dialogRef: Maybe<number>;
    saksbehandler: Maybe<string>;
    kommentarer: Array<Kommentar>;
    title: string;
    icon?: ReactElement;
    kontekstknapp?: ReactElement;
    erNyestePåVentInnslag?: boolean;
};

export const Historikkhendelse = ({
    erNyesteHendelseAvType,
    historikktype,
    saksbehandler,
    timestamp,
    dialogRef,
    historikkinnslagId,
    kommentarer,
    title,
    icon,
    kontekstknapp,
    children,
}: PropsWithChildren<HistorikkhendelseProps>): ReactElement => {
    return erNyesteHendelseAvType ? (
        <Hendelse title={title} icon={icon}>
            {kontekstknapp}
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
            <VStack gap="2">
                {children}
                <KommentarSeksjon
                    kommentarer={kommentarer}
                    dialogRef={dialogRef}
                    historikkinnslagId={historikkinnslagId}
                    historikktype={historikktype}
                />
            </VStack>
        </Hendelse>
    ) : (
        <ExpandableHendelse
            tittel={title}
            ikon={icon}
            tidsstempel={timestamp}
            saksbehandler={saksbehandler ?? undefined}
        >
            <VStack gap="2">
                {children}
                {kommentarer && <Kommentarer kommentarer={kommentarer} />}
            </VStack>
        </ExpandableHendelse>
    );
};
