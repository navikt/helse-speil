import React, { PropsWithChildren, ReactElement } from 'react';

import { VStack } from '@navikt/ds-react';

import { EnkelHendelse } from '@saksbilde/historikk/hendelser/EnkelHendelse';
import { ExpandableHendelse } from '@saksbilde/historikk/hendelser/ExpandableHendelse';
import { Hendelse } from '@saksbilde/historikk/hendelser/Hendelse';
import { HendelseDate } from '@saksbilde/historikk/hendelser/HendelseDate';
import { DateString } from '@typer/shared';

type HistorikkhendelseProps = {
    icon?: ReactElement;
    title: string;
    kontekstknapp?: ReactElement;
    timestamp: DateString;
    saksbehandler?: string;
    aktiv?: boolean;
};

export const Historikkhendelse = ({
    icon,
    title,
    kontekstknapp,
    timestamp,
    saksbehandler,
    aktiv = true,
    children,
}: PropsWithChildren<HistorikkhendelseProps>): ReactElement => {
    return children ? (
        aktiv ? (
            <Hendelse title={title} icon={icon}>
                {kontekstknapp}
                <HendelseDate timestamp={timestamp} ident={saksbehandler} />
                <VStack gap="2">{children}</VStack>
            </Hendelse>
        ) : (
            <ExpandableHendelse
                tittel={title}
                ikon={icon}
                tidsstempel={timestamp}
                saksbehandler={saksbehandler ?? undefined}
            >
                <VStack gap="2">{children}</VStack>
            </ExpandableHendelse>
        )
    ) : (
        <EnkelHendelse title={title} icon={icon} timestamp={timestamp} saksbehandler={saksbehandler} />
    );
};
