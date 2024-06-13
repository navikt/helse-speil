import styles from './Dokumenthendelse.module.scss';
import classNames from 'classnames';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';

import { ArrowForwardIcon } from '@navikt/aksel-icons';

import { DokumenthendelseObject } from '@/routes/saksbilde/historikk/types';
import { Kilde } from '@components/Kilde';

import { ExpandableHistorikkContent } from '../ExpandableHistorikkContent';
import { Hendelse } from '../Hendelse';
import { HendelseDate } from '../HendelseDate';
import { Inntektsmeldingsinnhold } from './Inntektsmeldingsinnhold';
import { Søknadsinnhold } from './Søknadsinnhold';
import { getKildetekst, getKildetype, openedDocument } from './dokument';

type DokumenthendelseProps = Omit<DokumenthendelseObject, 'type' | 'id'> & {
    fødselsnummer: string;
};

export interface ÅpnedeDokumenter {
    dokumentId: string;
    fødselsnummer: string;
    dokumenttype: 'Inntektsmelding' | 'Sykmelding' | 'Søknad';
    timestamp: string;
}

export const Dokumenthendelse = ({
    dokumenttype,
    timestamp,
    dokumentId,
    fødselsnummer,
}: DokumenthendelseProps): ReactElement => {
    const [showDokumenter, setShowDokumenter] = useState(false);
    const [dokument, setDokument] = useState<ReactNode>(null);
    const [åpnedeDokumenter, setÅpnedeDokumenter] = useRecoilState<ÅpnedeDokumenter[]>(openedDocument);
    const resetOpenedDocuments = useResetRecoilState(openedDocument);

    useEffect(() => {
        if (!showDokumenter || !fødselsnummer) return;

        if (dokumenttype === 'Søknad') {
            setDokument(<Søknadsinnhold dokumentId={dokumentId} fødselsnummer={fødselsnummer} />);
        }

        if (dokumenttype === 'Inntektsmelding') {
            setDokument(<Inntektsmeldingsinnhold dokumentId={dokumentId} fødselsnummer={fødselsnummer} />);
        }
    }, [showDokumenter]);

    useEffect(() => {
        resetOpenedDocuments();
    }, []);

    const åpneINyKolonne = () => {
        setÅpnedeDokumenter([
            ...åpnedeDokumenter,
            {
                dokumentId: dokumentId ?? '',
                fødselsnummer: fødselsnummer,
                dokumenttype: dokumenttype,
                timestamp: timestamp,
            },
        ]);
    };

    return (
        <Hendelse
            title={
                <span className={styles.header}>
                    <span>{dokumenttype} mottatt</span>
                    <button
                        className={classNames(
                            styles.åpne,
                            (åpnedeDokumenter.find((it) => it.dokumentId === dokumentId) ||
                                dokumenttype === 'Sykmelding') &&
                                styles.skjult,
                        )}
                        onClick={åpneINyKolonne}
                    >
                        <ArrowForwardIcon title="Åpne dokument til høyre" fontSize="1.5rem" />
                    </button>
                </span>
            }
            icon={<Kilde type={getKildetype(dokumenttype)}>{getKildetekst(dokumenttype)}</Kilde>}
        >
            {(dokumenttype === 'Søknad' || dokumenttype === 'Inntektsmelding') && (
                <ExpandableHistorikkContent onOpen={setShowDokumenter}>{dokument}</ExpandableHistorikkContent>
            )}
            <HendelseDate timestamp={timestamp} />
        </Hendelse>
    );
};
