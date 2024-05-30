import React from 'react';

import { Antall, Behandlingsstatistikk } from '@io/graphql';

import { LabelCell } from './LabelCell';
import { Separator } from './Separator';
import { StatistikkRow } from './StatistikkRow';

import styles from './BehandlingsstatistikkView.module.css';

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
    const søknad = {
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
            <tfoot>
                <tr>
                    <td colSpan={4}>
                        <p className={styles.FooterTotal}>
                            FULLFØRTE SAKER I DAG:{' '}
                            <span>
                                {totaltIdag.manuelt + totaltIdag.automatisk + behandlingsstatistikk.antallAnnulleringer}
                            </span>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td colSpan={4}>
                        <div className={styles.FooterCellContainer}>
                            <div className={styles.FooterCell}>
                                <p>{totaltIdag.manuelt}</p>
                                <p>MANUELT</p>
                            </div>
                            <div className={styles.FooterCell}>
                                <p>{totaltIdag.automatisk}</p>
                                <p>AUTOMATISK</p>
                            </div>
                            <div className={styles.FooterCell}>
                                <p>{totaltIdag.tilgjengelig}</p>
                                <p>TILGJENGELIG</p>
                            </div>
                            <div className={styles.FooterCell}>
                                <p>{behandlingsstatistikk.antallAnnulleringer}</p>
                                <p>ANNULLERT</p>
                            </div>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
};
