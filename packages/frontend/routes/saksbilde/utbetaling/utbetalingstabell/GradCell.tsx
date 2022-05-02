import React from 'react';

import { Endringstrekant } from '@components/Endringstrekant';

const dagtypeIsValid = (type: Utbetalingstabelldagtype): boolean =>
    ['Helg', 'Arbeid', 'Ferie', 'Permisjon'].every((it) => it !== type);

const renderGrad = (grad?: Maybe<number>): string | false => typeof grad === 'number' && `${grad} %`;

interface GradCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    dag: UtbetalingstabellDag;
    overstyrtDag?: UtbetalingstabellDag;
}

export const GradCell: React.FC<GradCellProps> = ({ dag, overstyrtDag, ...rest }) => {
    const gradErOverstyrt = overstyrtDag && overstyrtDag.grad !== dag.grad;
    const overstyringstekst = typeof dag.grad === 'number' ? `Endret fra ${dag.grad} %` : 'Endret fra dag uten grad';

    return (
        <td {...rest}>
            {gradErOverstyrt && <Endringstrekant text={overstyringstekst} />}
            {dagtypeIsValid(overstyrtDag?.type ?? dag.type) && renderGrad(overstyrtDag?.grad ?? dag.grad)}
        </td>
    );
};
