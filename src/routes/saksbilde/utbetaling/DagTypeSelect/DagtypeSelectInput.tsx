import React, { ComponentProps, ReactElement, ReactNode } from 'react';

import { Select } from '@navikt/ds-react';

import { DagtypevelgerLabel } from '@saksbilde/utbetaling/DagTypeSelect/DagtypevelgerLabel';
import type { DagtypeSelectProps } from '@saksbilde/utbetaling/DagTypeSelect/type';
import { visningstekst } from '@saksbilde/utbetaling/DagTypeSelect/utils';
import { typeendringerAndreYtelser } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endringFormUtils';

type SelectFieldProps = Pick<
    ComponentProps<typeof Select>,
    'name' | 'value' | 'onChange' | 'onBlur' | 'disabled' | 'ref'
>;

interface DagtypeSelectInputProps extends Omit<DagtypeSelectProps, 'name'> {
    error?: ReactNode;
    field: SelectFieldProps;
    children?: ReactNode;
    style?: ComponentProps<typeof Select>['style'];
}

export function DagtypeSelectInput({
    erSelvstendig,
    overstyringsdagtyper,
    className,
    hideError = false,
    error,
    field,
    children,
    style,
}: DagtypeSelectInputProps): ReactElement {
    return (
        <Select
            size="small"
            style={style}
            label={<DagtypevelgerLabel erSelvstendig={erSelvstendig} />}
            error={hideError ? error != undefined : error}
            data-testid="dagtypevelger"
            className={className}
            {...field}
        >
            {overstyringsdagtyper.map((dag) => (
                <option key={dag.speilDagtype} value={dag.speilDagtype}>
                    {visningstekst(dag)}
                </option>
            ))}
            <option disabled>-- Andre ytelser --</option>
            {typeendringerAndreYtelser.map((dag) => (
                <option key={dag.speilDagtype} value={dag.speilDagtype}>
                    {dag.visningstekst} 100 %
                </option>
            ))}
            {children}
        </Select>
    );
}
