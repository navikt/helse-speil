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
        if (alleTypeendringer.map((dag) => dag.speilDagtype).includes(event.target.value as OverstyrbarDagtype)) {
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
            <>
                {typeendringer.map((dag) => (
                    <option key={dag.speilDagtype} value={dag.speilDagtype}>
                        {dag.visningstekst}
                    </option>
                ))}
                <option disabled>-- Andre ytelser --</option>
                {typeendringerAndreYtelser.map((dag) => (
                    <option key={dag.speilDagtype} value={dag.speilDagtype}>
                        {dag.visningstekst}
                    </option>
                ))}
            </>
        </Select>
    );
};
