import React from 'react';
import { LoadingShimmer } from '@components/LoadingShimmer';

import { Separator } from './Separator';
import { LabelCell } from './LabelCell';

const LoadingCells: React.FC = () => {
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

export const BehandlingsstatistikkSkeleton: React.FC = () => {
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
                        <LabelCell.UtbetalingTilArbeidsgiver />
                    </td>
                    <LoadingCells />
                </tr>
                <tr>
                    <td>
                        <LabelCell.UtbetalingTilSykmeldt />
                    </td>
                    <LoadingCells />
                </tr>
                <tr>
                    <td>
                        <LabelCell.DelvisRefusjon />
                    </td>
                    <LoadingCells />
                </tr>
                <tr>
                    <td>
                        <LabelCell.Faresignaler />
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
            <tfoot>
                <tr>
                    <td>TOTALT IDAG</td>
                    <LoadingCells />
                </tr>
                <tr>
                    <td>ANNULLERT IDAG</td>
                    <td>
                        <LoadingShimmer />
                    </td>
                </tr>
            </tfoot>
        </table>
    );
};
