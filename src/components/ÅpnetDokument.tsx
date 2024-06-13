import styles from './ÅpnetDokument.module.scss';
import classNames from 'classnames';
import React, { ReactElement } from 'react';
import { useRecoilState } from 'recoil';

import { XMarkIcon } from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { Maybe } from '@io/graphql';
import { HendelseDate } from '@saksbilde/historikk/hendelser/HendelseDate';
import { Inntektsmeldingsinnhold } from '@saksbilde/historikk/hendelser/dokument/Inntektsmeldingsinnhold';
import { Søknadsinnhold } from '@saksbilde/historikk/hendelser/dokument/Søknadsinnhold';
import { getKildetekst, getKildetype, openedDocument } from '@saksbilde/historikk/hendelser/dokument/dokument';

export const ÅpnetDokument = (): Maybe<ReactElement> => {
    const [åpnedeDokumenter, setÅpnedeDokumenter] = useRecoilState(openedDocument);

    if ((åpnedeDokumenter?.length ?? 0) === 0) return null;

    return (
        <div className={classNames(styles.dokumenter)}>
            {åpnedeDokumenter.map((dokument, index) => (
                <div className={styles.dokument} key={`dokument${index}`}>
                    <div className={styles.header}>
                        <Kilde className={styles.ikon} type={getKildetype(dokument.dokumenttype)}>
                            {getKildetekst(dokument.dokumenttype)}
                        </Kilde>
                        <HendelseDate timestamp={dokument.timestamp} />
                        <button
                            className={styles.button}
                            onClick={() =>
                                setÅpnedeDokumenter((prevState) =>
                                    prevState.filter((item) => item.dokumentId !== dokument.dokumentId),
                                )
                            }
                        >
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
