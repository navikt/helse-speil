import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { Dispatch, SetStateAction, useMemo } from 'react';

import { Checkbox as NavCheckbox } from '@navikt/ds-react';

import { UtbetalingstabellDag } from './Utbetalingstabell.types';

import { overstyrPermisjonsdagerEnabled } from '../../../../featureToggles';

const Container = styled.div`
    position: absolute;
    top: -4rem;
    left: 0;
    padding: 1rem;

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

const Checkbox = styled(NavCheckbox)<{ partial: boolean }>`
    ${({ partial }) =>
        partial &&
        css`
            > label:before {
                content: '-';
                font-size: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #c4c4c4;
                border: none;
            }
        `}
`;

interface MarkerAlleDagerCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'> {
    alleDager: Map<string, UtbetalingstabellDag>;
    markerteDager: Map<string, UtbetalingstabellDag>;
    setMarkerteDager: Dispatch<SetStateAction<Map<string, UtbetalingstabellDag>>>;
    skjæringstidspunkt: string;
}

export const MarkerAlleDagerCheckbox: React.FC<MarkerAlleDagerCheckboxProps> = ({
    alleDager,
    markerteDager,
    setMarkerteDager,
    skjæringstidspunkt,
    ...rest
}) => {
    const dagKanOverstyres = (type: Dag['type'], dato: Dayjs) =>
        (!dato.isSame(skjæringstidspunkt, 'day') &&
            type !== 'Helg' &&
            ['Syk', 'Ferie', 'Egenmelding'].includes(type)) ||
        (overstyrPermisjonsdagerEnabled && type === 'Permisjon');

    const overstyrbareDager = useMemo(
        () =>
            Array.from(alleDager.entries()).reduce(
                (dager, [key, dag]) => (dagKanOverstyres(dag.type, dag.dato) ? dager.set(key, dag) : dager),
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

    const hasSelectedSome = markerteDager.size > 0 && markerteDager.size !== overstyrbareDager.size;

    return (
        <Container>
            <Checkbox
                partial={hasSelectedSome}
                onChange={onChange}
                checked={overstyrbareDager.size === markerteDager.size}
                {...rest}
                hideLabel
            >
                Marker alle dager
            </Checkbox>
        </Container>
    );
};
