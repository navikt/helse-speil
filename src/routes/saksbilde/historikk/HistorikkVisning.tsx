import { motion } from 'motion/react';
import { ReactElement } from 'react';

import { XMarkIcon } from '@navikt/aksel-icons';
import { HStack, LocalAlert } from '@navikt/ds-react';

import { OpenedDokument } from '@components/OpenedDokument';
import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';
import { PersonFragment } from '@io/graphql';
import { HendelseRenderer } from '@saksbilde/historikk/HendelseRenderer';
import { Historikkmeny } from '@saksbilde/historikk/Historikkmeny';
import { getHistorikkTitle } from '@saksbilde/historikk/constants/historikkTitles';
import { Notat } from '@saksbilde/notat/Notat';
import { Filtertype, HendelseObject } from '@typer/historikk';

import styles from './Historikk.module.css';

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
