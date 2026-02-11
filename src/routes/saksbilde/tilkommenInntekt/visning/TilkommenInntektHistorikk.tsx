import { motion } from 'motion/react';
import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { OpenedDokument } from '@components/OpenedDokument';
import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { historikkFeil } from '@saksbilde/historikk/HistorikkFeil';
import { XKnapp } from '@saksbilde/historikk/XKnapp';
import { TilkommenInntektHendelse } from '@saksbilde/historikk/hendelser/TilkommenInntektHendelse';
import { HistorikkSkeleton } from '@saksbilde/historikk/komponenter/HistorikkSkeleton';
import { useShowHistorikkState, useShowHøyremenyState } from '@saksbilde/historikk/state';
import { useFetchPersonQuery } from '@state/person';
import { useTilkommenInntektIdFraUrl } from '@state/routing';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';

const TilkommenInntektHistorikkWithContent = (): ReactElement => {
    const { loading: fetchPersonLoading, data: fetchPersonData } = useFetchPersonQuery();
    const person = fetchPersonData?.person ?? null;
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { isFetching: hentTilkommenInntektLoading, data: tilkommenInntektData } =
        useHentTilkommenInntektQuery(personPseudoId);
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

    const tilkommenInntekt = tilkommenInntektData
        ?.flatMap((tilkommenInntektskilde) => tilkommenInntektskilde.inntekter)
        .find((tilkommenInntekt) => tilkommenInntekt.tilkommenInntektId === tilkommenInntektId);
    const events =
        tilkommenInntekt?.events?.toSorted((a, b) => b.metadata.sekvensnummer - a.metadata.sekvensnummer) ?? [];

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
                                <TilkommenInntektHendelse key={event.metadata.sekvensnummer} event={event} />
                            ))}
                        </VStack>
                    </VStack>
                </motion.div>
            </JusterbarSidemeny>
            {person && showHøyremeny && <OpenedDokument person={person} />}
        </HStack>
    );
};

export const TilkommenInntektHistorikk = (): ReactElement => {
    return (
        <ErrorBoundary fallback={historikkFeil}>
            <TilkommenInntektHistorikkWithContent />
        </ErrorBoundary>
    );
};
