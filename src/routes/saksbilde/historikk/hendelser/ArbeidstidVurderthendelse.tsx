import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { Kilde } from '@components/Kilde';
import { Inntektskilde } from '@io/graphql';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { MinimumSykdomsgradhendelseObject } from '@typer/historikk';
import { NORSK_DATOFORMAT } from '@utils/date';

type ArbeidstidVurderthendelseProps = Omit<MinimumSykdomsgradhendelseObject, 'type' | 'id'>;

export const ArbeidstidVurderthendelse = ({
    saksbehandler,
    timestamp,
    minimumSykdomsgrad,
}: ArbeidstidVurderthendelseProps): ReactElement => (
    <Historikkhendelse
        icon={
            <Kilde type={Inntektskilde.Saksbehandler}>
                <PersonPencilFillIcon title="Saksbehandler ikon" />
            </Kilde>
        }
        title="Arbeidstid vurdert"
        timestamp={timestamp}
        saksbehandler={saksbehandler}
        aktiv={false}
    >
        {minimumSykdomsgrad.perioderVurdertOk.length > 0 && (
            <HistorikkSection tittel="Innvilgede perioder">
                <BodyShort>
                    {minimumSykdomsgrad.perioderVurdertOk
                        .map(
                            (periode) =>
                                `${dayjs(periode.fom).format(NORSK_DATOFORMAT)} – ${dayjs(periode.tom).format(NORSK_DATOFORMAT)}`,
                        )
                        .join(', ')
                        .replace(/,(?=[^,]*$)/, ' og')}
                </BodyShort>
            </HistorikkSection>
        )}
        {minimumSykdomsgrad.perioderVurdertIkkeOk.length > 0 && (
            <HistorikkSection tittel="Avslåtte perioder">
                <BodyShort>
                    {minimumSykdomsgrad.perioderVurdertIkkeOk
                        .map(
                            (periode) =>
                                `${dayjs(periode.fom).format(NORSK_DATOFORMAT)} – ${dayjs(periode.tom).format(NORSK_DATOFORMAT)}`,
                        )
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
