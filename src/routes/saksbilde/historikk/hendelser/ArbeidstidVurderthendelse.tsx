import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { HistorikkKildeSaksbehandlerIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { MinimumSykdomsgradhendelseObject } from '@typer/historikk';
import { somNorskDato } from '@utils/date';

type ArbeidstidVurderthendelseProps = {
    hendelse: MinimumSykdomsgradhendelseObject;
};

export const ArbeidstidVurderthendelse = ({
    hendelse: { saksbehandler, timestamp, minimumSykdomsgrad },
}: ArbeidstidVurderthendelseProps): ReactElement => {
    return (
        <Historikkhendelse
            icon={<HistorikkKildeSaksbehandlerIkon />}
            title="Arbeidstid vurdert"
            timestamp={timestamp}
            saksbehandler={saksbehandler}
            aktiv={false}
        >
            {minimumSykdomsgrad.perioderVurdertOk.length > 0 && (
                <HistorikkSection tittel="Innvilgede perioder">
                    <BodyShort>
                        {minimumSykdomsgrad.perioderVurdertOk
                            .map((periode) => `${somNorskDato(periode.fom)} – ${somNorskDato(periode.tom)}`)
                            .join(', ')
                            .replace(/,(?=[^,]*$)/, ' og')}
                    </BodyShort>
                </HistorikkSection>
            )}
            {minimumSykdomsgrad.perioderVurdertIkkeOk.length > 0 && (
                <HistorikkSection tittel="Avslåtte perioder">
                    <BodyShort>
                        {minimumSykdomsgrad.perioderVurdertIkkeOk
                            .map((periode) => `${somNorskDato(periode.fom)} – ${somNorskDato(periode.tom)}`)
                            .join(', ')
                            .replace(/,(?=[^,]*$)/, ' og')}
                    </BodyShort>
                </HistorikkSection>
            )}
            <HistorikkSection tittel="Notat til beslutter">
                <BodyShortWithPreWrap>{minimumSykdomsgrad.begrunnelse}</BodyShortWithPreWrap>
            </HistorikkSection>
        </Historikkhendelse>
    );
};
