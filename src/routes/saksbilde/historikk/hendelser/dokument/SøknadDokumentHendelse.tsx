import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { ArrowForwardIcon } from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { ExpandableHendelse } from '@saksbilde/historikk/hendelser/ExpandableHendelse';
import { DateString } from '@typer/shared';

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

    return (
        <ExpandableHendelse
            icon={<Kilde type={getKildetype('Søknad')}>{getKildetekst('Søknad')}</Kilde>}
            title="Søknad mottatt"
            topRightButton={
                <button
                    className={classNames(
                        styles.åpne,
                        åpnedeDokumenter.find((it) => it.dokumentId === dokumentId) && styles.skjult,
                    )}
                    onClick={åpneINyKolonne}
                >
                    <ArrowForwardIcon title="Åpne dokument til høyre" fontSize="1.5rem" />
                </button>
            }
            timestamp={timestamp}
        >
            <Søknadsinnhold dokumentId={dokumentId} fødselsnummer={fødselsnummer} />
        </ExpandableHendelse>
    );
};
