import React, { ReactElement } from 'react';

import { ChevronLeftCircleIcon, ChevronRightCircleIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { SøknadKildeIkon } from '@components/Kilde';
import { ExpandableHendelse } from '@saksbilde/historikk/hendelser/ExpandableHendelse';
import { DateString } from '@typer/shared';

import { Søknadsinnhold } from './Søknadsinnhold';
import { useAddOpenedDocument, useOpenedDocuments, useRemoveOpenedDocument } from './dokument';

type SøknadDokumentHendelseProps = {
    dokumentId: string;
    fødselsnummer: string;
    timestamp: DateString;
};

export const SøknadDokumentHendelse = ({
    timestamp,
    dokumentId,
    fødselsnummer,
}: SøknadDokumentHendelseProps): ReactElement => {
    const leggTilÅpnetDokument = useAddOpenedDocument();
    const fjernÅpnetDokument = useRemoveOpenedDocument();
    const åpnedeDokumenter = useOpenedDocuments();

    const åpneINyKolonne = () => {
        leggTilÅpnetDokument({
            dokumentId: dokumentId,
            fødselsnummer: fødselsnummer,
            dokumenttype: 'Søknad',
            timestamp: timestamp,
        });
    };

    const lukkINyKolonne = () => {
        fjernÅpnetDokument(dokumentId);
    };

    const dokumentetErÅpnet = () => åpnedeDokumenter.find((it) => it.dokumentId === dokumentId);

    return (
        <ExpandableHendelse
            ikon={<SøknadKildeIkon />}
            tittel="Søknad mottatt"
            kontekstknapp={
                <Button
                    size="xsmall"
                    variant="tertiary"
                    title="Åpne dokument til høyre"
                    icon={dokumentetErÅpnet() ? <ChevronLeftCircleIcon /> : <ChevronRightCircleIcon />}
                    onClick={(event) => {
                        dokumentetErÅpnet() ? lukkINyKolonne() : åpneINyKolonne();
                        event.stopPropagation();
                    }}
                />
            }
            tidsstempel={timestamp}
        >
            <Søknadsinnhold dokumentId={dokumentId} fødselsnummer={fødselsnummer} />
        </ExpandableHendelse>
    );
};
