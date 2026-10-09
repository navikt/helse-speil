import React, { ReactElement } from 'react';

import { BodyShort, Box, ReadMore, Table } from '@navikt/ds-react';

import { Organisasjonsnavn } from '@components/Inntektsforholdnavn';
import { ApiArbeidsforhold, ApiArbeidsforholdtype } from '@io/rest/generated/vilkarsproving.schemas';
import { somNorskDato } from '@utils/date';

export function ArbeidsforholdIGrunnlaget({ arbeidsforhold }: { arbeidsforhold: ApiArbeidsforhold[] }): ReactElement {
    return (
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
                            {arbeidsforhold.toSorted(sortArbeidsforhold).map((it) => (
                                <Table.Row key={`${it.organisasjonsnummer}-${it.fom}-${it.tom ?? ''}`}>
                                    <Table.DataCell className="max-w-36">
                                        {it.organisasjonsnummer === UKJENT_PRIVAT ? (
                                            <BodyShort size="small">{UKJENT_PRIVAT}</BodyShort>
                                        ) : (
                                            <Organisasjonsnavn
                                                organisasjonsnummer={it.organisasjonsnummer}
                                                maxWidth="14rem"
                                                size="small"
                                            />
                                        )}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <BodyShort data-sensitive size="small">
                                            {it.organisasjonsnummer}
                                        </BodyShort>
                                    </Table.DataCell>
                                    <Table.DataCell className="whitespace-nowrap">
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
}

// Spleis manglet orgnummer for enkelte private arbeidsgivere; sp-vilkarsproving lagrer dem som UKJENT_PRIVAT.
const UKJENT_PRIVAT = 'UKJENT_PRIVAT';

const arbeidsforholdtypeLabels: Record<ApiArbeidsforholdtype, string> = {
    [ApiArbeidsforholdtype.FORENKLET_OPPGJØRSORDNING]: 'Forenklet oppgjørsordning',
    [ApiArbeidsforholdtype.FRILANSER]: 'Frilanser',
    [ApiArbeidsforholdtype.MARITIMT]: 'Maritimt',
    [ApiArbeidsforholdtype.ORDINÆRT]: 'Ordinært',
    [ApiArbeidsforholdtype.UKJENT]: 'Ukjent',
};

// Løpende først, deretter nyeste tom, deretter nyeste fom. Datoene er ISO-strenger, så strengsammenligning holder.
function sortArbeidsforhold(a: ApiArbeidsforhold, b: ApiArbeidsforhold): number {
    if (a.tom == null || b.tom == null) {
        if (a.tom != b.tom) return a.tom == null ? -1 : 1;
    } else if (a.tom !== b.tom) {
        return b.tom.localeCompare(a.tom);
    }
    return b.fom.localeCompare(a.fom);
}
