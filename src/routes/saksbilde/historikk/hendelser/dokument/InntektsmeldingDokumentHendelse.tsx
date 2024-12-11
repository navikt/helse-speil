import classNames from 'classnames';
import React, { ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';

import { ArrowForwardIcon } from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { PersonFragment } from '@io/graphql';
import { DateString } from '@typer/shared';

import { ExpandableHistorikkContent } from '../ExpandableHistorikkContent';
import { Hendelse } from '../Hendelse';
import { HendelseDate } from '../HendelseDate';
import { Inntektsmeldingsinnhold } from './Inntektsmeldingsinnhold';
import { getKildetekst, getKildetype, useAddOpenedDocument, useOpenedDocuments } from './dokument';

import styles from './InntektsmeldingDokumentHendelse.module.scss';

type InntektsmeldingDokumentHendelseProps = {
    dokumentId?: string;
    person: PersonFragment;
    timestamp: DateString;
};

export const InntektsmeldingDokumentHendelse = ({
    dokumentId,
    person,
    timestamp,
}: InntektsmeldingDokumentHendelseProps): ReactElement => {
    const [showDokumenter, setShowDokumenter] = useState(false);
    const [dokument, setDokument] = useState<ReactNode>(null);
    const leggTilÅpnetDokument = useAddOpenedDocument();
    const åpnedeDokumenter = useOpenedDocuments();
    const fødselsnummer = person.fodselsnummer;

    const setDokumenter = useCallback(() => {
        setDokument(<Inntektsmeldingsinnhold dokumentId={dokumentId} fødselsnummer={fødselsnummer} person={person} />);
    }, [dokumentId, person]);

    useEffect(() => {
        if (!showDokumenter || !fødselsnummer) return;
        setDokumenter();
    }, [fødselsnummer, setDokumenter, showDokumenter]);

    const åpneINyKolonne = () => {
        leggTilÅpnetDokument({
            dokumentId: dokumentId ?? '',
            fødselsnummer: fødselsnummer,
            dokumenttype: 'Inntektsmelding',
            timestamp: timestamp,
        });
    };

    return (
        <Hendelse
            title={
                <span className={styles.header}>
                    <span>Inntektsmelding mottatt</span>
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
            icon={<Kilde type={getKildetype('Inntektsmelding')}>{getKildetekst('Inntektsmelding')}</Kilde>}
        >
            <ExpandableHistorikkContent onOpen={setShowDokumenter}>{dokument}</ExpandableHistorikkContent>
            <HendelseDate timestamp={timestamp} />
        </Hendelse>
    );
};
