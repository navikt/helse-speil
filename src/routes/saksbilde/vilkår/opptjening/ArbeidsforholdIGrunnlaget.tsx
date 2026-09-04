import React, { ReactElement } from 'react';

import { BodyShort, Box, ReadMore, Table } from '@navikt/ds-react';

import { Organisasjonsnavn } from '@components/Inntektsforholdnavn';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { ApiArbeidsforhold, ApiArbeidsforholdtype } from '@io/rest/generated/vilkarsproving.schemas';
import { somNorskDato } from '@utils/date';

const arbeidsforholdtypeLabels: Record<ApiArbeidsforholdtype, string> = {
    [ApiArbeidsforholdtype.FORENKLET_OPPGJØRSORDNING]: 'Forenklet oppgjørsordning',
    [ApiArbeidsforholdtype.FRILANSER]: 'Frilanser',
    [ApiArbeidsforholdtype.MARITIMT]: 'Maritimt',
    [ApiArbeidsforholdtype.ORDINÆRT]: 'Ordinært',
    [ApiArbeidsforholdtype.UKJENT]: 'Ukjent',
};

interface ArbeidsforholdIGrunnlagetProps {
    arbeidsforhold: ApiArbeidsforhold[];
}

export const ArbeidsforholdIGrunnlaget = ({ arbeidsforhold }: ArbeidsforholdIGrunnlagetProps): ReactElement => (
    <ReadMore size="small" header={`Arbeidsforhold i grunnlaget (${arbeidsforhold.length})`}>
        <Box paddingBlock="space-8 space-0" maxWidth="42rem">
            {arbeidsforhold.length === 0 ? (
                <BodyShort size="small" textColor="subtle">
                    Ingen arbeidsforhold i grunnlaget
                </BodyShort>
            ) : (
                <Table size="small" zebraStripes>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col">Arbeidsgiver</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Organisasjonsnummer</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                            <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {arbeidsforhold.map((it) => (
                            <Table.Row key={`${it.organisasjonsnummer}-${it.fom}-${it.tom ?? ''}`}>
                                <Table.DataCell>
                                    <Organisasjonsnavn
                                        organisasjonsnummer={it.organisasjonsnummer}
                                        maxWidth="14rem"
                                        size="small"
                                    />
                                </Table.DataCell>
                                <Table.DataCell>
                                    <AnonymizableText size="small">{it.organisasjonsnummer}</AnonymizableText>
                                </Table.DataCell>
                                <Table.DataCell>
                                    {`${somNorskDato(it.fom) ?? 'ukjent'} – ${somNorskDato(it.tom ?? undefined) ?? 'løpende'}`}
                                </Table.DataCell>
                                <Table.DataCell>{arbeidsforholdtypeLabels[it.type]}</Table.DataCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </Box>
    </ReadMore>
);
