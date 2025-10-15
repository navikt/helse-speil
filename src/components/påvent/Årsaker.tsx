import React from 'react';

import { Checkbox, CheckboxGroup, Skeleton, VStack } from '@navikt/ds-react';

import { Arsak } from '@external/sanity';

import styles from './PåVentModaler.module.scss';

interface ÅrsakerProps {
    årsaker: Arsak[] | undefined;
    årsakerLoading: boolean;
    valgteÅrsaker: string[];
    setValgteÅrsaker: (valgteÅrsaker: string[]) => void;
    error: string | null;
}

export const Årsaker = ({ årsaker, årsakerLoading, valgteÅrsaker, setValgteÅrsaker, error }: ÅrsakerProps) => {
    return (
        <CheckboxGroup
            legend="Hvorfor legges oppgaven på vent?"
            hideLegend
            className={styles.checkboxcontainer}
            error={error}
            value={valgteÅrsaker}
            onChange={setValgteÅrsaker}
        >
            {!årsakerLoading &&
                årsaker?.map((årsak) => {
                    return (
                        <Checkbox key={årsak._key} value={årsak.arsak} className={styles.årsakcheckbox}>
                            <p>{årsak.arsak}</p>
                        </Checkbox>
                    );
                })}
            {årsakerLoading && (
                <VStack gap="1" style={{ width: '50%' }}>
                    {Array.from({ length: 10 }, (_, index) => (
                        <div key={`skeleton${index}`} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Skeleton variant="rectangle" width="1.5rem" height="1.5rem" />
                            <Skeleton variant="text" height="2.5rem" width="100%" />
                        </div>
                    ))}
                </VStack>
            )}
        </CheckboxGroup>
    );
};
