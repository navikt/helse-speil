import { ReactElement, ReactNode, useLayoutEffect, useRef, useState } from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, VStack } from '@navikt/ds-react';

import { cn } from '@utils/tw';

import { BodyShortWithPreWrap } from './BodyShortWithPreWrap';

interface ExpanderbarTekstProps {
    children: ReactNode;
    className?: string;
    collapsedMaxHeightPx?: number;
}

export function EkspanderbarTekst({
    children,
    className,
    collapsedMaxHeightPx = 112,
}: ExpanderbarTekstProps): ReactElement {
    const [isExpanded, setIsExpanded] = useState(false);
    const [overflows, setOverflows] = useState(false);
    const textRef = useRef<HTMLParagraphElement>(null);

    useLayoutEffect(() => {
        const el = textRef.current;
        if (!el) return;
        setOverflows(el.scrollHeight > collapsedMaxHeightPx);
    }, [children, collapsedMaxHeightPx]);

    return (
        <VStack align="start" gap="space-4" className={cn('w-full', className)}>
            <BodyShortWithPreWrap
                ref={textRef}
                style={!isExpanded && overflows ? { maxHeight: `${collapsedMaxHeightPx}px` } : undefined}
                className={cn(
                    'w-full',
                    !isExpanded &&
                        overflows &&
                        'overflow-hidden mask-[linear-gradient(to_bottom,black_60%,transparent)]',
                )}
            >
                {children}
            </BodyShortWithPreWrap>
            {overflows && (
                <Button
                    icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    variant="tertiary"
                    size="xsmall"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="-ml-2"
                >
                    {isExpanded ? 'Vis mindre' : 'Vis mer'}
                </Button>
            )}
        </VStack>
    );
}
