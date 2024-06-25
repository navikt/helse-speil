import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Antall, Behandlingsstatistikk } from '@io/graphql';

import { LabelCell } from './LabelCell';
import { Separator } from './Separator';
import { StatistikkRow } from './StatistikkRow';

import styles from './BehandlingsstatistikkView.module.css';

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
                        <BodyShort size="small" className={styles.FooterTotal}>
                            FULLFØRTE SAKER I DAG:{' '}
                            <span>
                                {totaltIdag.manuelt + totaltIdag.automatisk + behandlingsstatistikk.antallAnnulleringer}
                            </span>
                        </BodyShort>
                    </td>
                </tr>
                <tr>
                    <td colSpan={4}>
                        <div className={styles.FooterCellContainer}>
                            <div className={styles.FooterCell}>
                                <BodyShort>{totaltIdag.manuelt}</BodyShort>
                                <BodyShort>MANUELT</BodyShort>
                            </div>
                            <div className={styles.FooterCell}>
                                <BodyShort>{totaltIdag.automatisk}</BodyShort>
                                <BodyShort>AUTOMATISK</BodyShort>
                            </div>
                            <div className={styles.FooterCell}>
                                <BodyShort>{totaltIdag.tilgjengelig}</BodyShort>
                                <BodyShort>TILGJENGELIG</BodyShort>
                            </div>
                            <div className={styles.FooterCell}>
                                <BodyShort>{behandlingsstatistikk.antallAnnulleringer}</BodyShort>
                                <BodyShort>ANNULLERT</BodyShort>
                            </div>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
};
