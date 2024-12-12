import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { Inntektskilde } from '@io/graphql';
import { MinimumSykdomsgradhendelseObject } from '@typer/historikk';
import { NORSK_DATOFORMAT } from '@utils/date';

import { ExpandableHistorikkContent } from './ExpandableHistorikkContent';
import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';

import styles from './Overstyringshendelse.module.css';

type MinimumSykdomsgradhendelseProps = Omit<MinimumSykdomsgradhendelseObject, 'type' | 'id'>;

export const MinimumSykdomsgradhendelse = ({
    saksbehandler,
    timestamp,
    minimumSykdomsgrad,
}: MinimumSykdomsgradhendelseProps): ReactElement => (
    <>
        <Hendelse
            title="Arbeidstid vurdert"
            icon={
                <Kilde type={Inntektskilde.Saksbehandler}>
                    <PersonPencilFillIcon title="Saksbehandler ikon" />
                </Kilde>
            }
        >
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
            <ExpandableHistorikkContent>
                <div className={styles.Grid}>
                    {minimumSykdomsgrad.perioderVurdertOk.length > 0 && (
                        <>
                            <BodyShort weight="semibold">Innvilgede perioder</BodyShort>
                            <BodyShort>
                                {minimumSykdomsgrad.perioderVurdertOk
                                    .map(
                                        (periode) =>
                                            `${dayjs(periode.fom).format(NORSK_DATOFORMAT)} – ${dayjs(periode.tom).format(NORSK_DATOFORMAT)}`,
                                    )
                                    .join(', ')
                                    .replace(/,(?=[^,]*$)/, ' og')}
                            </BodyShort>
                        </>
                    )}
                    {minimumSykdomsgrad.perioderVurdertIkkeOk.length > 0 && (
                        <>
                            <BodyShort weight="semibold">Avslåtte perioder</BodyShort>
                            <BodyShort>
                                {minimumSykdomsgrad.perioderVurdertIkkeOk
                                    .map(
                                        (periode) =>
                                            `${dayjs(periode.fom).format(NORSK_DATOFORMAT)} – ${dayjs(periode.tom).format(NORSK_DATOFORMAT)}`,
                                    )
                                    .join(', ')
                                    .replace(/,(?=[^,]*$)/, ' og')}
                            </BodyShort>
                        </>
                    )}
                    <BodyShort weight="semibold">Notat til beslutter</BodyShort>
                    <BodyShort className={styles.begrunnelse}>{minimumSykdomsgrad.begrunnelse}</BodyShort>
                </div>
            </ExpandableHistorikkContent>
        </Hendelse>
    </>
);
