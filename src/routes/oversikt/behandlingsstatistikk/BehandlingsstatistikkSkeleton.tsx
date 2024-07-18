import React, { ReactElement } from 'react';

import { Table } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';
import { StatistikkOppsummertSkeleton } from '@oversikt/behandlingsstatistikk/StatistikkOppsummertSkeleton';

import { LabelCell } from './LabelCell';
import { Separator } from './Separator';

const LoadingCells = (): ReactElement => {
    return (
        <>
            <td>
                <LoadingShimmer />
            </td>
            <td>
                <LoadingShimmer />
            </td>
            <td>
                <LoadingShimmer />
            </td>
        </>
    );
};

export const BehandlingsstatistikkSkeleton = (): ReactElement => {
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
                    <tr>
                        <td>
                            <LabelCell.EnArbeidsgiver />
                        </td>
                        <LoadingCells />
                    </tr>
                    <tr>
                        <td>
                            <LabelCell.FlereArbeidsgivere />
                        </td>
                        <LoadingCells />
                    </tr>
                </tbody>
                <Separator />
                <tbody>
                    <tr>
                        <td>
                            <LabelCell.Førstegangsbehandling />
                        </td>
                        <LoadingCells />
                    </tr>
                    <tr>
                        <td>
                            <LabelCell.Forlengelser />
                        </td>
                        <LoadingCells />
                    </tr>
                    <tr>
                        <td>
                            <LabelCell.ForlengelseInfotrygd />
                        </td>
                        <LoadingCells />
                    </tr>
                </tbody>
                <Separator />
                <tbody>
                    <tr>
                        <td>
                            <LabelCell.Søknad />
                        </td>
                        <LoadingCells />
                    </tr>
                    <tr>
                        <td>
                            <LabelCell.Vurderingsoppgaver />
                        </td>
                        <LoadingCells />
                    </tr>
                    <tr>
                        <td>
                            <LabelCell.FortroligAdresse />
                        </td>
                        <LoadingCells />
                    </tr>
                    <tr>
                        <td>
                            <LabelCell.Stikkprøver />
                        </td>
                        <LoadingCells />
                    </tr>
                    <tr>
                        <td>
                            <LabelCell.EgenAnsatt />
                        </td>
                        <LoadingCells />
                    </tr>
                    <tr>
                        <td>
                            <LabelCell.Revurdering />
                        </td>
                        <LoadingCells />
                    </tr>
                    <tr>
                        <td>
                            <LabelCell.Beslutter />
                        </td>
                        <LoadingCells />
                    </tr>
                </tbody>
                <Separator />
            </table>
            <Table>
                <Table.Body>
                    <StatistikkOppsummertSkeleton tittel="TILGJENGELIG"></StatistikkOppsummertSkeleton>
                    <StatistikkOppsummertSkeleton tittel="FULLFØRTE SAKER I DAG"></StatistikkOppsummertSkeleton>
                    <StatistikkOppsummertSkeleton tittel="MANUELT"></StatistikkOppsummertSkeleton>
                    <StatistikkOppsummertSkeleton tittel="AUTOMATISK"></StatistikkOppsummertSkeleton>
                    <StatistikkOppsummertSkeleton tittel="ANNULLERT"></StatistikkOppsummertSkeleton>
                    <StatistikkOppsummertSkeleton tittel="AVVIST"></StatistikkOppsummertSkeleton>
                </Table.Body>
            </Table>
        </>
    );
};
