import { ElementType, MouseEvent, ReactElement, Ref } from 'react';

import { Button, ButtonProps, Tooltip } from '@navikt/ds-react';

import { UTEN_SKRIVETILGANG_TEKST } from '@components/skrivetilgang/utenSkrivetilgang';
import { useHarSkrivetilgang } from '@hooks/brukerrolleHooks';
import { cn } from '@utils/tw';

type ButtonKreverSkrivetilgangProps = ButtonProps & {
    as?: ElementType;
    href?: string;
    ref?: Ref<HTMLButtonElement>;
};

// Uten skrivetilgang bruker vi aria-disabled i stedet for disabled, slik at knappen fortsatt kan få fokus og vise tooltip.
export function ButtonKreverSkrivetilgang(props: ButtonKreverSkrivetilgangProps): ReactElement {
    const harSkrivetilgang = useHarSkrivetilgang();

    if (harSkrivetilgang) {
        return <Button {...props} />;
    }

    return (
        <Tooltip content={UTEN_SKRIVETILGANG_TEKST} describesChild>
            <Button
                {...utenHandling(props)}
                aria-disabled
                onClick={stoppHandling}
                // Aksels egen disabled-klasse gir samme utseende som disabled, uten hover- og trykkfarger.
                className={cn(props.className, 'aksel-button--disabled')}
            />
        </Tooltip>
    );
}

function utenHandling({
    as: _as,
    href: _href,
    onClick: _onClick,
    loading: _loading,
    disabled: _disabled,
    ...rest
}: ButtonKreverSkrivetilgangProps): ButtonProps {
    return rest;
}

function stoppHandling(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
}
