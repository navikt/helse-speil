import React, { useState } from 'react';

import { Select } from '@navikt/ds-react';

import { Button } from '@components/Button';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import styles from '@saksbilde/utbetaling/utbetalingstabell/endringForm/EndringForm.module.css';
import {
    OverstyrbarDagtype,
    alleTypeendringer,
    typeendringer,
    typeendringerAndreYtelser,
} from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endringFormUtils';

import { DagtypeModal } from './DagtypeModal';

interface DagtypeSelectProps {
    errorMessage?: string;
    clearErrors: () => void;
    setType: (type: OverstyrbarDagtype) => void;
}

export const DagtypeSelect = ({ errorMessage, clearErrors, setType }: DagtypeSelectProps) => {
    const [showModal, setShowModal] = useState(false);
    const oppdaterDagtype = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (alleTypeendringer.map((dag) => dag.speilDagtype).includes(event.target.value as OverstyrbarDagtype)) {
            clearErrors();
            const type = event.target.value as OverstyrbarDagtype;
            setType(type);
        }
    };

    return (
        <>
            <Select
                className={styles.Dagtypevelger}
                size="small"
                label={
                    <span className={styles.dagtypelabel}>
                        Dagtype{' '}
                        <Button className={styles.button} type="button" onClick={() => setShowModal(true)}>
                            <SortInfoikon />
                        </Button>
                    </span>
                }
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
            <DagtypeModal isOpen={showModal} onSetVisModal={(open) => setShowModal(open)} />
        </>
    );
};
