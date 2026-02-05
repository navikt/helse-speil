import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { XMarkIcon } from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { PersonFragment } from '@io/graphql';
import { Inntektsmeldingsinnhold } from '@saksbilde/historikk/hendelser/dokument/Inntektsmeldingsinnhold';
import { Søknadsinnhold } from '@saksbilde/historikk/hendelser/dokument/Søknadsinnhold';
import {
    getKildetekst,
    getKildetype,
    useOpenedDocuments,
    useRemoveOpenedDocument,
} from '@saksbilde/historikk/hendelser/dokument/dokument';
import { HendelseDate } from '@saksbilde/historikk/komponenter/HendelseDate';
import { cn } from '@utils/tw';

import styles from './ÅpnetDokument.module.scss';

interface OpenedDokumentProps {
    person: PersonFragment;
}

export const OpenedDokument = ({ person }: OpenedDokumentProps): ReactElement | null => {
    const fjernÅpnetDokument = useRemoveOpenedDocument();
    const åpnedeDokumenter = useOpenedDocuments();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();

    if (åpnedeDokumenter.length === 0) return null;

    return (
        <div className={cn(styles.dokumenter)}>
            {åpnedeDokumenter.map((dokument, index) => (
                <div className={styles.dokument} key={`dokument${index}`}>
                    <div className={styles.header}>
                        <Kilde className={styles.ikon} type={getKildetype(dokument.dokumenttype)}>
                            {getKildetekst(dokument.dokumenttype)}
                        </Kilde>
                        <HendelseDate timestamp={dokument.timestamp} />
                        <button className={styles.button} onClick={() => fjernÅpnetDokument(dokument.dokumentId)}>
                            <XMarkIcon title="lukk åpnet dokument" />
                        </button>
                    </div>
                    {dokument.dokumenttype === 'Søknad' ? (
                        <Søknadsinnhold dokumentId={dokument.dokumentId} personPseudoId={personPseudoId} />
                    ) : (
                        <Inntektsmeldingsinnhold
                            dokumentId={dokument.dokumentId}
                            personPseudoId={personPseudoId}
                            person={person}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};
