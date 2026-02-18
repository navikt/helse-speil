import React, { ReactElement } from 'react';

import { cn } from '@utils/tw';

import { PeriodPins as PeriodPinsType } from './TimelinePeriod';

export function PeriodPins({ pins }: { pins: PeriodPinsType[] }): ReactElement | null {
    if (pins.length === 0) return null;

    const hasWarning = pins.includes('warning');
    const hasNotat = pins.includes('notat');
    const hasInfo = pins.includes('info');

    const topPin = hasNotat ? 'notat' : hasInfo ? 'info' : null;

    if (!topPin && !hasWarning) return null;

    return (
        <>
            {topPin && <TopPin type={topPin} />}
            {hasWarning && <WarningPin />}
        </>
    );
}

const TopPin = ({ type }: { type: 'info' | 'notat' }) => (
    <div
        className={cn(
            'pointer-events-none absolute -top-1.5 left-1/2 h-1.5 w-0.5 -translate-x-1/2 bg-ax-bg-accent-strong',
            "before:absolute before:-top-2.5 before:-left-1 before:size-2.5 before:rounded-full before:bg-ax-bg-accent-strong before:content-['']",
            type === 'notat' && [
                '-top-1.75',
                'before:-left-1.25 before:size-3 before:border-2 before:border-ax-bg-accent-strong before:bg-ax-bg-default',
                "after:absolute after:-top-1.5 after:-left-px after:size-1 after:rounded-full after:bg-ax-bg-accent-strong after:content-['']",
            ],
        )}
    />
);

const WarningPin = () => (
    <svg
        className="pointer-events-none absolute top-3.5 left-1/2 -translate-x-1/2"
        width="15"
        height="14"
        viewBox="0 0 15 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
    >
        <path
            d="M6.49135 0.328848C6.70292 -0.104036 7.28641 -0.11103 7.50721 0.316672L13.9315 13.1013C14.1405 13.5063 13.8631 14 13.4266 14H0.575864C0.145067 14 -0.132785 13.518 0.0648783 13.1135L6.49135 0.328848Z"
            fill="var(--ax-bg-warning-strong)"
        />
    </svg>
);
