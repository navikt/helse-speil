import React from 'react';

import { Table } from '@navikt/ds-react';

interface InntektskildeProps {
    flereArbeidsgivere: boolean;
}

export const InntektskildeCell = ({ flereArbeidsgivere }: InntektskildeProps) => (
    <Table.DataCell>{flereArbeidsgivere ? 'Flere arbeidsg.' : 'En arbeidsgiver'}</Table.DataCell>
);
