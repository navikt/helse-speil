import classNames from 'classnames';
import { motion } from 'framer-motion';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { CloseButton } from '@components/CloseButton';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useCurrentPerson, useIsFetchingPerson } from '@state/person';

import { Arbeidsforholdoverstyringhendelse } from './hendelser/Arbeidsforholdoverstyringhendelse';
import { Dagoverstyringhendelse } from './hendelser/Dagoverstyringhendelse';
import { Dokumenthendelse } from './hendelser/Dokumenthendelse';
import { HendelseSkeleton } from './hendelser/Hendelse';
import { Historikkhendelse } from './hendelser/Historikkhendelse';
import { Inntektoverstyringhendelse } from './hendelser/Inntektoverstyringhendelse';
import { Utbetalinghendelse } from './hendelser/Utbetalinghendelse';
import { Notathendelse } from './hendelser/notat/Notathendelse';
import { useFilterState, useFilteredHistorikk, useShowHistorikkState } from './state';

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

    const isLoading = useIsFetchingPerson();

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
                style={{ overflow: 'hidden', gridArea: 'høyremeny' }}
            >
                {isLoading && <HistorikkSkeleton />}
                {!isLoading && (
                    <div className={styles.Historikk}>
                        <ul>
                            <div>
                                {getHistorikkTitle(filter)}
                                <CloseButton onClick={() => setShowHistorikk(false)} />
                            </div>
                            {historikk.map((it: HendelseObject, index) => {
                                switch (it.type) {
                                    case 'Arbeidsforholdoverstyring': {
                                        return <Arbeidsforholdoverstyringhendelse key={it.id} {...it} />;
                                    }
                                    case 'Dagoverstyring': {
                                        return <Dagoverstyringhendelse key={it.id} {...it} />;
                                    }
                                    case 'Inntektoverstyring': {
                                        return <Inntektoverstyringhendelse key={`${it.id}-${index}`} {...it} />;
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
                )}
            </motion.div>
        </>
    );
};

export const HistorikkSkeleton = () => {
    return (
        <div className={styles.Historikk}>
            <ul>
                <div>
                    HISTORIKK
                    <CloseButton disabled />
                </div>
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
                <div>
                    <BodyShort>Noe gikk galt. Kan ikke vise historikk for perioden.</BodyShort>
                </div>
            </ul>
        </div>
    );
};

export const Historikk = () => {
    const isLoading = useIsFetchingPerson();
    const currentPerson = useCurrentPerson();

    if (!currentPerson && !isLoading) {
        return null;
    }

    return (
        <ErrorBoundary fallback={<HistorikkError />}>
            <HistorikkWithContent />
        </ErrorBoundary>
    );
};
