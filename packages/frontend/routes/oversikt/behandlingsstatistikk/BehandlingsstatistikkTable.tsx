import React from 'react';

import { Antall, Behandlingsstatistikk } from '@io/graphql';

import { StatistikkRow } from './StatistikkRow';
import { Separator } from './Separator';
import { LabelCell } from './LabelCell';

const getTotaltIdag = (statistikk: Behandlingsstatistikk): Antall => {
    return {
        manuelt: statistikk.enArbeidsgiver.manuelt + statistikk.flereArbeidsgivere.manuelt,
        automatisk: statistikk.enArbeidsgiver.automatisk + statistikk.flereArbeidsgivere.automatisk,
        tilgjengelig: statistikk.enArbeidsgiver.tilgjengelig + statistikk.flereArbeidsgivere.tilgjengelig,
    };
};

interface BehandlingsstatistikkTableProps {
    behandlingsstatistikk: Behandlingsstatistikk;
}

export const BehandlingsstatistikkTable: React.FC<BehandlingsstatistikkTableProps> = ({ behandlingsstatistikk }) => {
    const totaltIdag = getTotaltIdag(behandlingsstatistikk);

    return (
        <table>
            <thead>
                <tr>
                    <th />
                    <th>MANUELT</th>
                    <th>AUTOM.</th>
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
            </tbody>
            <Separator />
            <tbody>
                <StatistikkRow antall={behandlingsstatistikk.utbetalingTilArbeidsgiver}>
                    <LabelCell.UtbetalingTilArbeidsgiver />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.utbetalingTilSykmeldt}>
                    <LabelCell.UtbetalingTilSykmeldt />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.delvisRefusjon}>
                    <LabelCell.DelvisRefusjon />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.faresignaler}>
                    <LabelCell.Faresignaler />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.fortroligAdresse}>
                    <LabelCell.FortroligAdresse />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.stikkprover}>
                    <LabelCell.Stikkprøver />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.revurdering}>
                    <LabelCell.Revurdering />
                </StatistikkRow>
                <StatistikkRow antall={behandlingsstatistikk.beslutter}>
                    <LabelCell.Beslutter />
                </StatistikkRow>
            </tbody>
            <Separator />
            <tfoot>
                <tr>
                    <td>TOTALT IDAG</td>
                    <td>{totaltIdag.manuelt}</td>
                    <td>{totaltIdag.automatisk}</td>
                    <td>{totaltIdag.tilgjengelig}</td>
                </tr>
                <tr>
                    <td>ANNULLERT IDAG</td>
                    <td>{behandlingsstatistikk.antallAnnulleringer}</td>
                </tr>
            </tfoot>
        </table>
    );
};
