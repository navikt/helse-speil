import React, { ReactElement } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { DagtypeSelectInput } from '@saksbilde/utbetaling/DagTypeSelect/DagtypeSelectInput';
import { oppholdUtenforEøsVerdi } from '@saksbilde/utbetaling/DagTypeSelect/utils';
import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';

import type { DagtypeSelectProps } from './type';

interface Props extends DagtypeSelectProps {
    oppholdUtenforEøs?: OppholdUtenforEøsValg;
}

// Valget eies av forelderen. Dagtypen i skjemaet står urørt mens oppholdskravet vurderes.
interface OppholdUtenforEøsValg {
    valgt: boolean;
    onVelg: (valgt: boolean) => void;
}

export function DagtypeSelect({
    name,
    erSelvstendig,
    overstyringsdagtyper,
    className,
    hideError = false,
    oppholdUtenforEøs,
}: Props): ReactElement {
    const { setValue } = useFormContext();
    const { field, fieldState } = useController({ name });

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value === oppholdUtenforEøsVerdi) {
            oppholdUtenforEøs?.onVelg(true);
            return;
        }
        field.onChange(event);
        if (!kanVelgeGrad(event.target.value)) setValue('grad', null);
        oppholdUtenforEøs?.onVelg(false);
    };

    return (
        <DagtypeSelectInput
            erSelvstendig={erSelvstendig}
            overstyringsdagtyper={overstyringsdagtyper}
            kanVelgeOppholdUtenforEøs={oppholdUtenforEøs !== undefined}
            className={className}
            error={fieldState.error?.message}
            hideError={hideError}
            field={{
                ...field,
                value: oppholdUtenforEøs?.valgt ? oppholdUtenforEøsVerdi : field.value,
                onChange: handleChange,
            }}
        />
    );
}
