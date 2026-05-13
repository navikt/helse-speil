import React, { ReactElement } from 'react';

import { MinusIcon, PlusIcon } from '@navikt/aksel-icons';
import { Accordion, BodyShort, Button, HStack, VStack } from '@navikt/ds-react';

import {
    DialogmeldingKolonne,
    useDialogmeldingFilters,
    useToggleDialogmeldingFilter,
} from '@oversikt/table/state/dialogmeldingFilter';
import { Filter, FilterStatus } from '@oversikt/table/state/filter';

import avOgPåStyles from './AvOgPåKnapper.module.css';
import styles from './FilterList.module.css';

interface DialogmeldingFilterListProps {
    filters: Filter[];
    text: string;
    onToggle: (key: string, status: FilterStatus) => void;
}

const DialogmeldingFilterList = ({ filters, text, onToggle }: DialogmeldingFilterListProps): ReactElement => (
    <Accordion indent={false}>
        <Accordion.Item defaultOpen className={styles.liste}>
            <Accordion.Header className={styles.header}>
                <BodyShort weight="semibold">{text}</BodyShort>
            </Accordion.Header>
            <Accordion.Content className={styles.innhold}>
                <VStack gap="space-8">
                    {filters.map((filter) => (
                        <HStack gap="space-8" key={filter.key}>
                            <BodyShort className={avOgPåStyles.label}>{filter.label}</BodyShort>
                            <HStack gap="space-8" wrap={false}>
                                <Button
                                    variant={filter.status === FilterStatus.PLUS ? 'primary' : 'secondary'}
                                    size="xsmall"
                                    icon={<PlusIcon title="Filtrer" />}
                                    onClick={() =>
                                        onToggle(
                                            filter.key,
                                            filter.status === FilterStatus.PLUS ? FilterStatus.OFF : FilterStatus.PLUS,
                                        )
                                    }
                                />
                                <Button
                                    variant={filter.status === FilterStatus.MINUS ? 'danger' : 'secondary'}
                                    size="xsmall"
                                    icon={<MinusIcon title="Filtrer bort" />}
                                    onClick={() =>
                                        onToggle(
                                            filter.key,
                                            filter.status === FilterStatus.MINUS
                                                ? FilterStatus.OFF
                                                : FilterStatus.MINUS,
                                        )
                                    }
                                />
                            </HStack>
                        </HStack>
                    ))}
                </VStack>
            </Accordion.Content>
        </Accordion.Item>
    </Accordion>
);

export const DialogmeldingFiltermeny = (): ReactElement => {
    const { allFilters } = useDialogmeldingFilters();
    const toggleFilter = useToggleDialogmeldingFilter();

    return (
        <>
            <DialogmeldingFilterList
                filters={allFilters.filter((f) => f.column === DialogmeldingKolonne.FAGOMRADE)}
                text="Fagområde"
                onToggle={toggleFilter}
            />
            <DialogmeldingFilterList
                filters={allFilters.filter((f) => f.column === DialogmeldingKolonne.MELDINGSTYPE)}
                text="Meldingstype"
                onToggle={toggleFilter}
            />
            <DialogmeldingFilterList
                filters={allFilters.filter((f) => f.column === DialogmeldingKolonne.STATUS)}
                text="Status"
                onToggle={toggleFilter}
            />
        </>
    );
};
