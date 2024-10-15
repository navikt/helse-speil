import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactElement, ReactNode, useState } from 'react';

import {
    ArrowUndoIcon,
    ArrowsSquarepathIcon,
    CheckmarkCircleIcon,
    PaperplaneIcon,
    TimerPauseIcon,
    XMarkOctagonIcon,
} from '@navikt/aksel-icons';

import { PeriodehistorikkType } from '@io/graphql';
import { HistorikkhendelseObject } from '@typer/historikk';

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
        case PeriodehistorikkType.FjernFraPaVent:
            return 'Fjernet fra på vent';
        case PeriodehistorikkType.StansAutomatiskBehandling:
            return 'Automatisk behandling stanset';
        default:
            return '';
    }
};

const getIcon = (type: PeriodehistorikkType): ReactNode => {
    switch (type) {
        case PeriodehistorikkType.TotrinnsvurderingAttestert: {
            return <CheckmarkCircleIcon title="Sjekkmerke ikon" className={styles.Innrammet} />;
        }
        case PeriodehistorikkType.TotrinnsvurderingRetur: {
            return <ArrowUndoIcon title="Pil tilbake ikon" className={classNames(styles.Innrammet)} />;
        }
        case PeriodehistorikkType.TotrinnsvurderingTilGodkjenning: {
            return <PaperplaneIcon title="Papirfly ikon" className={styles.Innrammet} />;
        }
        case PeriodehistorikkType.VedtaksperiodeReberegnet: {
            return <ArrowsSquarepathIcon title="Piler Firkantsti ikon" className={classNames(styles.Innrammet)} />;
        }
        case PeriodehistorikkType.FjernFraPaVent: {
            return <TimerPauseIcon title="Timer ikon" className={classNames(styles.Innrammet, styles.pavent)} />;
        }
        case PeriodehistorikkType.StansAutomatiskBehandling: {
            return <XMarkOctagonIcon title="Stopp ikon" className={classNames(styles.Innrammet, styles.opphevstans)} />;
        }
    }
};

type HistorikkhendelseProps = Omit<HistorikkhendelseObject, 'type' | 'id'>;

export const Historikkhendelse = ({
    historikktype,
    saksbehandler,
    timestamp,
}: HistorikkhendelseProps): ReactElement => {
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
                    <AnimatePresence mode="wait">
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
