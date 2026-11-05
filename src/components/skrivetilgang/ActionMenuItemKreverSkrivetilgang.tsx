import { ReactElement } from 'react';

import { ActionMenu, Tooltip } from '@navikt/ds-react';
import type { ActionMenuItemProps } from '@navikt/ds-react/ActionMenu';

import { UTEN_SKRIVETILGANG_TEKST } from '@components/skrivetilgang/utenSkrivetilgang';
import { useHarSkrivetilgang } from '@hooks/brukerrolleHooks';
import { cn } from '@utils/tw';

type ActionMenuItemKreverSkrivetilgangProps = ActionMenuItemProps;

export function ActionMenuItemKreverSkrivetilgang(props: ActionMenuItemKreverSkrivetilgangProps): ReactElement {
    const harSkrivetilgang = useHarSkrivetilgang();

    if (harSkrivetilgang) {
        return <ActionMenu.Item {...props} />;
    }

    // Aksel setter pointer-events: none på deaktiverte menyvalg, og da får tooltipen aldri hover.
    // preventDefault på mousedown hindrer at klikket gir menyvalget fokus og dermed fokusbakgrunn.
    return (
        <Tooltip content={UTEN_SKRIVETILGANG_TEKST} describesChild>
            <ActionMenu.Item
                {...utenHandling(props)}
                disabled
                onMouseDown={(event) => event.preventDefault()}
                className={cn(props.className, 'pointer-events-auto cursor-not-allowed')}
            />
        </Tooltip>
    );
}

function utenHandling({
    onSelect: _onSelect,
    onClick: _onClick,
    ...rest
}: ActionMenuItemKreverSkrivetilgangProps): ActionMenuItemKreverSkrivetilgangProps {
    return rest;
}
