import React, { ReactElement } from 'react';

import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';

import { hoppTilModia } from '@components/SystemMenu';
import { HistorikkKildeVedtakIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { DateString } from '@typer/shared';

type MeldingOmVedtakhendelseProps = {
    dokumentId?: string;
    fødselsnummer: string;
    timestamp: DateString;
};

export const MeldingOmVedtakhendelse = ({
    dokumentId,
    fødselsnummer,
    timestamp,
}: MeldingOmVedtakhendelseProps): ReactElement => (
    <Historikkhendelse
        icon={<HistorikkKildeVedtakIkon />}
        title="Melding om vedtak"
        kontekstknapp={
            <Tooltip content="Åpne vedtak i ny fane">
                <Button
                    icon={<ExternalLinkIcon aria-hidden />}
                    variant="tertiary"
                    size="xsmall"
                    onClick={() =>
                        hoppTilModia(
                            `https://spinnsyn-frontend-interne.intern.nav.no/syk/sykepenger?id=${dokumentId}`,
                            fødselsnummer,
                        )
                    }
                />
            </Tooltip>
        }
        timestamp={timestamp}
        aktiv={false}
    />
);
