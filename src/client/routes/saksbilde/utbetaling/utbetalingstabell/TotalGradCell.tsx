import { Dagtype } from 'internal-types';
import React from 'react';

import { Overstyringsindikator } from '../../../../components/Overstyringsindikator';

import { Cell } from './Cell';

const dagtypeIsValid = (type: Dagtype): boolean =>
    [Dagtype.Helg, Dagtype.Arbeidsdag, Dagtype.Ferie, Dagtype.Permisjon].every((it) => it !== type);

interface TotalGradProps {
    type: Dagtype;
    erOverstyrt?: boolean;
    totalGradering?: number;
}

export const TotalGradCell = ({ type, erOverstyrt, totalGradering }: TotalGradProps) => {
    const showTotalGradering = totalGradering && dagtypeIsValid(type);

    return (
        <Cell erOverstyrt={erOverstyrt}>
            {erOverstyrt && <Overstyringsindikator />}
            {showTotalGradering && <>{`${totalGradering} %`}</>}
        </Cell>
    );
};
