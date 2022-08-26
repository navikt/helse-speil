import React from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { BodyShort } from '@navikt/ds-react';

import { CloseButton } from '@components/CloseButton';
import { ErrorBoundary } from '@components/ErrorBoundary';

import { Notathendelse } from './hendelser/Notathendelse';
import { HendelseSkeleton } from './hendelser/Hendelse';
import { Dokumenthendelse } from './hendelser/Dokumenthendelse';
import { Historikkhendelse } from './hendelser/Historikkhendelse';
import { Utbetalinghendelse } from './hendelser/Utbetalinghendelse';
import { Dagoverstyringhendelse } from './hendelser/Dagoverstyringhendelse';
import { Inntektoverstyringhendelse } from './hendelser/Inntektoverstyringhendelse';
import { Arbeidsforholdoverstyringhendelse } from './hendelser/Arbeidsforholdoverstyringhendelse';
import { useFilteredHistorikk, useFilterState, useShowHistorikkState } from './state';

import styles from './Historikk.module.css';

const getHistorikkTitle = (type: Filtertype): string => {
    switch (type) {
        case 'Dokument': {
            return 'DOKUMENTER';
        }
        case 'Historikk': {
            return 'HISTORIKK';
        }
        case 'Notat': {
            return 'NOTATER';
        }
    }
};

const HistorikkWithContent: React.FC = () => {
    const historikk = useFilteredHistorikk();
    const [filter] = useFilterState();

    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();

    return (
        <>
            <motion.div
                key="behandlingsstatistikk"
                initial={{ width: showHistorikk ? 'max-content' : 0 }}
                animate={{ width: showHistorikk ? 'max-content' : 0 }}
                transition={{
                    type: 'tween',
                    duration: 0.2,
                    ease: 'easeInOut',
                }}
                style={{ overflow: 'hidden' }}
            >
                <div className={styles.Historikk}>
                    <ul>
                        <li>
                            {getHistorikkTitle(filter)}
                            <CloseButton onClick={() => setShowHistorikk(false)} />
                        </li>
                        {historikk.map((it: HendelseObject) => {
                            switch (it.type) {
                                case 'Arbeidsforholdoverstyring': {
                                    return <Arbeidsforholdoverstyringhendelse key={it.id} {...it} />;
                                }
                                case 'Dagoverstyring': {
                                    return <Dagoverstyringhendelse key={it.id} {...it} />;
                                }
                                case 'Inntektoverstyring': {
                                    return <Inntektoverstyringhendelse key={it.id} {...it} />;
                                }
                                case 'Dokument': {
                                    return <Dokumenthendelse key={it.id} {...it} />;
                                }
                                case 'Notat': {
                                    return <Notathendelse key={it.id} {...it} />;
                                }
                                case 'Utbetaling': {
                                    return <Utbetalinghendelse key={it.id} {...it} />;
                                }
                                case 'Historikk': {
                                    return <Historikkhendelse key={it.id} {...it} />;
                                }
                                default:
                                    return null;
                            }
                        })}
                    </ul>
                </div>
            </motion.div>
        </>
    );
};

export const HistorikkSkeleton = () => {
    return (
        <div className={styles.Historikk}>
            <ul>
                <li>
                    HISTORIKK
                    <CloseButton disabled />
                </li>
                <HendelseSkeleton />
                <HendelseSkeleton />
                <HendelseSkeleton />
            </ul>
        </div>
    );
};

const HistorikkError = () => {
    return (
        <div className={classNames(styles.Historikk, styles.Error)}>
            <ul>
                <li>
                    <BodyShort>Noe gikk galt. Kan ikke vise historikk for perioden.</BodyShort>
                </li>
            </ul>
        </div>
    );
};

export const Historikk = () => {
    return (
        <React.Suspense fallback={<HistorikkSkeleton />}>
            <ErrorBoundary fallback={<HistorikkError />}>
                <HistorikkWithContent />
            </ErrorBoundary>
        </React.Suspense>
    );
};
