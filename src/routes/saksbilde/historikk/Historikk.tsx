import { motion } from 'motion/react';
import React, { ReactElement } from 'react';

import { XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, LocalAlert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { OpenedDokument } from '@components/OpenedDokument';
import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { PersonFragment } from '@io/graphql';
import { useGetNotaterForVedtaksperiode } from '@io/rest/generated/notater/notater';
import { isAnnullertBeregnetPeriode } from '@saksbilde/SaksbildeVarsel';
import { HendelseRenderer } from '@saksbilde/historikk/HendelseRenderer';
import { Historikkmeny } from '@saksbilde/historikk/Historikkmeny';
import { getHistorikkTitle } from '@saksbilde/historikk/constants/historikkTitles';
import { HistorikkSkeleton } from '@saksbilde/historikk/komponenter/HistorikkSkeleton';
import {
    useFilterState,
    useFilteredHistorikk,
    useShowHistorikkState,
    useShowHøyremenyState,
} from '@saksbilde/historikk/state';
import { Notat } from '@saksbilde/notat/Notat';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { Filtertype, HendelseObject } from '@typer/historikk';
import { cn } from '@utils/tw';
import { isGhostPeriode } from '@utils/typeguards';

import styles from './Historikk.module.css';

function HistorikkWithContent(): ReactElement | null {
    const { loading, data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const aktivPeriode = useActivePeriod(person);
    const vedtaksperiodeId = (isGhostPeriode(aktivPeriode) ? undefined : aktivPeriode?.vedtaksperiodeId) ?? '';
    const {
        data: notatData,
        isPending: notaterLoading,
        isError: harNotatError,
    } = useGetNotaterForVedtaksperiode(vedtaksperiodeId);
    const historikk = useFilteredHistorikk(person, notatData ?? []);
    const [filter] = useFilterState();
    const [showHistorikk, setShowHistorikk] = useShowHistorikkState();
    const [showHøyremeny] = useShowHøyremenyState();

    useKeyboard([
        {
            key: Key.H,
            action: () => setShowHistorikk(!showHistorikk),
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
    ]);

    if (loading || notaterLoading) return <HistorikkSkeleton />;
    else if (aktivPeriode == null || person == null || isGhostPeriode(aktivPeriode)) return null;

    return (
        <HistorikkVisning
            person={person}
            historikk={historikk}
            filter={filter}
            vedtaksperiodeId={aktivPeriode.vedtaksperiodeId}
            erAnnullertBeregnetPeriode={isAnnullertBeregnetPeriode(aktivPeriode)}
            visHistorikk={showHistorikk}
            visHøyremeny={showHøyremeny}
            harNotatError={harNotatError}
            lukkHistorikk={() => setShowHistorikk(false)}
        />
    );
}

interface HistorikkVisningProps {
    person: PersonFragment;
    historikk: HendelseObject[];
    filter: Filtertype;
    vedtaksperiodeId: string;
    erAnnullertBeregnetPeriode: boolean;
    visHistorikk: boolean;
    visHøyremeny: boolean;
    harNotatError: boolean;
    lukkHistorikk: () => void;
}
function HistorikkVisning({
    person,
    historikk,
    filter,
    vedtaksperiodeId,
    erAnnullertBeregnetPeriode,
    visHistorikk,
    visHøyremeny,
    harNotatError,
    lukkHistorikk,
}: HistorikkVisningProps) {
    return (
        <div className={styles['historikk-container']}>
            <JusterbarSidemeny
                defaultBredde={320}
                visSidemeny={visHøyremeny && visHistorikk}
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
                    {harNotatError && <LocalAlert status="error">Kunne ikke hente notater</LocalAlert>}
                    <div className={styles.historikk}>
                        <HStack className={styles.header}>
                            <div>{getHistorikkTitle(filter)}</div>
                            <button className={styles.xbutton} onClick={lukkHistorikk}>
                                <XMarkIcon title="lukk historikk" />
                            </button>
                        </HStack>
                        <ul>
                            {filter !== 'Dokument' && filter !== 'Overstyring' && (
                                <Notat vedtaksperiodeId={vedtaksperiodeId} />
                            )}
                            {historikk.map((it: HendelseObject, index) => (
                                <HendelseRenderer
                                    key={`${it.type}-${it.id}-${index}`}
                                    hendelse={it}
                                    person={person}
                                    erAnnullertBeregnetPeriode={erAnnullertBeregnetPeriode}
                                />
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </JusterbarSidemeny>
            {visHøyremeny && <OpenedDokument person={person} />}
            <Historikkmeny />
        </div>
    );
}

function HistorikkError(): ReactElement {
    return (
        <div className={cn(styles.historikk, styles.error)}>
            <ul>
                <div>
                    <BodyShort>Noe gikk galt. Kan ikke vise historikk for perioden.</BodyShort>
                </div>
            </ul>
        </div>
    );
}

export function Historikk(): ReactElement {
    return (
        <ErrorBoundary fallback={<HistorikkError />}>
            <HistorikkWithContent />
        </ErrorBoundary>
    );
}
