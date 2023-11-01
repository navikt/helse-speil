import React from 'react';

import { Table } from '@navikt/ds-react';

import { Egenskap, Kategori, Oppgaveegenskap } from '@io/graphql';

interface EgenskaperCellProps {
    egenskaper: Oppgaveegenskap[];
}

const tilTekst = (egenskap: Egenskap) => {
    switch (egenskap) {
        case Egenskap.EgenAnsatt:
            return 'Egen ansatt';
        case Egenskap.FortroligAdresse:
            return 'Fortrolig adresse';
        case Egenskap.Fullmakt:
            return 'Fullmakt';
        case Egenskap.Haster:
            return 'Haster';
        case Egenskap.Retur:
            return 'Retur';
        case Egenskap.RiskQa:
            return 'Risk QA';
        case Egenskap.Spesialsak:
            return '🌰';
        case Egenskap.Stikkprove:
            return 'Stikkprøve';
        case Egenskap.Utland:
            return 'Utland';
        case Egenskap.Vergemal:
            return 'Vergemål';
        case Egenskap.Beslutter:
            return 'Beslutter';
        case Egenskap.Skjonnsfastsettelse:
            return 'Skjønnsfastsettelse';
        default:
            return '';
    }
};

const getLabel = (egenskaper: Oppgaveegenskap[]) =>
    egenskaper
        .filter(({ kategori }) => kategori === Kategori.Ukategorisert)
        .map(({ egenskap }) => tilTekst(egenskap))
        .sort()
        .join(', ');

export const EgenskaperCell = ({ egenskaper }: EgenskaperCellProps) => {
    const label = getLabel(egenskaper);
    return <Table.DataCell>{label}</Table.DataCell>;
};
