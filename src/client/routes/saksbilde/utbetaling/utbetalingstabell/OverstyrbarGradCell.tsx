import styled from '@emotion/styled';
import { Dag, Dagtype, Sykdomsdag, Utbetalingsdag } from 'internal-types';
import React, { ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';

import { Normaltekst } from 'nav-frontend-typografi';

import { CellContent } from '../../table/CellContent';

const Error = styled.label`
    vertical-align: center;
    color: var(--navds-color-text-error);
    display: flex;
    align-items: center;
    font-weight: 600;
    margin-left: 0.5rem;
`;

const GraderingInput = styled.input<{ error: boolean }>`
    box-sizing: border-box;
    width: 2.5rem;
    padding: 3px 0.375rem;
    border-radius: 3px;
    border: 1px solid var(--navds-color-border);
    font-family: inherit;
    color: var(--navds-color-text-primary);
    outline: none;

    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    -moz-appearance: textfield;

    &:hover {
        border-color: var(--navds-text-focus);
        box-shadow: none;
    }

    &:focus {
        border-color: var(--navds-text-focus);
        box-shadow: 0 0 0 2px var(--navds-text-focus);
    }

    ${({ error }) =>
        error &&
        `
        border-color: var(--navds-color-text-error);
        box-shadow: 0 0 0 1px var(--navds-color-text-error);
    `}
`;

const sykdomsdagKanOverstyres = (dag: Sykdomsdag) =>
    dag.gradering !== undefined &&
    dag.gradering !== null &&
    ![Dagtype.Helg, Dagtype.Arbeidsdag, Dagtype.Ferie, Dagtype.Permisjon].includes(dag.type);

const utbetalingsdagKanOverstyres = (dag: Utbetalingsdag): boolean => dag.type !== Dagtype.Arbeidsgiverperiode;

const showGrad = (dag: Utbetalingsdag): boolean =>
    dag.type !== Dagtype.Arbeidsgiverperiode && dag.type !== Dagtype.Helg && !!dag.gradering;

const kanOverstyres = (sykdomsdag: Sykdomsdag, utbetalingsdag: Utbetalingsdag): boolean =>
    sykdomsdagKanOverstyres(sykdomsdag) && utbetalingsdagKanOverstyres(utbetalingsdag);

interface OverstyrbarGradCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    sykdomsdag: Sykdomsdag;
    utbetalingsdag: Utbetalingsdag;
    onOverstyr: (dag: Sykdomsdag, properties: Omit<Partial<Dag>, 'dato'>) => void;
    erRevurdering: boolean;
}

export const OverstyrbarGradCell = ({
    sykdomsdag,
    utbetalingsdag,
    onOverstyr,
    erRevurdering,
    ...rest
}: OverstyrbarGradCellProps) => {
    const { register, errors, trigger } = useFormContext();

    const name = sykdomsdag.dato.format('YYYY-MM-DD');
    const hasError = errors[name] !== undefined;

    const onChangeGradering = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const nyGradering = +target.value;
        onOverstyr(sykdomsdag, { gradering: nyGradering });
    };

    return (
        <td {...rest}>
            <CellContent>
                {!erRevurdering && kanOverstyres(sykdomsdag, utbetalingsdag) ? (
                    <>
                        <GraderingInput
                            name={name}
                            id={name}
                            type="number"
                            ref={register({
                                min: { value: 0, message: 'Gradering må være 0 eller større' },
                                max: { value: 100, message: 'Gradering må være 100 eller mindre' },
                                required: 'Gradering mangler',
                            })}
                            defaultValue={sykdomsdag.gradering}
                            onChange={onChangeGradering}
                            error={hasError}
                            aria-invalid={hasError}
                            onBlur={() => trigger(name)}
                            aria-label={`Gradering for ${name}`}
                            data-testid="overstyrbar-grad"
                        />
                        {errors[name] && <Error htmlFor={name}>{errors[name].message}</Error>}
                    </>
                ) : (
                    showGrad(utbetalingsdag) && <Normaltekst>{`${utbetalingsdag.gradering} %`}</Normaltekst>
                )}
            </CellContent>
        </td>
    );
};
