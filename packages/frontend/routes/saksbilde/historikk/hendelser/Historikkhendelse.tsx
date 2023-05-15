import classNames from 'classnames';
// @ts-ignore
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

import { Cancel, Refresh, Send, Success } from '@navikt/ds-icons';

import { PeriodehistorikkType } from '@io/graphql';

import { Hendelse } from './Hendelse';
import { HendelseDate } from './HendelseDate';
import { MAX_TEXT_LENGTH_BEFORE_TRUNCATION } from './notat/constants';

import styles from './Historikkhendelse.module.css';
import notatStyles from './notat/Notathendelse.module.css';

const getTitle = (type: PeriodehistorikkType): string => {
    switch (type) {
        case PeriodehistorikkType.TotrinnsvurderingTilGodkjenning:
            return 'Sendt til godkjenning';
        case PeriodehistorikkType.TotrinnsvurderingRetur:
            return 'Returnert';
        case PeriodehistorikkType.TotrinnsvurderingAttestert:
            return 'Godkjent og utbetalt';
        case PeriodehistorikkType.VedtaksperiodeReberegnet:
            return 'Periode reberegnet';
        default:
            return '';
    }
};

const getIcon = (type: PeriodehistorikkType): ReactNode => {
    switch (type) {
        case PeriodehistorikkType.TotrinnsvurderingAttestert: {
            return <Success title="Success-ikon" className={classNames(styles.Innrammet, styles.Attestert)} />;
        }
        case PeriodehistorikkType.TotrinnsvurderingRetur: {
            return <Cancel title="Cancel-ikon" className={classNames(styles.Innrammet)} />;
        }
        case PeriodehistorikkType.TotrinnsvurderingTilGodkjenning: {
            return <Send title="Send-ikon" className={classNames(styles.Innrammet, styles.TilGodkjenning)} />;
        }
        case PeriodehistorikkType.VedtaksperiodeReberegnet: {
            return <Refresh title="Refresh-ikon" className={classNames(styles.Innrammet)} />;
        }
    }
};

interface HistorikkhendelseProps extends Omit<HistorikkhendelseObject, 'type' | 'id'> {}

export const Historikkhendelse: React.FC<HistorikkhendelseProps> = ({ historikktype, saksbehandler, timestamp }) => {
    const [expanded, setExpanded] = useState(false);
    const totrinnsvurderingReturTekst =
        'Perioden er automatisk reberegnet etter at den ble sendt til beslutter. Sjekk om evt. endringer har betydning for saken.';

    const isExpandable = () => {
        return totrinnsvurderingReturTekst.length > MAX_TEXT_LENGTH_BEFORE_TRUNCATION;
    };

    const toggleNotat = (event: React.KeyboardEvent) => {
        if (event.code === 'Enter' || event.code === 'Space') {
            setExpanded(isExpandable() && !expanded);
        }
    };

    return (
        <Hendelse title={getTitle(historikktype)} icon={getIcon(historikktype)}>
            {historikktype === PeriodehistorikkType.TotrinnsvurderingRetur && (
                <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={toggleNotat}
                    onClick={() => setExpanded(!expanded)}
                    className={notatStyles.NotatTextWrapper}
                >
                    <AnimatePresence exitBeforeEnter>
                        {expanded ? (
                            <motion.pre
                                key="pre"
                                className={notatStyles.Notat}
                                initial={{ height: 40 }}
                                exit={{ height: 40 }}
                                animate={{ height: 'auto' }}
                                transition={{
                                    type: 'tween',
                                    duration: 0.2,
                                    ease: 'easeInOut',
                                }}
                            >
                                {totrinnsvurderingReturTekst}
                            </motion.pre>
                        ) : (
                            <motion.p key="p" className={notatStyles.NotatTruncated}>
                                {totrinnsvurderingReturTekst}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            )}
            <HendelseDate timestamp={timestamp} ident={saksbehandler} />
        </Hendelse>
    );
};
