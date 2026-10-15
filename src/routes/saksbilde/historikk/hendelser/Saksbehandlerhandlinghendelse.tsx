import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { Alert, List, Skeleton, VStack } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { Visningsfelt } from '@io/rest/handlingsvisning';
import { HistorikkKildeSaksbehandlerIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import {
    tilSaksbehandlerhandlingTekst,
    tilVisningUrl,
    useSaksbehandlerhandlingVisning,
} from '@state/saksbehandlerhandlinger';
import { SaksbehandlerhandlinghendelseObject } from '@typer/historikk';

type SaksbehandlerhandlinghendelseProps = {
    hendelse: SaksbehandlerhandlinghendelseObject;
};

export function Saksbehandlerhandlinghendelse({
    hendelse: { id, handlingType, saksbehandler, timestamp },
}: SaksbehandlerhandlinghendelseProps): ReactElement {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const visningUrl = tilVisningUrl(handlingType, personPseudoId, id);

    return (
        <Historikkhendelse
            icon={<HistorikkKildeSaksbehandlerIkon />}
            title={tilSaksbehandlerhandlingTekst(handlingType)}
            timestamp={timestamp}
            saksbehandler={saksbehandler}
            aktiv={false}
        >
            {visningUrl && <SaksbehandlerhandlingDetaljer visningUrl={visningUrl} />}
        </Historikkhendelse>
    );
}

// Rendres bare når innslaget er ekspandert, så detaljene hentes først da
function SaksbehandlerhandlingDetaljer({ visningUrl }: { visningUrl: string }): ReactElement {
    const { data, isPending, isError, error } = useSaksbehandlerhandlingVisning(visningUrl);

    if (isPending) {
        return (
            <VStack gap="space-4" aria-label="Henter detaljer">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="80%" />
            </VStack>
        );
    }

    if (isError) {
        return error.status === 404 ? (
            <Alert variant="info" size="small" inline>
                Fant ikke detaljer
            </Alert>
        ) : (
            <Alert variant="error" size="small" inline>
                Kunne ikke hente detaljer
            </Alert>
        );
    }

    return (
        <>
            {data.felter.map((felt, index) => (
                <HistorikkSection key={index} tittel={felt.tittel}>
                    <VisningsfeltInnhold felt={felt} />
                </HistorikkSection>
            ))}
        </>
    );
}

function VisningsfeltInnhold({ felt }: { felt: Visningsfelt }): ReactElement {
    switch (felt.type) {
        case 'TEKST':
            return <BodyShortWithPreWrap>{felt.tekst}</BodyShortWithPreWrap>;
        case 'LISTE':
            return (
                <List as="ul" size="small">
                    {felt.elementer.map((element, index) => (
                        <List.Item key={index}>{element}</List.Item>
                    ))}
                </List>
            );
    }
}
