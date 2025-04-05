import React, { ReactElement } from 'react';

import { MinusIcon, PlusIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack } from '@navikt/ds-react';

import { Filter, FilterStatus, useToggleFilter } from '@oversikt/table/state/filter';

import styles from './AvOgPåKnapper.module.css';

type AvOgPåKnapperProps = {
    filter: Filter;
};

export const AvOgPåKnapper = ({ filter }: AvOgPåKnapperProps): ReactElement => {
    const toggleFilter = useToggleFilter();

    const toggleFilterOn = () => {
        if (filter.status === FilterStatus.PLUS) {
            toggleFilter(filter.key, FilterStatus.OFF);
        } else {
            toggleFilter(filter.key, FilterStatus.PLUS);
        }
    };

    const toggleFilterOut = () => {
        if (filter.status === FilterStatus.MINUS) {
            toggleFilter(filter.key, FilterStatus.OFF);
        } else {
            toggleFilter(filter.key, FilterStatus.MINUS);
        }
    };

    return (
        <HStack gap="2">
            <BodyShort className={styles.label}>{filter.label}</BodyShort>
            <PlussKnapp filterStatus={filter.status} toggleFilterOn={toggleFilterOn} />
            <MinusKnapp filterStatus={filter.status} toggleFilterOut={toggleFilterOut} />
        </HStack>
    );
};

type PlussKnappProps = {
    filterStatus: FilterStatus;
    toggleFilterOn: () => void;
};

const PlussKnapp = ({ filterStatus, toggleFilterOn }: PlussKnappProps): ReactElement => (
    <Button
        variant={filterStatus === FilterStatus.PLUS ? 'primary' : 'secondary'}
        size="xsmall"
        icon={<PlusIcon title="Filtrer" />}
        onClick={toggleFilterOn}
    />
);

type MinusKnappProps = {
    filterStatus: FilterStatus;
    toggleFilterOut: () => void;
};

const MinusKnapp = ({ filterStatus, toggleFilterOut }: MinusKnappProps): ReactElement => (
    <Button
        variant={filterStatus === FilterStatus.MINUS ? 'danger' : 'secondary'}
        size="xsmall"
        icon={<MinusIcon title="Filtrer bort" />}
        onClick={toggleFilterOut}
    />
);
