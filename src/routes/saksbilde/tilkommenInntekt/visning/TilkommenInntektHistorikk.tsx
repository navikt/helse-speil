import classNames from 'classnames';
import { motion } from 'motion/react';
import React, { ReactElement } from 'react';

import { XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { OpenedDokument } from '@components/OpenedDokument';
import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { TilkommenInntektHendelse } from '@saksbilde/historikk/hendelser/TilkommenInntektHendelse';
import { HistorikkSkeleton } from '@saksbilde/historikk/komponenter/HistorikkSkeleton';
import { useFetchPersonQuery } from '@state/person';
import { useTilkommenInntektIdFraUrl } from '@state/routing';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';

import { useShowHistorikkState, useShowHøyremenyState } from '../../historikk/state';

import styles from '../../historikk/Historikk.module.css';

const TilkommenInntektHistorikkWithContent = (): ReactElement => {
    const { loading: fetchPersonLoading, data: fetchPersonData } = useFetchPersonQuery();
    const person = fetchPersonData?.person ?? null;
    const { loading: hentTilkommenInntektLoading, data: hentTilkommenInntektData } = useHentTilkommenInntektQuery(
        person?.aktorId,
    );
    const tilkommenInntektId = useTilkommenInntektIdFraUrl();
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

    if (fetchPersonLoading || hentTilkommenInntektLoading) return <HistorikkSkeleton />;

    const tilkommenInntekt = hentTilkommenInntektData?.restPersonTilkomneInntektskilderGet
        ?.flatMap((tilkommenInntektskilde) => tilkommenInntektskilde.inntekter)
        .find((tilkommenInntekt) => tilkommenInntekt.tilkommenInntektId === tilkommenInntektId);
    const events =
        tilkommenInntekt?.events?.toSorted((a, b) => b.metadata.sekvensnummer - a.metadata.sekvensnummer) ?? [];

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
                    <div className={styles.historikk}>
                        <HStack className={styles.header}>
                            <div>HISTORIKK</div>
                            <button className={styles.xbutton} onClick={() => setShowHistorikk(false)}>
                                <XMarkIcon title="Lukk historikk" />
                            </button>
                        </HStack>
                        <ul>
                            {events.map((event) => (
                                <TilkommenInntektHendelse key={event.metadata.sekvensnummer} event={event} />
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </JusterbarSidemeny>
            {person && showHøyremeny && <OpenedDokument person={person} />}
        </div>
    );
};

const TilkommenInntektHistorikkError = (): ReactElement => {
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

export const TilkommenInntektHistorikk = (): ReactElement => {
    return (
        <ErrorBoundary fallback={<TilkommenInntektHistorikkError />}>
            <TilkommenInntektHistorikkWithContent />
        </ErrorBoundary>
    );
};
