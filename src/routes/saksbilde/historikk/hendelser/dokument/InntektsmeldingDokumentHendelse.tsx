import React, { ReactElement } from 'react';

import { ChevronLeftCircleIcon, ChevronRightCircleIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { InntektsmeldingKildeIkon } from '@components/Kilde';
import { PersonFragment } from '@io/graphql';
import { ExpandableHendelse } from '@saksbilde/historikk/hendelser/ExpandableHendelse';
import { DateString } from '@typer/shared';

import { Inntektsmeldingsinnhold } from './Inntektsmeldingsinnhold';
import { useAddOpenedDocument, useOpenedDocuments, useRemoveOpenedDocument } from './dokument';

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
        <ExpandableHendelse
            ikon={<InntektsmeldingKildeIkon />}
            tittel="Inntektsmelding mottatt"
            kontekstknapp={
                <Button
                    size="xsmall"
                    variant="tertiary"
                    title="Åpne dokument til høyre"
                    icon={dokumentetErÅpnet() ? <ChevronLeftCircleIcon /> : <ChevronRightCircleIcon />}
                    onClick={(event) => {
                        toggleÅpnetDokument();
                        event.stopPropagation();
                    }}
                    onKeyDown={(event: React.KeyboardEvent) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            toggleÅpnetDokument();
                            event.stopPropagation();
                        }
                    }}
                    onKeyUp={(event: React.KeyboardEvent) => event.preventDefault()}
                />
            }
            tidsstempel={timestamp}
        >
            <Inntektsmeldingsinnhold dokumentId={dokumentId} fødselsnummer={person.fodselsnummer} person={person} />
        </ExpandableHendelse>
    );
};
