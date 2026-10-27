import React, { ReactElement, useState } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { cn } from '@utils/tw';

interface EndringsloggKildeButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    renderEndringslogg: (onOpenChange: (open: boolean) => void) => ReactElement;
    ikon?: ReactElement;
    kildetype?: 'Saksbehandler' | 'Endringslogg';
}

export function EndringsloggKildeButton({
    renderEndringslogg,
    ikon = <PersonPencilFillIcon aria-hidden />,
    kildetype = 'Saksbehandler',
    className,
    ...buttonProps
}: EndringsloggKildeButtonProps): ReactElement {
    const [visEndringslogg, setVisEndringslogg] = useState(false);

    return (
        <>
            <button
                className={cn('relative flex cursor-pointer justify-center border-none p-0 outline-none', className)}
                type="button"
                aria-label="Vis endringslogg"
                onClick={() => setVisEndringslogg(true)}
                {...buttonProps}
            >
                <Kilde type={kildetype} className="cursor-pointer hover:bg-ax-bg-neutral-moderate-hover">
                    {ikon}
                </Kilde>
            </button>
            {visEndringslogg && renderEndringslogg(setVisEndringslogg)}
        </>
    );
}
