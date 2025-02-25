import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { Kilde } from '@components/Kilde';
import { Inntektskilde, VedtakUtfall } from '@io/graphql';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { VedtakBegrunnelseObject } from '@typer/historikk';

type VedtakBegrunnelsehendelseProps = Omit<VedtakBegrunnelseObject, 'type' | 'id'>;

export const VedtakBegrunnelsehendelse = ({
    utfall,
    begrunnelse,
    saksbehandler,
    timestamp,
}: VedtakBegrunnelsehendelseProps): ReactElement => {
    return (
        <Historikkhendelse
            icon={
                <Kilde type={Inntektskilde.Saksbehandler}>
                    <PersonPencilFillIcon />
                </Kilde>
            }
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

const tekstForUtfall = (utfall: VedtakUtfall) => {
    switch (utfall) {
        case VedtakUtfall.Avslag:
            return 'Avslag';
        case VedtakUtfall.DelvisInnvilgelse:
            return 'Delvis innvilgelse';
        case VedtakUtfall.Innvilgelse:
            return 'Innvilgelse';
    }
};
