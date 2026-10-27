import React, { ReactElement } from 'react';

import { MinusIcon, PlusIcon } from '@navikt/aksel-icons';
import { Accordion, BodyShort, Button, HStack, Tooltip, VStack } from '@navikt/ds-react';

import {
    DialogmeldingKolonne,
    useDialogmeldingFilters,
    useToggleDialogmeldingFilter,
} from '@oversikt/table/state/dialogmeldingFilter';
import { Filter, FilterStatus } from '@oversikt/table/state/filter';

export const DialogmeldingFiltermeny = (): ReactElement => {
    const { allFilters } = useDialogmeldingFilters();
    const toggleFilter = useToggleDialogmeldingFilter();

    return (
        <Accordion indent={false}>
            <DialogmeldingFilterList
                filters={allFilters.filter((f) => f.column === DialogmeldingKolonne.FAGOMRADE)}
                text="Fagområde"
                onToggle={toggleFilter}
            />
            <DialogmeldingFilterList
                filters={allFilters.filter((f) => f.column === DialogmeldingKolonne.STATUS)}
                text="Status"
                onToggle={toggleFilter}
            />
        </Accordion>
    );
};

interface DialogmeldingFilterListProps {
    filters: Filter[];
    text: string;
    onToggle: (key: string, status: FilterStatus) => void;
}

const DialogmeldingFilterList = ({ filters, text, onToggle }: DialogmeldingFilterListProps): ReactElement => (
    <Accordion.Item defaultOpen className="border-b-2 border-ax-border-neutral-subtle pt-3">
        <Accordion.Header className="box-border border-0 bg-transparent py-2 pr-4 pl-0 shadow-none [&::after]:h-0 [&::before]:h-0">
            <BodyShort weight="semibold">{text}</BodyShort>
        </Accordion.Header>
        <Accordion.Content className="mb-0 ml-7.5 px-1 pb-4.5">
            <VStack gap="space-8">
                {filters.map((filter) => (
                    <HStack gap="space-8" key={filter.key} wrap={false}>
                        <BodyShort className="w-40 text-ax-text-neutral">{filter.label}</BodyShort>
                        <HStack gap="space-8" wrap={false} className="self-center">
                            <Tooltip content="Filtrer">
                                <Button
                                    variant={filter.status === FilterStatus.PLUS ? 'primary' : 'secondary'}
                                    size="xsmall"
                                    icon={<PlusIcon aria-hidden />}
                                    onClick={() =>
                                        onToggle(
                                            filter.key,
                                            filter.status === FilterStatus.PLUS ? FilterStatus.OFF : FilterStatus.PLUS,
                                        )
                                    }
                                />
                            </Tooltip>
                            <Tooltip content="Filtrer bort">
                                <Button
                                    variant={filter.status === FilterStatus.MINUS ? 'danger' : 'secondary'}
                                    size="xsmall"
                                    icon={<MinusIcon aria-hidden />}
                                    onClick={() =>
                                        onToggle(
                                            filter.key,
                                            filter.status === FilterStatus.MINUS
                                                ? FilterStatus.OFF
                                                : FilterStatus.MINUS,
                                        )
                                    }
                                />
                            </Tooltip>
                        </HStack>
                    </HStack>
                ))}
            </VStack>
        </Accordion.Content>
    </Accordion.Item>
);
