import React, { ReactElement, ReactNode } from 'react';

import { HStack } from '@navikt/ds-react';

import { cn } from '@utils/tw';

import { JusterbarSidemenyContext } from './context';
import { useJusterbarBredde } from './useJusterbarBredde';

interface JusterbarSidebarProps {
    defaultBredde: number;
    visSidemeny: boolean;
    children: ReactNode;
    onChangeBredde?: (width: number) => void;
    className?: string;
    localStorageNavn?: string;
    åpnesTilVenstre?: boolean;
}

export const JusterbarSidemeny = ({
    visSidemeny,
    defaultBredde,
    children,
    localStorageNavn,
    className,
    onChangeBredde,
    åpnesTilVenstre = false,
}: JusterbarSidebarProps): ReactElement => {
    const { visningsbredde, isDragging, startDragging } = useJusterbarBredde({
        defaultBredde,
        visSidemeny,
        localStorageNavn,
        onChangeBredde,
        åpnesTilVenstre,
    });

    const separatorClassName = cn(
        'relative z-2 flex cursor-col-resize items-stretch transition-[width] duration-200 ease-in-out',
        !visSidemeny && 'w-0',
        visSidemeny &&
            "w-2 border-l border-l-ax-border-neutral-subtle before:absolute before:inset-y-0 before:-left-px before:w-[3px] before:origin-left before:scale-x-0 before:bg-ax-border-accent before:opacity-0 before:transition-[transform,opacity] before:duration-200 before:ease-in-out before:content-[''] hover:before:scale-x-100 hover:before:opacity-100",
        visSidemeny && isDragging && 'before:scale-x-100 before:opacity-100',
    );

    const innholdClassName = cn(
        'relative z-1 min-h-0 transition-[margin] duration-200 ease-in-out',
        // Åpne popovere (f.eks. datovelger) skal ligge over dra-linja
        'has-[.aksel-popover:not(.aksel-popover--hidden)]:z-3',
        visSidemeny ? (åpnesTilVenstre ? 'ml-0' : 'mr-0') : åpnesTilVenstre ? '-ml-80' : '-mr-80',
    );

    return (
        <HStack
            align="stretch"
            wrap={false}
            className={cn('z-1 overflow-hidden', åpnesTilVenstre && 'flex-row-reverse', className)}
            style={{ gridArea: 'høyremeny' }}
        >
            <div role="separator" className={separatorClassName} onMouseDown={startDragging} />
            <div className={innholdClassName} style={{ width: `${visningsbredde}px` }}>
                <JusterbarSidemenyContext value={{ isDragging }}>{children}</JusterbarSidemenyContext>
            </div>
        </HStack>
    );
};
