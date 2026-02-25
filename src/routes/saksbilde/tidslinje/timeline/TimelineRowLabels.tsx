import React, { ReactElement } from 'react';

import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort, CopyButton, HStack, Tooltip, VStack } from '@navikt/ds-react';

import { RowLabels } from '@saksbilde/tidslinje/timeline/index';
import { useExpandedRows, useToggleRow } from '@saksbilde/tidslinje/timeline/row/context';
import { cn } from '@utils/tw';

interface TimelineRowLabelsProps {
    labels: RowLabels;
}

export function TimelineRowLabels({ labels }: TimelineRowLabelsProps): ReactElement {
    const expandedRows = useExpandedRows();
    const toggleRowExpanded = useToggleRow();

    return (
        <VStack className="-ml-2 w-[254px] min-w-[254px]">
            <div className="h-[24px]" />
            {labels.map((label) => {
                const isExpandable = label.generationLevels > 0;
                const isExpanded = expandedRows.has(label.rowIndex);
                const expandedExtraHeight = isExpanded ? label.generationLevels * 32 : 0;

                return (
                    <HStack
                        key={label.rowIndex}
                        gap="space-4"
                        wrap={false}
                        align="start"
                        className="my-3"
                        style={{ height: `${24 + expandedExtraHeight}px` }}
                    >
                        <HStack
                            as={isExpandable ? 'button' : 'div'}
                            role={isExpandable ? 'button' : undefined}
                            onClick={isExpandable ? () => toggleRowExpanded(label.rowIndex) : undefined}
                            aria-expanded={isExpandable ? isExpanded : undefined}
                            className={cn('h-6', {
                                'group cursor-pointer rounded-lg text-ax-text-accent-subtle focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ax-border-focus':
                                    isExpandable,
                            })}
                            gap="space-8"
                            wrap={false}
                            align="start"
                        >
                            {isExpandable ? (
                                isExpanded ? (
                                    <ChevronDownIcon className="-mr-1" fontSize="1.5rem" />
                                ) : (
                                    <ChevronRightIcon className="-mr-1" fontSize="1.5rem" />
                                )
                            ) : (
                                <div className="w-5" />
                            )}
                            {label.icon}
                            <Tooltip content={label.label} describesChild>
                                <BodyShort
                                    data-sensitive
                                    className={cn(
                                        'max-w-[168px] leading-6 group-hover:underline',
                                        label.anonymized &&
                                            'pointer-events-none rounded bg-ax-bg-neutral-moderate text-transparent select-none',
                                    )}
                                    truncate
                                >
                                    {label.label}
                                </BodyShort>
                            </Tooltip>
                        </HStack>
                        {label.copyLabelButton && (
                            <Tooltip content="Kopier arbeidsgivernavn">
                                <CopyButton copyText={label.label} size="xsmall" />
                            </Tooltip>
                        )}
                    </HStack>
                );
            })}
        </VStack>
    );
}
