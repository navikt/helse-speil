import React, { ReactElement } from 'react';

import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { hoppTilModia } from '@components/SystemMenu';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { DateString } from '@typer/shared';

type VedtakDokumentHendelseProps = {
    dokumentId?: string;
    fødselsnummer: string;
    timestamp: DateString;
};

export const VedtakDokumentHendelse = ({
    dokumentId,
    fødselsnummer,
    timestamp,
}: VedtakDokumentHendelseProps): ReactElement => (
    <Historikkhendelse
        icon={<Kilde type="VEDTAK">MV</Kilde>}
        title="Melding om vedtak"
        kontekstknapp={
            <Button
                icon={<ExternalLinkIcon />}
                title={'Åpne vedtak i ny fane'}
                variant="tertiary"
                size="xsmall"
                onClick={() =>
                    hoppTilModia(
                        `https://spinnsyn-frontend-interne.intern.nav.no/syk/sykepenger?id=${dokumentId}`,
                        fødselsnummer,
                    )
                }
            />
        }
        timestamp={timestamp}
        aktiv={false}
    />
);
