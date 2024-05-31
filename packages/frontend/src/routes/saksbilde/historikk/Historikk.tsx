import classNames from 'classnames';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';
import { ÅpnetDokument } from '@components/ÅpnetDokument';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { useCurrentPerson, useFetchPersonQuery } from '@state/person';
import { onLazyLoadFail } from '@utils/error';

import { Notat } from '../notat/Notat';
import { AnnetArbeidsforholdoverstyringhendelse } from './hendelser/AnnetArbeidsforholdoverstyringhendelse';
import { Arbeidsforholdoverstyringhendelse } from './hendelser/Arbeidsforholdoverstyringhendelse';
import { Avslaghendelse } from './hendelser/Avslaghendelse';
import { Dagoverstyringhendelse } from './hendelser/Dagoverstyringhendelse';
import { HendelseSkeleton } from './hendelser/Hendelse';
import { Historikkhendelse } from './hendelser/Historikkhendelse';
import { Inntektoverstyringhendelse } from './hendelser/Inntektoverstyringhendelse';
import { Sykepengegrunnlagskjønnsfastsettinghendelse } from './hendelser/Sykepengegrunnlagskjønnsfastsettinghendelse';
import { Utbetalinghendelse } from './hendelser/Utbetalinghendelse';
import { Dokumenthendelse } from './hendelser/dokument/Dokumenthendelse';
import { Notathendelse } from './hendelser/notat/Notathendelse';
import { useFilterState, useFilteredHistorikk, useShowHistorikkState } from './state';

import styles from './Historikk.module.css';

const Historikkmeny = dynamic(() =>
    import('../historikk/Historikkmeny').then((res) => ({ default: res.Historikkmeny })).catch(onLazyLoadFail),
);

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
        case 'Overstyring': {
            return 'OVERSTYRINGER';
        }
    }
};

const HistorikkWithContent: React.FC = () => {
    const historikk = useFilteredHistorikk();
    const [filter] = useFilterState();

    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();

    const { loading } = useFetchPersonQuery();
    useKeyboard([
        {
            key: Key.H,
            action: () => setShowHistorikk(!showHistorikk),
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
    ]);

    return (
        <div className={styles['historikk-container']}>
            <JusterbarSidemeny defaultBredde={320} visSidemeny={showHistorikk} localStorageNavn="historikkBredde">
                <motion.div
                    key="historikk"
                    transition={{
                        type: 'tween',
                        duration: 0.2,
                        ease: 'easeInOut',
                    }}
                    style={{ overflow: 'hidden' }}
                >
                    {loading && <HistorikkSkeleton />}
                    {!loading && (
                        <div className={styles.historikk}>
                            <ul>
                                <div>{getHistorikkTitle(filter)}</div>
                                {filter !== 'Dokument' && filter !== 'Overstyring' && <Notat />}
                                {historikk.map((it: HendelseObject, index) => {
                                    switch (it.type) {
                                        case 'Arbeidsforholdoverstyring': {
                                            return <Arbeidsforholdoverstyringhendelse key={it.id} {...it} />;
                                        }
                                        case 'AnnetArbeidsforholdoverstyring': {
                                            return <AnnetArbeidsforholdoverstyringhendelse key={it.id} {...it} />;
                                        }
                                        case 'Dagoverstyring': {
                                            return <Dagoverstyringhendelse key={it.id} {...it} />;
                                        }
                                        case 'Inntektoverstyring': {
                                            return <Inntektoverstyringhendelse key={`${it.id}-${index}`} {...it} />;
                                        }
                                        case 'Sykepengegrunnlagskjonnsfastsetting': {
                                            return (
                                                <Sykepengegrunnlagskjønnsfastsettinghendelse
                                                    key={`${it.id}-${index}`}
                                                    {...it}
                                                />
                                            );
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
                                        case 'Avslag': {
                                            return <Avslaghendelse key={it.id} {...it} />;
                                        }
                                        default:
                                            return null;
                                    }
                                })}
                            </ul>
                        </div>
                    )}
                </motion.div>
            </JusterbarSidemeny>
            <ÅpnetDokument />
            <Historikkmeny />
        </div>
    );
};

export const HistorikkSkeleton = () => {
    return (
        <div className={styles.historikk}>
            <ul>
                <div>HISTORIKK</div>
                <HendelseSkeleton />
                <HendelseSkeleton />
                <HendelseSkeleton />
            </ul>
        </div>
    );
};

const HistorikkError = () => {
    return (
        <div className={classNames(styles.historikk, styles.error)}>
            <ul>
                <div>
                    <BodyShort>Noe gikk galt. Kan ikke vise historikk for perioden.</BodyShort>
                </div>
            </ul>
        </div>
    );
};

export const Historikk = () => {
    const { loading } = useFetchPersonQuery();
    const currentPerson = useCurrentPerson();

    if (!currentPerson && !loading) {
        return null;
    }

    return (
        <ErrorBoundary fallback={<HistorikkError />}>
            <HistorikkWithContent />
        </ErrorBoundary>
    );
};
