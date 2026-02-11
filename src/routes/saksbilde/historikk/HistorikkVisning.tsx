import { motion } from 'motion/react';
import { ReactElement } from 'react';

import { BodyShort, HStack, LocalAlert, VStack } from '@navikt/ds-react';

import { OpenedDokument } from '@components/OpenedDokument';
import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';
import { PersonFragment } from '@io/graphql';
import { HendelseRenderer } from '@saksbilde/historikk/HendelseRenderer';
import { Historikkmeny } from '@saksbilde/historikk/Historikkmeny';
import { XKnapp } from '@saksbilde/historikk/XKnapp';
import { getHistorikkTitle } from '@saksbilde/historikk/constants/historikkTitles';
import { Notat } from '@saksbilde/notat/Notat';
import { Filtertype, HendelseObject } from '@typer/historikk';

export interface HistorikkVisningProps {
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

export function HistorikkVisning({
    person,
    historikk,
    filter,
    vedtaksperiodeId,
    erAnnullertBeregnetPeriode,
    visHistorikk,
    visHøyremeny,
    harNotatError,
    lukkHistorikk,
}: HistorikkVisningProps): ReactElement {
    return (
        <HStack style={{ gridArea: 'høyremeny' }}>
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
                    <VStack>
                        <HStack padding="space-16" justify="space-between" align="center">
                            <BodyShort size="small">{getHistorikkTitle(filter)}</BodyShort>
                            <XKnapp tittel="Lukk historikk" onClick={lukkHistorikk} />
                        </HStack>
                        <VStack as="ul" paddingInline="space-16" paddingBlock="space-0 space-32">
                            {filter !== 'Dokument' && filter !== 'Overstyring' && (
                                <Notat vedtaksperiodeId={vedtaksperiodeId} />
                            )}
                            {historikk.map((hendelse: HendelseObject, index) => (
                                <HendelseRenderer
                                    key={`${hendelse.type}-${hendelse.id}-${index}`}
                                    hendelse={hendelse}
                                    person={person}
                                    erAnnullertBeregnetPeriode={erAnnullertBeregnetPeriode}
                                />
                            ))}
                        </VStack>
                    </VStack>
                </motion.div>
            </JusterbarSidemeny>
            {visHøyremeny && <OpenedDokument person={person} />}
            <Historikkmeny />
        </HStack>
    );
}
