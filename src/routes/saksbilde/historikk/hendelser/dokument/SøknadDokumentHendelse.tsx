import classNames from 'classnames';
import React, { ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';

import { ArrowForwardIcon } from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { DateString } from '@typer/shared';

import { ExpandableHistorikkContent } from '../ExpandableHistorikkContent';
import { Hendelse } from '../Hendelse';
import { HendelseDate } from '../HendelseDate';
import { Søknadsinnhold } from './Søknadsinnhold';
import { getKildetekst, getKildetype, useAddOpenedDocument, useOpenedDocuments } from './dokument';

import styles from './SøknadDokumentHendelse.module.scss';

type SøknadDokumentHendelseProps = {
    dokumentId?: string;
    fødselsnummer: string;
    timestamp: DateString;
};

export const SøknadDokumentHendelse = ({
    timestamp,
    dokumentId,
    fødselsnummer,
}: SøknadDokumentHendelseProps): ReactElement => {
    const [showDokumenter, setShowDokumenter] = useState(false);
    const [dokument, setDokument] = useState<ReactNode>(null);
    const leggTilÅpnetDokument = useAddOpenedDocument();
    const åpnedeDokumenter = useOpenedDocuments();

    const setDokumenter = useCallback(() => {
        setDokument(<Søknadsinnhold dokumentId={dokumentId} fødselsnummer={fødselsnummer} />);
    }, [dokumentId, fødselsnummer]);

    useEffect(() => {
        if (!showDokumenter || !fødselsnummer) return;
        setDokumenter();
    }, [fødselsnummer, setDokumenter, showDokumenter]);

    const åpneINyKolonne = () => {
        leggTilÅpnetDokument({
            dokumentId: dokumentId ?? '',
            fødselsnummer: fødselsnummer,
            dokumenttype: 'Søknad',
            timestamp: timestamp,
        });
    };

    return (
        <Hendelse
            title={
                <span className={styles.header}>
                    <span>Søknad mottatt</span>
                    <button
                        className={classNames(
                            styles.åpne,
                            åpnedeDokumenter.find((it) => it.dokumentId === dokumentId) && styles.skjult,
                        )}
                        onClick={åpneINyKolonne}
                    >
                        <ArrowForwardIcon title="Åpne dokument til høyre" fontSize="1.5rem" />
                    </button>
                </span>
            }
            icon={<Kilde type={getKildetype('Søknad')}>{getKildetekst('Søknad')}</Kilde>}
        >
            <ExpandableHistorikkContent onOpen={setShowDokumenter}>{dokument}</ExpandableHistorikkContent>
            <HendelseDate timestamp={timestamp} />
        </Hendelse>
    );
};
