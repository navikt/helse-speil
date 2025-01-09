import React, { ReactElement } from 'react';

import { ChevronLeftCircleIcon, ChevronRightCircleIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { InntektsmeldingKildeIkon } from '@components/Kilde';
import { PersonFragment } from '@io/graphql';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { DateString } from '@typer/shared';

import { Inntektsmeldingsinnhold } from './dokument/Inntektsmeldingsinnhold';
import { useAddOpenedDocument, useOpenedDocuments, useRemoveOpenedDocument } from './dokument/dokument';

type InntektsmeldingDokumentHendelseProps = {
    dokumentId: string;
    person: PersonFragment;
    timestamp: DateString;
};

export const InntektsmeldingDokumentHendelse = ({
    dokumentId,
    person,
    timestamp,
}: InntektsmeldingDokumentHendelseProps): ReactElement => {
    const leggTilÅpnetDokument = useAddOpenedDocument();
    const fjernÅpnetDokument = useRemoveOpenedDocument();
    const åpnedeDokumenter = useOpenedDocuments();

    const dokumentetErÅpnet = () => åpnedeDokumenter.find((it) => it.dokumentId === dokumentId);

    function toggleÅpnetDokument() {
        dokumentetErÅpnet()
            ? fjernÅpnetDokument(dokumentId)
            : leggTilÅpnetDokument({
                  dokumentId: dokumentId,
                  fødselsnummer: person.fodselsnummer,
                  dokumenttype: 'Inntektsmelding',
                  timestamp: timestamp,
              });
    }

    return (
        <Historikkhendelse
            icon={<InntektsmeldingKildeIkon />}
            title="Inntektsmelding mottatt"
            kontekstknapp={
                <Button
                    icon={dokumentetErÅpnet() ? <ChevronLeftCircleIcon /> : <ChevronRightCircleIcon />}
                    title={dokumentetErÅpnet() ? 'Lukk panel' : 'Åpne opp panel'}
                    variant="tertiary"
                    size="xsmall"
                    onClick={(event: React.MouseEvent) => {
                        toggleÅpnetDokument();
                        event.stopPropagation();
                    }}
                />
            }
            timestamp={timestamp}
            aktiv={false}
        >
            <Inntektsmeldingsinnhold dokumentId={dokumentId} fødselsnummer={person.fodselsnummer} person={person} />
        </Historikkhendelse>
    );
};
