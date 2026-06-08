import React, { ReactElement, ReactNode } from 'react';

import { HStack } from '@navikt/ds-react';

import { cn } from '@utils/tw';

import { JusterbarSidemenyContext } from './JusterbarSidemenyContext';
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
        'relative z-2 flex cursor-col-resize items-stretch transition-[width,border-color,border-left-width] duration-200 ease-in-out',
        !visSidemeny && 'w-0',
        visSidemeny && 'w-2 border-l',
        visSidemeny && isDragging && 'border-l-3 border-ax-border-accent',
        visSidemeny &&
            !isDragging &&
            'border-l-ax-border-neutral-subtle hover:border-l-3 hover:border-ax-border-accent',
    );

    const innholdClassName = cn(
        'relative z-1 transition-[margin] duration-200 ease-in-out',
        visSidemeny ? (åpnesTilVenstre ? 'ml-0' : 'mr-0') : åpnesTilVenstre ? '-ml-80' : '-mr-80',
    );

    return (
        <HStack
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
