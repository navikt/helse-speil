import styled from '@emotion/styled';
import { Dagtype, Sykdomsdag, Utbetalingsdag } from 'internal-types';
import React, { ChangeEvent, useState } from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { Select } from '../../../../components/Select';

import { overstyrPermisjonsdagerEnabled } from '../../../../featureToggles';
import { CellContent } from '../../table/CellContent';
import { DagtypeIcon } from './DagtypeIcon';

const OverstyrbarSelect = styled(Select)`
    padding: 3px 2.625rem 3px 8px;
    min-width: max-content;
`;

const IconContainer = styled.div`
    width: 1rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

interface DagtypeLabelProps {
    sykdomsdag: Sykdomsdag;
    utbetalingsdag: Utbetalingsdag;
}

const DagtypeLabel = ({ sykdomsdag, utbetalingsdag }: DagtypeLabelProps) => {
    const text = (() => {
        switch (utbetalingsdag.type) {
            case Dagtype.Avvist:
                return `${sykdomsdag.type} (Avvist)`;
            case Dagtype.Foreldet:
                return `${sykdomsdag.type} (Foreldet)`;
            case Dagtype.Arbeidsgiverperiode:
                return `${sykdomsdag.type} (AGP)`;
            default:
                return sykdomsdag.type;
        }
    })();
    return <Normaltekst>{text}</Normaltekst>;
};

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

    const sykdomsdagKanOverstyres = (type: Dagtype): boolean =>
        (type !== Dagtype.Helg && [Dagtype.Syk, Dagtype.Ferie, Dagtype.Egenmelding].includes(type)) ||
        (overstyrPermisjonsdagerEnabled && type === Dagtype.Permisjon);

    const kanOverstyres =
        sykdomsdagKanOverstyres(sykdomsdag.type) && utbetalingsdag.type !== Dagtype.Arbeidsgiverperiode;

    return (
        <td>
            <CellContent>
                <IconContainer>
                    <DagtypeIcon type={sykdomsdag.type} />
                </IconContainer>
                {kanOverstyres ? (
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
                    <DagtypeLabel sykdomsdag={sykdomsdag} utbetalingsdag={utbetalingsdag} />
                )}
            </CellContent>
        </td>
    );
};
