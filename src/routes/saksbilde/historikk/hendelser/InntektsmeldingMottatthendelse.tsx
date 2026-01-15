import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { ChevronLeftCircleIcon, ChevronRightCircleIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { PersonFragment } from '@io/graphql';
import { HistorikkKildeInntektsmeldingIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { DateString } from '@typer/shared';

import { Inntektsmeldingsinnhold } from './dokument/Inntektsmeldingsinnhold';
import { useAddOpenedDocument, useOpenedDocuments, useRemoveOpenedDocument } from './dokument/dokument';

type InntektsmeldingMottatthendelseProps = {
    dokumentId: string;
    person: PersonFragment;
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
            <Inntektsmeldingsinnhold dokumentId={dokumentId} personPseudoId={personPseudoId} person={person} />
        </Historikkhendelse>
    );
};
