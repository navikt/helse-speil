import React, { ReactElement } from 'react';

import { CheckmarkCircleIcon } from '@navikt/aksel-icons';

import { Utbetalingtype } from '@io/graphql';
import { UtbetalinghendelseObject } from '@typer/historikk';

import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';

import styles from './Historikkhendelse.module.css';

const getTitle = (type: Utbetalingtype, automatisk: boolean, godkjent: boolean): string => {
    if (automatisk) {
        return godkjent ? 'Godkjent' : 'Kunne ikke behandles her';
    }

    switch (type) {
        case Utbetalingtype.Revurdering: {
            return 'Revurdering godkjent';
        }
        case Utbetalingtype.Annullering: {
            return 'Annullert';
        }
        case Utbetalingtype.Etterutbetaling:
        case Utbetalingtype.Feriepenger:
        case Utbetalingtype.Ukjent:
        case Utbetalingtype.Utbetaling:
        default: {
            return 'Godkjent';
        }
    }
};

type UtbetalinghendelseProps = Omit<UtbetalinghendelseObject, 'type' | 'id'>;

export const Utbetalinghendelse = ({
    automatisk,
    godkjent,
    utbetalingstype,
    saksbehandler,
    timestamp,
}: UtbetalinghendelseProps): ReactElement => {
    const icon =
        utbetalingstype !== Utbetalingtype.Annullering && godkjent ? (
            <CheckmarkCircleIcon title="Checkmark-circle-ikon" className={styles.Innrammet} />
        ) : undefined;
    return (
        <Hendelse title={getTitle(utbetalingstype, automatisk, godkjent)} icon={icon}>
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </Hendelse>
    );
};
