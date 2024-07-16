import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { Antall, Behandlingsstatistikk } from '@io/graphql';
import { StatistikkOppsummert } from '@oversikt/behandlingsstatistikk/StatistikkOppsummert';

import { LabelCell } from './LabelCell';
import { Separator } from './Separator';
import { StatistikkRow } from './StatistikkRow';

const getTotaltIdag = (statistikk: Behandlingsstatistikk): Antall => {
    return {
        __typename: 'Antall',
        manuelt: statistikk.enArbeidsgiver.manuelt + statistikk.flereArbeidsgivere.manuelt,
        automatisk: statistikk.enArbeidsgiver.automatisk + statistikk.flereArbeidsgivere.automatisk,
        tilgjengelig: statistikk.enArbeidsgiver.tilgjengelig + statistikk.flereArbeidsgivere.tilgjengelig,
    };
};

interface BehandlingsstatistikkTableProps {
    behandlingsstatistikk: Behandlingsstatistikk;
}

export const BehandlingsstatistikkTable = ({
    behandlingsstatistikk,
}: BehandlingsstatistikkTableProps): ReactElement => {
    const totaltIdag = getTotaltIdag(behandlingsstatistikk);
    const søknad: Antall = {
        __typename: 'Antall',
        automatisk:
            behandlingsstatistikk.delvisRefusjon.automatisk +
            behandlingsstatistikk.utbetalingTilSykmeldt.automatisk +
            behandlingsstatistikk.utbetalingTilArbeidsgiver.automatisk,
        manuelt:
            behandlingsstatistikk.delvisRefusjon.manuelt +
            behandlingsstatistikk.utbetalingTilSykmeldt.manuelt +
            behandlingsstatistikk.utbetalingTilArbeidsgiver.manuelt,
        tilgjengelig:
            behandlingsstatistikk.delvisRefusjon.tilgjengelig +
            behandlingsstatistikk.utbetalingTilSykmeldt.tilgjengelig +
            behandlingsstatistikk.utbetalingTilArbeidsgiver.tilgjengelig,
    };

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <td />
                        <th>MANUELT</th>
                        <th>AUTOMATISK</th>
                        <th>TILGJENGELIG</th>
                    </tr>
                </thead>
                <tbody>
                    <StatistikkRow antall={behandlingsstatistikk.enArbeidsgiver}>
                        <LabelCell.EnArbeidsgiver />
                    </StatistikkRow>
                    <StatistikkRow antall={behandlingsstatistikk.flereArbeidsgivere}>
                        <LabelCell.FlereArbeidsgivere />
                    </StatistikkRow>
                </tbody>
                <Separator />
                <tbody>
                    <StatistikkRow antall={behandlingsstatistikk.forstegangsbehandling}>
                        <LabelCell.Førstegangsbehandling />
                    </StatistikkRow>
                    <StatistikkRow antall={behandlingsstatistikk.forlengelser}>
                        <LabelCell.Forlengelser />
                    </StatistikkRow>
                    <StatistikkRow antall={behandlingsstatistikk.forlengelseIt}>
                        <LabelCell.ForlengelseInfotrygd />
                    </StatistikkRow>
                </tbody>
                <Separator />
                <tbody>
                    <StatistikkRow antall={søknad}>
                        <LabelCell.Søknad />
                    </StatistikkRow>
                    <StatistikkRow antall={behandlingsstatistikk.revurdering}>
                        <LabelCell.Revurdering />
                    </StatistikkRow>
                </tbody>
                <Separator />
                <tbody>
                    <StatistikkRow antall={behandlingsstatistikk.faresignaler}>
                        <LabelCell.Vurderingsoppgaver />
                    </StatistikkRow>
                    <StatistikkRow antall={behandlingsstatistikk.fortroligAdresse}>
                        <LabelCell.FortroligAdresse />
                    </StatistikkRow>
                    <StatistikkRow antall={behandlingsstatistikk.stikkprover}>
                        <LabelCell.Stikkprøver />
                    </StatistikkRow>
                    <StatistikkRow antall={behandlingsstatistikk.beslutter}>
                        <LabelCell.Beslutter />
                    </StatistikkRow>
                    <StatistikkRow antall={behandlingsstatistikk.egenAnsatt}>
                        <LabelCell.EgenAnsatt />
                    </StatistikkRow>
                </tbody>
                <Separator />
            </table>
            <Table>
                <Table.Body>
                    <StatistikkOppsummert tittel="TILGJENGELIG" antall={totaltIdag.tilgjengelig} />
                    <StatistikkOppsummert
                        tittel="FULLFØRTE SAKER I DAG"
                        antall={totaltIdag.manuelt + totaltIdag.automatisk + behandlingsstatistikk.antallAnnulleringer}
                    />
                    <StatistikkOppsummert tittel="MANUELT" antall={totaltIdag.manuelt} />
                    <StatistikkOppsummert tittel="AUTOMATISK" antall={totaltIdag.automatisk} />
                    <StatistikkOppsummert tittel="AVVIST" antall={behandlingsstatistikk.antallAvvisninger} />
                    <StatistikkOppsummert tittel="ANNULLERT" antall={behandlingsstatistikk.antallAnnulleringer} />
                </Table.Body>
            </Table>
        </>
    );
};
