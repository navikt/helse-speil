import React, { ReactElement } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { TextField } from '@navikt/ds-react';

interface GradFieldProps {
    name: string;
    kanIkkeVelgeDagtype?: boolean;
    hideError?: boolean;
    className?: string;
}

export function GradField({ name, kanIkkeVelgeDagtype, className, hideError = false }: GradFieldProps): ReactElement {
    const { setValue } = useFormContext();
    const { field, fieldState } = useController({ name });
    const [display, setDisplay] = React.useState<string>(field.value == null ? '' : field.value.toString());

    const commit = () => {
        const parsed = Number.parseInt(display);
        field.onChange(isNaN(parsed) ? null : parsed);
        return parsed;
    };

    if (kanIkkeVelgeDagtype && field.value != null) {
        field.onChange(null);
        setValue(name, null);
        setDisplay('');
    }

    return (
        <TextField
            size="small"
            inputMode="numeric"
            label="Grad"
            htmlSize={8}
            disabled={kanIkkeVelgeDagtype}
            data-testid="gradvelger"
            error={hideError ? fieldState.error?.message != undefined : fieldState.error?.message}
            value={display}
            onChange={(e) => setDisplay(e.target.value)}
            onBlur={() => {
                const parsed = commit();
                if (display !== '') {
                    setDisplay(isNaN(parsed) ? display : parsed.toString());
                }
                field.onBlur();
            }}
            onMouseDown={(e) => {
                if (document.activeElement !== e.target) {
                    e.preventDefault();
                    (e.target as HTMLInputElement).select();
                }
            }}
            className={className}
        />
    );
}
