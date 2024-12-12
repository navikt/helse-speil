import React, { ReactElement } from 'react';

import { ArrowForwardIcon } from '@navikt/aksel-icons';

import { InntektsmeldingKildeIkon } from '@components/Kilde';
import { PersonFragment } from '@io/graphql';
import { ExpandableHendelse } from '@saksbilde/historikk/hendelser/ExpandableHendelse';
import { DateString } from '@typer/shared';

import { Inntektsmeldingsinnhold } from './Inntektsmeldingsinnhold';
import { useAddOpenedDocument, useOpenedDocuments } from './dokument';

import styles from './InntektsmeldingDokumentHendelse.module.scss';

type InntektsmeldingDokumentHendelseProps = {
    dokumentId?: string;
    person: PersonFragment;
    timestamp: DateString;
};

export const InntektsmeldingDokumentHendelse = ({
    dokumentId,
    person,
    timestamp,
}: InntektsmeldingDokumentHendelseProps): ReactElement => {
    const leggTilÅpnetDokument = useAddOpenedDocument();
    const åpnedeDokumenter = useOpenedDocuments();

    const åpneINyKolonne = () => {
        leggTilÅpnetDokument({
            dokumentId: dokumentId ?? '',
            fødselsnummer: person.fodselsnummer,
            dokumenttype: 'Inntektsmelding',
            timestamp: timestamp,
        });
    };

    const dokumentetErÅpnet = () => åpnedeDokumenter.find((it) => it.dokumentId === dokumentId);

    return (
        <ExpandableHendelse
            ikon={<InntektsmeldingKildeIkon />}
            tittel="Inntektsmelding mottatt"
            kontekstknapp={
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
            tidsstempel={timestamp}
        >
            <Inntektsmeldingsinnhold dokumentId={dokumentId} fødselsnummer={person.fodselsnummer} person={person} />
        </ExpandableHendelse>
    );
};
