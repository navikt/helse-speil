import { motion } from 'motion/react';
import React, { ReactElement } from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { OpenedDokument } from '@components/OpenedDokument';
import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { AndreYtelserHistorikkmeny } from '@saksbilde/andreYtelser/AndreYtelserHistorikkmeny';
import { useAlleGraderteAndreYtelser } from '@saksbilde/andreYtelser/useAlleGraderteAndreYtelser';
import { historikkFeil } from '@saksbilde/historikk/HistorikkFeil';
import { XKnapp } from '@saksbilde/historikk/XKnapp';
import { AndreYtelserHendelse } from '@saksbilde/historikk/hendelser/AndreYtelserHendelse';
import { HistorikkSkeleton } from '@saksbilde/historikk/komponenter/HistorikkSkeleton';
import { useShowHistorikkState, useShowHøyremenyState } from '@saksbilde/historikk/state';
import { useFetchPersonQuery } from '@state/person';
import { useGraderteAndreYtelserIdFraUrl } from '@state/routing';

const AndreYtelserHistorikkWithContent = (): ReactElement => {
    const { loading: fetchPersonLoading, data: fetchPersonData } = useFetchPersonQuery();
    const person = fetchPersonData?.person ?? null;
    const { ytelser, isPending: andreYtelserLoading } = useAlleGraderteAndreYtelser();
    const andreYtelserId = useGraderteAndreYtelserIdFraUrl();
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

    if (fetchPersonLoading || andreYtelserLoading) return <HistorikkSkeleton />;

    const ytelse = ytelser?.find((it) => it.andreYtelserId === andreYtelserId);
    const events = ytelse?.events?.toSorted((a, b) => b.metadata.sekvensnummer - a.metadata.sekvensnummer) ?? [];

    return (
        <HStack style={{ gridArea: 'høyremeny' }}>
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
                    <VStack>
                        <HStack padding="space-16" justify="space-between" align="center">
                            <BodyShort size="small">HISTORIKK</BodyShort>
                            <XKnapp tittel="Lukk historikk" onClick={() => setShowHistorikk(false)} />
                        </HStack>
                        <VStack as="ul" paddingInline="space-16" paddingBlock="space-0 space-32">
                            {events.map((event) => (
                                <AndreYtelserHendelse key={event.metadata.sekvensnummer} event={event} />
                            ))}
                        </VStack>
                    </VStack>
                </motion.div>
            </JusterbarSidemeny>
            {person && showHøyremeny && <OpenedDokument person={person} />}
            <AndreYtelserHistorikkmeny />
        </HStack>
    );
};

export const AndreYtelserHistorikk = (): ReactElement => {
    return (
        <ErrorBoundary fallback={historikkFeil}>
            <AndreYtelserHistorikkWithContent />
        </ErrorBoundary>
    );
};
