import { Dagtype } from 'internal-types';
import React from 'react';

import { Overstyringsindikator } from './Overstyringsindikator';

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
        <td>
            {showTotalGradering && (
                <>
                    {erOverstyrt && <Overstyringsindikator />}
                    {`${totalGradering} %`}
                </>
            )}
        </td>
    );
};
