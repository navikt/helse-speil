import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { ChevronLeftCircleIcon, ChevronRightCircleIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';

import { ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { HistorikkKildeInntektsmeldingIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { DateString } from '@typer/shared';

import { Inntektsmeldingsinnhold } from './dokument/Inntektsmeldingsinnhold';
import { useAddOpenedDocument, useOpenedDocuments, useRemoveOpenedDocument } from './dokument/dokument';

type InntektsmeldingMottatthendelseProps = {
    dokumentId: string;
    person: ApiSaksbildePerson;
    timestamp: DateString;
};

export const InntektsmeldingMottatthendelse = ({
    dokumentId,
    person,
    timestamp,
}: InntektsmeldingMottatthendelseProps): ReactElement => {
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
                aktørId: person.aktorId,
                dokumenttype: 'Inntektsmelding',
                timestamp: timestamp,
            });
        }
    }

    return (
        <Historikkhendelse
            icon={<HistorikkKildeInntektsmeldingIkon />}
            title="Inntektsmelding mottatt"
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
            <Inntektsmeldingsinnhold dokumentId={dokumentId} personPseudoId={personPseudoId} person={person} />
        </Historikkhendelse>
    );
};
