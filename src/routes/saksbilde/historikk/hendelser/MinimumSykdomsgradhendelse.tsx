import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { Inntektskilde } from '@io/graphql';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { HistorikkSection } from '@saksbilde/historikk/komponenter/HistorikkSection';
import { MinimumSykdomsgradhendelseObject } from '@typer/historikk';
import { NORSK_DATOFORMAT } from '@utils/date';

import styles from './Overstyringshendelse.module.css';

type MinimumSykdomsgradhendelseProps = Omit<MinimumSykdomsgradhendelseObject, 'type' | 'id'>;

export const MinimumSykdomsgradhendelse = ({
    saksbehandler,
    timestamp,
    minimumSykdomsgrad,
}: MinimumSykdomsgradhendelseProps): ReactElement => (
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
            <BodyShort className={styles.begrunnelse}>{minimumSykdomsgrad.begrunnelse}</BodyShort>
        </HistorikkSection>
    </Historikkhendelse>
);
