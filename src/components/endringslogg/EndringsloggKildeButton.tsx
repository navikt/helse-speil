import React, { ReactElement, useState } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { cn } from '@utils/tw';

interface EndringsloggKildeButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    renderEndringslogg: (onOpenChange: (open: boolean) => void) => ReactElement;
}

export function EndringsloggKildeButton({
    renderEndringslogg,
    className,
    ...buttonProps
}: EndringsloggKildeButtonProps): ReactElement {
    const [visEndringslogg, setVisEndringslogg] = useState(false);

    return (
        <>
            <button
                className={cn(
                    'relative flex cursor-pointer justify-center border-none bg-transparent p-0 outline-none [&>div]:cursor-pointer! [&>div:hover]:bg-ax-text-neutral [&>div:hover]:text-ax-text-neutral-contrast',
                    className,
                )}
                type="button"
                onClick={() => setVisEndringslogg(true)}
                {...buttonProps}
            >
                <Kilde type="Saksbehandler">
                    <PersonPencilFillIcon title="Saksbehandler ikon" />
                </Kilde>
            </button>
            {visEndringslogg && renderEndringslogg(setVisEndringslogg)}
        </>
    );
}
