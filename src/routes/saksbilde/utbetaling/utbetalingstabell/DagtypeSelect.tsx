import React, { useState } from 'react';

import { Select } from '@navikt/ds-react';

import { Button } from '@components/Button';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { Key, useKeyboard } from '@hooks/useKeyboard';
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

    useKeyboard([
        {
            key: Key.D,
            action: () => setShowModal(!showModal),
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
    ]);

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
            {showModal && <DagtypeModal onClose={() => setShowModal(false)} showModal={showModal} />}
        </>
    );
};
