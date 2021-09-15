import styled from '@emotion/styled';
import { Dagtype } from 'internal-types';
import React, { Dispatch, SetStateAction, useMemo } from 'react';

import { Checkbox } from '@navikt/ds-react';

import { overstyrPermisjonsdagerEnabled } from '../../../../featureToggles';
import { UtbetalingstabellDag } from './Utbetalingstabell.types';

const Container = styled.div`
    position: absolute;
    top: -4rem;
    left: 0;
    padding: 1rem;
    background: #fff;

    > div {
        position: absolute;
        padding: 0;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        > input {
            max-height: 2rem;
            max-width: 2rem;
        }
    }
`;

interface MarkerAlleDagerCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'> {
    alleDager: Map<string, UtbetalingstabellDag>;
    markerteDager: Map<string, UtbetalingstabellDag>;
    setMarkerteDager: Dispatch<SetStateAction<Map<string, UtbetalingstabellDag>>>;
}

export const MarkerAlleDagerCheckbox: React.FC<MarkerAlleDagerCheckboxProps> = ({
    alleDager,
    markerteDager,
    setMarkerteDager,
    ...rest
}) => {
    const dagKanOverstyres = (type: Dagtype) =>
        (type !== Dagtype.Helg && [Dagtype.Syk, Dagtype.Ferie, Dagtype.Egenmelding].includes(type)) ||
        (overstyrPermisjonsdagerEnabled && type === Dagtype.Permisjon);

    const overstyrbareDager = useMemo(
        () =>
            Array.from(alleDager.entries()).reduce(
                (dager, [key, dag]) => (dagKanOverstyres(dag.type) ? dager.set(key, dag) : dager),
                new Map()
            ),
        [alleDager]
    );

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setMarkerteDager(overstyrbareDager);
        } else {
            setMarkerteDager(new Map());
        }
    };

    return (
        <Container>
            <Checkbox onChange={onChange} checked={overstyrbareDager.size === markerteDager.size} {...rest} hideLabel>
                Marker alle dager
            </Checkbox>
        </Container>
    );
};
