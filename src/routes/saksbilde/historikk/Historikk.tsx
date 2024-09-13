import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { ReactElement } from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';
import { ÅpnetDokument } from '@components/ÅpnetDokument';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { Historikkmeny } from '@saksbilde/historikk/Historikkmeny';
import { Annulleringhendelse } from '@saksbilde/historikk/hendelser/Annulleringhendelse';
import { MinimumSykdomsgradhendelse } from '@saksbilde/historikk/hendelser/MinimumSykdomsgradhendelse';
import { useFetchPersonQuery } from '@state/person';
import { Filtertype, HendelseObject } from '@typer/historikk';

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

const HistorikkWithContent = (): ReactElement => {
    const { loading, data } = useFetchPersonQuery();
    const historikk = useFilteredHistorikk();
    const [filter] = useFilterState();
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();

    useKeyboard([
        {
            key: Key.H,
            action: () => setShowHistorikk(!showHistorikk),
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
    ]);

    const person = data?.person ?? null;

    if (loading) return <HistorikkSkeleton />;

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
                    {person && (
                        <div className={styles.historikk}>
                            <ul>
                                <div>{getHistorikkTitle(filter)}</div>
                                {filter !== 'Dokument' && filter !== 'Overstyring' && <Notat person={person} />}
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
                                        case 'MinimumSykdomsgradoverstyring': {
                                            return <MinimumSykdomsgradhendelse key={`${it.id}-${index}`} {...it} />;
                                        }
                                        case 'Dokument': {
                                            return <Dokumenthendelse key={it.id} {...it} person={person} />;
                                        }
                                        case 'Notat': {
                                            return <Notathendelse key={it.id} person={person} {...it} />;
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
                                        case 'Annullering': {
                                            return <Annulleringhendelse key={it.id} {...it} />;
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
            {person && <ÅpnetDokument person={person} />}
            <Historikkmeny />
        </div>
    );
};

export const HistorikkSkeleton = (): ReactElement => {
    return (
        <HStack className={styles.historikkskeletonwrapper}>
            <div className={styles.historikkskeleton}>
                <ul>
                    <div>HISTORIKK</div>
                    <HendelseSkeleton enLinje />
                    <HendelseSkeleton />
                    <HendelseSkeleton />
                </ul>
            </div>
            <VStack gap="6" className={styles.historikkskeletonmeny}>
                <LoadingShimmer style={{ borderRadius: '100%', height: 32 }} />
                <LoadingShimmer style={{ borderRadius: '100%', height: 32 }} />
                <LoadingShimmer style={{ borderRadius: '100%', height: 32 }} />
                <LoadingShimmer style={{ borderRadius: '100%', height: 32 }} />
            </VStack>
        </HStack>
    );
};

const HistorikkError = (): ReactElement => {
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

export const Historikk = (): ReactElement => {
    return (
        <ErrorBoundary fallback={<HistorikkError />}>
            <HistorikkWithContent />
        </ErrorBoundary>
    );
};
