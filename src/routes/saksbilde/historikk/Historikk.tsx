import classNames from 'classnames';
import { motion } from 'framer-motion';
import React, { ReactElement } from 'react';

import { XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { OpenedDokument } from '@components/OpenedDokument';
import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { Historikkmeny } from '@saksbilde/historikk/Historikkmeny';
import { Annulleringhendelse } from '@saksbilde/historikk/hendelser/Annulleringhendelse';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { LagtPaVentHistorikkhendelse } from '@saksbilde/historikk/hendelser/LagtPaVentHistorikkhendelse';
import { MinimumSykdomsgradhendelse } from '@saksbilde/historikk/hendelser/MinimumSykdomsgradhendelse';
import { useFetchPersonQuery } from '@state/person';
import {
    Filtertype,
    HendelseObject,
    HistorikkhendelseObject,
    LagtPaVentHistorikkhendelseObject,
} from '@typer/historikk';

import { Notat } from '../notat/Notat';
import { AnnetArbeidsforholdoverstyringhendelse } from './hendelser/AnnetArbeidsforholdoverstyringhendelse';
import { Arbeidsforholdoverstyringhendelse } from './hendelser/Arbeidsforholdoverstyringhendelse';
import { Avslaghendelse } from './hendelser/Avslaghendelse';
import { Dagoverstyringhendelse } from './hendelser/Dagoverstyringhendelse';
import { HendelseSkeleton } from './hendelser/Hendelse';
import { Inntektoverstyringhendelse } from './hendelser/Inntektoverstyringhendelse';
import { Sykepengegrunnlagskjønnsfastsettinghendelse } from './hendelser/Sykepengegrunnlagskjønnsfastsettinghendelse';
import { Utbetalinghendelse } from './hendelser/Utbetalinghendelse';
import { Dokumenthendelse } from './hendelser/dokument/Dokumenthendelse';
import { Notathendelse } from './hendelser/notat/Notathendelse';
import { useFilterState, useFilteredHistorikk, useShowHistorikkState, useShowHøyremenyState } from './state';

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
    const person = data?.person ?? null;
    const historikk = useFilteredHistorikk(person);
    const [filter] = useFilterState();
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();
    const [showHøyremeny, _] = useShowHøyremenyState();

    useKeyboard([
        {
            key: Key.H,
            action: () => setShowHistorikk(!showHistorikk),
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
    ]);

    if (loading) return <HistorikkSkeleton />;

    return (
        <div className={styles['historikk-container']}>
            <JusterbarSidemeny
                defaultBredde={320}
                visSidemeny={showHøyremeny && showHistorikk}
                localStorageNavn="historikkBredde"
            >
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
                            <HStack className={styles.header}>
                                <div>{getHistorikkTitle(filter)}</div>
                                <button className={styles.xbutton} onClick={() => setShowHistorikk(false)}>
                                    <XMarkIcon title="lukk åpnet dokument" />
                                </button>
                            </HStack>
                            <ul>
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
                                            if (isLagtPaVent(it)) {
                                                return <LagtPaVentHistorikkhendelse key={it.id} {...it} />;
                                            } else {
                                                return <Historikkhendelse key={it.id} {...it} />;
                                            }
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
            {person && showHøyremeny && <OpenedDokument person={person} />}
            <Historikkmeny />
        </div>
    );
};

function isLagtPaVent(obj: HistorikkhendelseObject): obj is LagtPaVentHistorikkhendelseObject {
    return (obj as LagtPaVentHistorikkhendelseObject).årsaker !== undefined;
}

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
