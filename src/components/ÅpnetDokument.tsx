import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { XMarkIcon } from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { Maybe } from '@io/graphql';
import { HendelseDate } from '@saksbilde/historikk/hendelser/HendelseDate';
import { Inntektsmeldingsinnhold } from '@saksbilde/historikk/hendelser/dokument/Inntektsmeldingsinnhold';
import { Søknadsinnhold } from '@saksbilde/historikk/hendelser/dokument/Søknadsinnhold';
import {
    getKildetekst,
    getKildetype,
    useOpenedDocuments,
    useRemoveOpenedDocument,
} from '@saksbilde/historikk/hendelser/dokument/dokument';

import styles from './ÅpnetDokument.module.scss';

export const ÅpnetDokument = (): Maybe<ReactElement> => {
    const fjernÅpnetDokument = useRemoveOpenedDocument();
    const åpnedeDokumenter = useOpenedDocuments();

    if (åpnedeDokumenter.length === 0) return null;

    return (
        <div className={classNames(styles.dokumenter)}>
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
                        <Søknadsinnhold dokumentId={dokument.dokumentId} fødselsnummer={dokument.fødselsnummer} />
                    ) : (
                        <Inntektsmeldingsinnhold
                            dokumentId={dokument.dokumentId}
                            fødselsnummer={dokument.fødselsnummer}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};
