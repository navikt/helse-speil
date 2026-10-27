import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { ChevronLeftCircleIcon, ChevronRightCircleIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';

import { HistorikkKildeSøknadIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { DateString } from '@typer/shared';

import { Søknadsinnhold } from './dokument/Søknadsinnhold';
import { useAddOpenedDocument, useOpenedDocuments, useRemoveOpenedDocument } from './dokument/dokument';

type SøknadMottatthendelseProps = {
    dokumentId: string;
    timestamp: DateString;
};

export const SøknadMottatthendelse = ({ timestamp, dokumentId }: SøknadMottatthendelseProps): ReactElement => {
    const leggTilÅpnetDokument = useAddOpenedDocument();
    const fjernÅpnetDokument = useRemoveOpenedDocument();
    const åpnedeDokumenter = useOpenedDocuments();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();

    const dokumentetErÅpnet = () => åpnedeDokumenter.find((it) => it.dokumentId === dokumentId);

    function toggleÅpnetDokument() {
        if (dokumentetErÅpnet()) {
            fjernÅpnetDokument(dokumentId);
        } else {
            leggTilÅpnetDokument({
                dokumentId: dokumentId,
                aktørId: personPseudoId,
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
                <Tooltip content={dokumentetErÅpnet() ? 'Lukk panel' : 'Åpne panel'}>
                    <Button
                        icon={
                            dokumentetErÅpnet() ? (
                                <ChevronLeftCircleIcon aria-hidden />
                            ) : (
                                <ChevronRightCircleIcon aria-hidden />
                            )
                        }
                        variant="tertiary"
                        size="xsmall"
                        style={{ height: '24px' }}
                        onClick={(event: React.MouseEvent) => {
                            toggleÅpnetDokument();
                            event.stopPropagation();
                        }}
                    />
                </Tooltip>
            }
            timestamp={timestamp}
            aktiv={false}
        >
            <Søknadsinnhold dokumentId={dokumentId} personPseudoId={personPseudoId} />
        </Historikkhendelse>
    );
};
