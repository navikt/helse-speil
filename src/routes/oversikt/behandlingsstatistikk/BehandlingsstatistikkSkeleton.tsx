import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';

import { LabelCell } from './LabelCell';
import { Separator } from './Separator';

import styles from './BehandlingsstatistikkView.module.css';

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
                        <LabelCell.Revurdering />
                    </td>
                    <LoadingCells />
                </tr>
            </tbody>
            <Separator />
            <tbody>
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
                        <LabelCell.Beslutter />
                    </td>
                    <LoadingCells />
                </tr>
                <tr>
                    <td>
                        <LabelCell.EgenAnsatt />
                    </td>
                    <LoadingCells />
                </tr>
            </tbody>
            <Separator />
            <tfoot>
                <tr>
                    <td colSpan={4}>
                        <BodyShort className={styles.FooterTotal}>
                            FULLFØRTE SAKER I DAG: <LoadingShimmer />
                        </BodyShort>
                    </td>
                </tr>
                <tr>
                    <td colSpan={4}>
                        <div className={styles.FooterCellContainer}>
                            <div className={styles.FooterCell}>
                                <BodyShort>
                                    <LoadingShimmer />
                                </BodyShort>
                                <BodyShort>MANUELT</BodyShort>
                            </div>
                            <div className={styles.FooterCell}>
                                <BodyShort>
                                    <LoadingShimmer />
                                </BodyShort>
                                <BodyShort>AUTOMATISK</BodyShort>
                            </div>
                            <div className={styles.FooterCell}>
                                <BodyShort>
                                    <LoadingShimmer />
                                </BodyShort>
                                <BodyShort>TILGJENGELIG</BodyShort>
                            </div>
                            <div className={styles.FooterCell}>
                                <BodyShort>
                                    <LoadingShimmer />
                                </BodyShort>
                                <BodyShort>ANNULLERT</BodyShort>
                            </div>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    );
};
