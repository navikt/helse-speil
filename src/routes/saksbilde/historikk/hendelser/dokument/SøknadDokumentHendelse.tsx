import React, { ReactElement } from 'react';

import { ArrowForwardIcon } from '@navikt/aksel-icons';

import { SøknadKildeIkon } from '@components/Kilde';
import { ExpandableHendelse } from '@saksbilde/historikk/hendelser/ExpandableHendelse';
import { DateString } from '@typer/shared';

import { Søknadsinnhold } from './Søknadsinnhold';
import { useAddOpenedDocument, useOpenedDocuments } from './dokument';

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
    const leggTilÅpnetDokument = useAddOpenedDocument();
    const åpnedeDokumenter = useOpenedDocuments();

    const åpneINyKolonne = () => {
        leggTilÅpnetDokument({
            dokumentId: dokumentId ?? '',
            fødselsnummer: fødselsnummer,
            dokumenttype: 'Søknad',
            timestamp: timestamp,
        });
    };

    const dokumentetErÅpnet = () => åpnedeDokumenter.find((it) => it.dokumentId === dokumentId);

    return (
        <ExpandableHendelse
            icon={<SøknadKildeIkon />}
            title="Søknad mottatt"
            topRightButton={
                !dokumentetErÅpnet() && (
                    <button
                        className={styles.åpne}
                        onClick={(event) => {
                            åpneINyKolonne();
                            event.stopPropagation();
                        }}
                    >
                        <ArrowForwardIcon title="Åpne dokument til høyre" fontSize="1.5rem" />
                    </button>
                )
            }
            timestamp={timestamp}
        >
            <Søknadsinnhold dokumentId={dokumentId} fødselsnummer={fødselsnummer} />
        </ExpandableHendelse>
    );
};
