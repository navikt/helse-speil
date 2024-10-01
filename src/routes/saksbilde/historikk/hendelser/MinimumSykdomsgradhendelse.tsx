import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { Inntektskilde } from '@io/graphql';
import {
    MINIMUM_SYKDOMSGRAD_AVSLAG_TEKST,
    MINIMUM_SYKDOMSGRAD_INNVILGELSE_TEKST,
} from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/MinimumSykdomsgradForm';
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
            title="Minimum sykdomsgrad vurdert"
            icon={
                <Kilde type={Inntektskilde.Saksbehandler}>
                    <PersonPencilFillIcon title="Saksbehandler ikon" height={20} width={20} />
                </Kilde>
            }
        >
            <ExpandableHistorikkContent>
                <div className={styles.Grid}>
                    <BodyShort weight="semibold">Konklusjon</BodyShort>
                    <BodyShort>
                        {minimumSykdomsgrad.vurdering
                            ? MINIMUM_SYKDOMSGRAD_INNVILGELSE_TEKST
                            : MINIMUM_SYKDOMSGRAD_AVSLAG_TEKST}
                    </BodyShort>
                    <BodyShort weight="semibold">Periode </BodyShort>
                    <BodyShort>
                        {dayjs(minimumSykdomsgrad.fom).format(NORSK_DATOFORMAT)} –{' '}
                        {dayjs(minimumSykdomsgrad.tom).format(NORSK_DATOFORMAT)}
                    </BodyShort>
                    <BodyShort weight="semibold">Begrunnelse </BodyShort>
                    <BodyShort className={styles.begrunnelse}>{minimumSykdomsgrad.begrunnelse}</BodyShort>
                </div>
            </ExpandableHistorikkContent>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </Hendelse>
    </>
);
