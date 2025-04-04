import React, { ReactElement } from 'react';

import { ChevronLeftCircleIcon, ChevronRightCircleIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { HistorikkKildeSøknadIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { DateString } from '@typer/shared';

import { Søknadsinnhold } from './dokument/Søknadsinnhold';
import { useAddOpenedDocument, useOpenedDocuments, useRemoveOpenedDocument } from './dokument/dokument';

type SøknadMottatthendelseProps = {
    dokumentId: string;
    fødselsnummer: string;
    timestamp: DateString;
};

export const SøknadMottatthendelse = ({
    timestamp,
    dokumentId,
    fødselsnummer,
}: SøknadMottatthendelseProps): ReactElement => {
    const leggTilÅpnetDokument = useAddOpenedDocument();
    const fjernÅpnetDokument = useRemoveOpenedDocument();
    const åpnedeDokumenter = useOpenedDocuments();

    const dokumentetErÅpnet = () => åpnedeDokumenter.find((it) => it.dokumentId === dokumentId);

    function toggleÅpnetDokument() {
        if (dokumentetErÅpnet()) {
            fjernÅpnetDokument(dokumentId);
        } else {
            leggTilÅpnetDokument({
                dokumentId: dokumentId,
                fødselsnummer: fødselsnummer,
                dokumenttype: 'Søknad',
                timestamp: timestamp,
            });
        }
    }

    return (
        <Historikkhendelse
            icon={<HistorikkKildeSøknadIkon />}
            title="Søknad mottatt"
            kontekstknapp={
                <Button
                    icon={dokumentetErÅpnet() ? <ChevronLeftCircleIcon /> : <ChevronRightCircleIcon />}
                    title={dokumentetErÅpnet() ? 'Lukk panel' : 'Åpne opp panel'}
                    variant="tertiary"
                    size="xsmall"
                    style={{ height: '24px' }}
                    onClick={(event: React.MouseEvent) => {
                        toggleÅpnetDokument();
                        event.stopPropagation();
                    }}
                />
            }
            timestamp={timestamp}
            aktiv={false}
        >
            <Søknadsinnhold dokumentId={dokumentId} fødselsnummer={fødselsnummer} />
        </Historikkhendelse>
    );
};
