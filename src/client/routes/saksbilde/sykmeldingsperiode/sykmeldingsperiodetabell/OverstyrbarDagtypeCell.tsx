import styled from '@emotion/styled';
import { Dagtype, Sykdomsdag, Utbetalingsdag } from 'internal-types';
import React, { ChangeEvent, useState } from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { Select } from '../../../../components/Select';

import { overstyrPermisjonsdagerEnabled } from '../../../../featureToggles';
import { CellContent } from '../../table/CellContent';
import { DagtypeIcon } from './DagtypeIcon';

const OverstyrbarSelect = styled(Select)`
    padding: 3px 2.5rem 3px 8px;
`;

const IconContainer = styled.div`
    width: 1rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

const sykdomsdagKanOverstyres = (type: Dagtype): boolean =>
    (type !== Dagtype.Helg && [Dagtype.Syk, Dagtype.Ferie, Dagtype.Egenmelding].includes(type)) ||
    (overstyrPermisjonsdagerEnabled && type === Dagtype.Permisjon);

const utbetalingsdagKanOverstyres = (type: Dagtype): boolean => type !== Dagtype.Arbeidsgiverperiode;

const kanOverstyres = (sykdomsdagtype: Dagtype, utbetalingsdagtype: Dagtype): boolean =>
    sykdomsdagKanOverstyres(sykdomsdagtype) && utbetalingsdagKanOverstyres(utbetalingsdagtype);

interface OverstyrbarDagtypeProps {
    sykdomsdag: Sykdomsdag;
    utbetalingsdag: Utbetalingsdag;
    onOverstyr: (dag: Sykdomsdag) => void;
}

export const OverstyrbarDagtypeCell = ({ sykdomsdag, utbetalingsdag, onOverstyr }: OverstyrbarDagtypeProps) => {
    const [opprinneligDagtype] = useState(sykdomsdag.type);

    const onSelectDagtype = ({ target }: ChangeEvent<HTMLSelectElement>) => {
        const nyDagtype = target.value as Dagtype;
        onOverstyr({ ...sykdomsdag, type: nyDagtype });
    };

    return (
        <td>
            <CellContent>
                <IconContainer>
                    <DagtypeIcon type={sykdomsdag.type} />
                </IconContainer>
                {kanOverstyres(sykdomsdag.type, utbetalingsdag.type) ? (
                    <OverstyrbarSelect defaultValue={sykdomsdag.type} onChange={onSelectDagtype}>
                        {Object.values(Dagtype)
                            .filter(
                                (dagtype: Dagtype) => sykdomsdagKanOverstyres(dagtype) || dagtype === opprinneligDagtype
                            )
                            .map((dagtype: Dagtype) => (
                                <option key={dagtype}>{dagtype}</option>
                            ))}
                    </OverstyrbarSelect>
                ) : (
                    <Normaltekst>{sykdomsdag.type}</Normaltekst>
                )}
            </CellContent>
        </td>
    );
};
