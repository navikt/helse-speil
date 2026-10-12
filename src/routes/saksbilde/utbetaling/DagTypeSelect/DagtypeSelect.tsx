import React, { ReactElement } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { DagtypeSelectInput } from '@saksbilde/utbetaling/DagTypeSelect/DagtypeSelectInput';
import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';

import type { DagtypeSelectProps } from './type';

export function DagtypeSelect({
    name,
    erSelvstendig,
    overstyringsdagtyper,
    className,
    hideError = false,
}: DagtypeSelectProps): ReactElement {
    const { setValue } = useFormContext();
    const { field, fieldState } = useController({ name });

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        field.onChange(event);
        if (!kanVelgeGrad(event.target.value)) setValue('grad', null);
    };

    return (
        <DagtypeSelectInput
            erSelvstendig={erSelvstendig}
            overstyringsdagtyper={overstyringsdagtyper}
            className={className}
            error={fieldState.error?.message}
            hideError={hideError}
            field={{ ...field, onChange: handleChange }}
        />
    );
}
