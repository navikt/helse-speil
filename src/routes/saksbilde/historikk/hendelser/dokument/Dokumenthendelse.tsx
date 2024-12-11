import classNames from 'classnames';
import React, { ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';

import { ArrowForwardIcon } from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { PersonFragment } from '@io/graphql';
import { DokumenthendelseObject } from '@typer/historikk';

import { ExpandableHistorikkContent } from '../ExpandableHistorikkContent';
import { Hendelse } from '../Hendelse';
import { HendelseDate } from '../HendelseDate';
import { Inntektsmeldingsinnhold } from './Inntektsmeldingsinnhold';
import { Søknadsinnhold } from './Søknadsinnhold';
import { getKildetekst, getKildetype, useAddOpenedDocument, useOpenedDocuments } from './dokument';

import styles from './Dokumenthendelse.module.scss';

type DokumenthendelseProps = Omit<DokumenthendelseObject, 'type' | 'id'> & {
    person: PersonFragment;
};

const dokumenttypetittel = (
    type: 'Inntektsmelding' | 'Sykmelding' | 'Søknad' | 'Vedtak' | 'InntektHentetFraAordningen',
) => {
    switch (type) {
        case 'Inntektsmelding':
        case 'Sykmelding':
        case 'Søknad':
        case 'Vedtak':
            return type + ' mottatt';
        case 'InntektHentetFraAordningen':
            return 'Inntekt hentet fra A-ordningen';
    }
};

export const Dokumenthendelse = ({
    dokumenttype,
    timestamp,
    dokumentId,
    person,
}: DokumenthendelseProps): ReactElement => {
    const [showDokumenter, setShowDokumenter] = useState(false);
    const [dokument, setDokument] = useState<ReactNode>(null);
    const leggTilÅpnetDokument = useAddOpenedDocument();
    const åpnedeDokumenter = useOpenedDocuments();
    const fødselsnummer = person.fodselsnummer;

    const setDokumenter = useCallback(() => {
        if (dokumenttype === 'Søknad') {
            setDokument(<Søknadsinnhold dokumentId={dokumentId} fødselsnummer={fødselsnummer} />);
        }

        if (dokumenttype === 'Inntektsmelding') {
            setDokument(
                <Inntektsmeldingsinnhold dokumentId={dokumentId} fødselsnummer={fødselsnummer} person={person} />,
            );
        }
    }, [dokumentId, dokumenttype, fødselsnummer, person]);

    useEffect(() => {
        if (!showDokumenter || !fødselsnummer) return;
        setDokumenter();
    }, [fødselsnummer, setDokumenter, showDokumenter]);

    const åpneINyKolonne = () => {
        leggTilÅpnetDokument({
            dokumentId: dokumentId ?? '',
            fødselsnummer: fødselsnummer,
            dokumenttype: dokumenttype,
            timestamp: timestamp,
        });
    };

    return (
        <Hendelse
            title={
                <span className={styles.header}>
                    <span>{dokumenttypetittel(dokumenttype)}</span>
                    {dokumenttype !== 'InntektHentetFraAordningen' && dokumenttype !== 'Sykmelding' && (
                        <button
                            className={classNames(
                                styles.åpne,
                                åpnedeDokumenter.find((it) => it.dokumentId === dokumentId) && styles.skjult,
                            )}
                            onClick={åpneINyKolonne}
                        >
                            <ArrowForwardIcon title="Åpne dokument til høyre" fontSize="1.5rem" />
                        </button>
                    )}
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
