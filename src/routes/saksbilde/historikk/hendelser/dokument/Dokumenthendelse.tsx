import classNames from 'classnames';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';

import { ArrowForwardIcon, ExternalLinkIcon } from '@navikt/aksel-icons';
import { Link } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { hoppTilModia } from '@components/SystemMenu';
import { DokumenthendelseObject } from '@typer/historikk';

import { ExpandableHistorikkContent } from '../ExpandableHistorikkContent';
import { Hendelse } from '../Hendelse';
import { HendelseDate } from '../HendelseDate';
import { Inntektsmeldingsinnhold } from './Inntektsmeldingsinnhold';
import { Søknadsinnhold } from './Søknadsinnhold';
import { getKildetekst, getKildetype, useAddOpenedDocument, useOpenedDocuments } from './dokument';

import styles from './Dokumenthendelse.module.scss';

type DokumenthendelseProps = Omit<DokumenthendelseObject, 'type' | 'id'> & {
    fødselsnummer: string;
};

export const Dokumenthendelse = ({
    dokumenttype,
    timestamp,
    dokumentId,
    fødselsnummer,
}: DokumenthendelseProps): ReactElement => {
    const [showDokumenter, setShowDokumenter] = useState(false);
    const [dokument, setDokument] = useState<ReactNode>(null);
    const leggTilÅpnetDokument = useAddOpenedDocument();
    const åpnedeDokumenter = useOpenedDocuments();

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
        leggTilÅpnetDokument({
            dokumentId: dokumentId ?? '',
            fødselsnummer: fødselsnummer,
            dokumenttype: dokumenttype,
            timestamp: timestamp,
        });
    };

    return dokumenttype !== 'Vedtak' ? (
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
    ) : (
        <Hendelse
            title={
                <span className={styles.header}>
                    <span>Melding om vedtak</span>
                </span>
            }
            icon={<Kilde type="VEDTAK">{getKildetekst(dokumenttype)}</Kilde>}
        >
            <Link
                onClick={() =>
                    hoppTilModia(
                        `https://spinnsyn-frontend-interne.intern.nav.no/syk/sykepenger?id=${dokumentId}`,
                        fødselsnummer,
                    )
                }
                className={styles['åpne-vedtak']}
            >
                Åpne vedtak i ny fane
                <ExternalLinkIcon className={styles.eksternlenke} />
            </Link>
            <HendelseDate timestamp={timestamp} />
        </Hendelse>
    );
};
