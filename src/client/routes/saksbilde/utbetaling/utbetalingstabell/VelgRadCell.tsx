import styled from '@emotion/styled';
import { Dagtype } from 'internal-types';
import React from 'react';

import { Checkbox as NavCheckbox } from '@navikt/ds-react';

import { overstyrPermisjonsdagerEnabled } from '../../../../featureToggles';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

const Checkbox = styled(NavCheckbox)`
    position: absolute;
    padding: 0;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    > input {
        max-height: 2rem;
        max-width: 2rem;
    }
`;

const Cell = styled.td`
    padding: 1rem;
    background: #fff;
`;

interface VelgRadCellProps {
    index: number;
    onChange: (checked: boolean) => void;
    dag: UtbetalingstabellDag;
    overstyrer: boolean;
}

export const VelgRadCell: React.FC<VelgRadCellProps> = ({ index, onChange, dag, overstyrer }) => {
    const dagKanOverstyres = (type: Dagtype): boolean =>
        (type !== Dagtype.Helg && [Dagtype.Syk, Dagtype.Ferie, Dagtype.Egenmelding].includes(type)) ||
        (overstyrPermisjonsdagerEnabled && type === Dagtype.Permisjon);

    if (!overstyrer || !dagKanOverstyres(dag.type)) {
        return <Cell />;
    }

    return (
        <Cell>
            <Checkbox onChange={(event) => onChange(event.target.checked)} hideLabel>
                Velg rad {index + 1} for endring
            </Checkbox>
        </Cell>
    );
};
