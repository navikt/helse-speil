import React from 'react';

import { Overstyringsindikator } from '../../../../components/Overstyringsindikator';

import { Cell } from './Cell';

const dagtypeIsValid = (type: Dag['type']): boolean =>
    ['Helg', 'Arbeidsdag', 'Ferie', 'Permisjon'].every((it) => it !== type);

interface TotalGradProps {
    type: Dag['type'];
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
