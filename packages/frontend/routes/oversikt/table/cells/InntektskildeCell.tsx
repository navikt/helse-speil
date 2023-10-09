import React from 'react';

import { Table } from '@navikt/ds-react';

import { AntallArbeidsforhold } from '@io/graphql';

interface InntektskildeProps {
    antallArbeidsforhold: AntallArbeidsforhold;
}

const tilTekst = (antallArbeidsforhold: AntallArbeidsforhold) => {
    switch (antallArbeidsforhold) {
        case AntallArbeidsforhold.FlereArbeidsforhold:
            return 'Flere arbeidsgivere';
        case AntallArbeidsforhold.EtArbeidsforhold:
            return 'En arbeidsgiver';
    }
};

export const InntektskildeCell = ({ antallArbeidsforhold }: InntektskildeProps) => (
    <Table.DataCell>{tilTekst(antallArbeidsforhold)}</Table.DataCell>
);
