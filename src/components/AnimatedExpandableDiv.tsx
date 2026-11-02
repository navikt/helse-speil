import React, { PropsWithChildren, ReactElement, useEffect, useState } from 'react';

import { cn } from '@utils/tw';

const DURATION_MS = 200;

type Phase = 'closed' | 'opening' | 'open' | 'closing';

interface AnimatedExpandableDivProps extends PropsWithChildren {
    expanded: boolean;
}

export function AnimatedExpandableDiv({ expanded, children }: AnimatedExpandableDivProps): ReactElement | null {
    const [phase, setPhase] = useState<Phase>(expanded ? 'open' : 'closed');

    if (expanded && (phase === 'closed' || phase === 'closing')) setPhase('opening');
    if (!expanded && (phase === 'open' || phase === 'opening')) setPhase('closing');

    // Innholdet fjernes fra DOM først når lukkeanimasjonen er ferdig. Timer i stedet for transitionend,
    // fordi transitionend ikke fyrer med prefers-reduced-motion eller i jsdom.
    useEffect(() => {
        if (phase !== 'opening' && phase !== 'closing') return;
        const timeout = setTimeout(() => setPhase(phase === 'opening' ? 'open' : 'closed'), DURATION_MS);
        return () => clearTimeout(timeout);
    }, [phase]);

    if (phase === 'closed') return null;

    return (
        <div
            className={cn(
                'grid transition-[grid-template-rows] duration-200 ease-in-out motion-reduce:transition-none',
                phase === 'closing' ? 'grid-rows-[0fr]' : 'grid-rows-[1fr] starting:grid-rows-[0fr]',
            )}
        >
            {/* overflow: hidden bare mens høyden animeres, så fokusringer o.l. ikke klippes når den står åpen */}
            <div className={cn('min-h-0', phase !== 'open' && 'overflow-hidden')}>{children}</div>
        </div>
    );
}
