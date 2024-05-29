import styles from './Dokumenthendelse.module.scss';
import React, { ReactNode, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { ArrowForwardIcon } from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { useCurrentPerson } from '@state/person';

import { ExpandableHistorikkContent } from '../ExpandableHistorikkContent';
import { Hendelse } from '../Hendelse';
import { HendelseDate } from '../HendelseDate';
import { Inntektsmeldingsinnhold } from './Inntektsmeldingsinnhold';
import { Søknadsinnhold } from './Søknadsinnhold';
import { getKildetekst, getKildetype, openedDocument } from './dokument';

type DokumenthendelseProps = Omit<DokumenthendelseObject, 'type' | 'id'>;

export interface ÅpnedeDokumenter {
    dokumentId: string;
    fødselsnummer: string;
    dokumenttype: 'Inntektsmelding' | 'Sykmelding' | 'Søknad';
    timestamp: string;
}

export const Dokumenthendelse: React.FC<DokumenthendelseProps> = ({ dokumenttype, timestamp, dokumentId }) => {
    const [showDokumenter, setShowDokumenter] = useState(false);
    const [dokument, setDokument] = useState<ReactNode>(null);
    const [åpnedeDokumenter, setÅpnedeDokumenter] = useRecoilState<ÅpnedeDokumenter[]>(openedDocument);
    const fødselsnummer = useCurrentPerson()?.fodselsnummer;

    useEffect(() => {
        if (!showDokumenter || !fødselsnummer) return;

        if (dokumenttype === 'Søknad') {
            setDokument(<Søknadsinnhold dokumentId={dokumentId} fødselsnummer={fødselsnummer} />);
        }

        if (dokumenttype === 'Inntektsmelding') {
            setDokument(<Inntektsmeldingsinnhold dokumentId={dokumentId} fødselsnummer={fødselsnummer} />);
        }
    }, [showDokumenter]);

    const åpneINyKolonne = () => {
        setÅpnedeDokumenter([
            ...åpnedeDokumenter,
            {
                dokumentId: dokumentId,
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
                    <button className={styles.åpne} onClick={åpneINyKolonne}>
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
