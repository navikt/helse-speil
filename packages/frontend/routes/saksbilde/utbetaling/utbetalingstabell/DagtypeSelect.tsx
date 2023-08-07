import React from 'react';

import { Select } from '@navikt/ds-react';

import {
    OverstyrbarDagtype,
    alleTypeendringer,
    typeendringer,
    typeendringerAndreYtelser,
} from './EndringForm/endringFormUtils';

import styles from './EndringForm/EndringForm.module.css';

interface DagtypeSelectProps {
    errorMessage?: string;
    clearErrors: () => void;
    setType: (type: OverstyrbarDagtype) => void;
}

export const DagtypeSelect = ({ errorMessage, clearErrors, setType }: DagtypeSelectProps) => {
    const oppdaterDagtype = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (alleTypeendringer.includes(event.target.value as OverstyrbarDagtype)) {
            clearErrors();
            const type = event.target.value as OverstyrbarDagtype;
            setType(type);
        }
    };

    return (
        <Select
            className={styles.Dagtypevelger}
            size="small"
            label="Utbet. dager"
            onChange={oppdaterDagtype}
            error={errorMessage ? <>{errorMessage}</> : null}
            data-testid="dagtypevelger"
        >
            {typeendringer.map((dagtype) => (
                <option key={dagtype} value={dagtype}>
                    {dagtype}
                </option>
            ))}
            <option disabled>-- Andre ytelser --</option>
            {typeendringerAndreYtelser.map((dagtype) => (
                <option key={dagtype} value={dagtype}>
                    {dagtype}
                </option>
            ))}
        </Select>
    );
};
