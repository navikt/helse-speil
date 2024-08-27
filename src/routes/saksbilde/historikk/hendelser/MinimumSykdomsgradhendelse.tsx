import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
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
            title="Minimum sykdomsgrad overstyrt"
            icon={
                <Kilde type={Inntektskilde.Saksbehandler}>
                    <PersonPencilFillIcon title="Saksbehandler ikon" height={20} width={20} />
                </Kilde>
            }
        >
            <ExpandableHistorikkContent>
                <div className={styles.Grid}>
                    <Bold>Vurdering </Bold>
                    <BodyShort>{minimumSykdomsgrad.vurdering ? 'Ja' : 'Nei'}</BodyShort>
                    <Bold>Periode </Bold>
                    <BodyShort>
                        {dayjs(minimumSykdomsgrad.fom).format(NORSK_DATOFORMAT)} –{' '}
                        {dayjs(minimumSykdomsgrad.tom).format(NORSK_DATOFORMAT)}
                    </BodyShort>
                    <Bold>Begrunnelse </Bold>
                    <BodyShort className={styles.begrunnelse}>{minimumSykdomsgrad.begrunnelse}</BodyShort>
                </div>
            </ExpandableHistorikkContent>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </Hendelse>
    </>
);
