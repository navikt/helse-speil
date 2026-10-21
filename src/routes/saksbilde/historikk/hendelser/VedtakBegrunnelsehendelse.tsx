import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { ApiVedtakUtfall } from '@io/rest/generated/spesialist.schemas';
import { HistorikkKildeSaksbehandlerIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { VedtakBegrunnelseObject } from '@typer/historikk';

type VedtakBegrunnelsehendelseProps = {
    hendelse: VedtakBegrunnelseObject;
};

export const VedtakBegrunnelsehendelse = ({
    hendelse: { utfall, begrunnelse, saksbehandler, timestamp },
}: VedtakBegrunnelsehendelseProps): ReactElement => {
    return (
        <Historikkhendelse
            icon={<HistorikkKildeSaksbehandlerIkon />}
            title="Individuell begrunnelse"
            timestamp={timestamp}
            saksbehandler={saksbehandler}
            aktiv={false}
        >
            <HistorikkSection tittel="Type">
                <BodyShort>{tekstForUtfall(utfall)}</BodyShort>
            </HistorikkSection>
            <HistorikkSection tittel="Begrunnelse">
                <BodyShortWithPreWrap>{begrunnelse}</BodyShortWithPreWrap>
            </HistorikkSection>
        </Historikkhendelse>
    );
};

const tekstForUtfall = (utfall: ApiVedtakUtfall) => {
    switch (utfall) {
        case ApiVedtakUtfall.AVSLAG:
            return 'Avslag';
        case ApiVedtakUtfall.DELVIS_INNVILGELSE:
            return 'Delvis innvilgelse';
        case ApiVedtakUtfall.INNVILGELSE:
            return 'Innvilgelse';
    }
};
