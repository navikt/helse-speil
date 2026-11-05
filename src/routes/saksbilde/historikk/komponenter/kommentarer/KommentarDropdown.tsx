import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Tooltip } from '@navikt/ds-react';

import { ActionMenuItemKreverSkrivetilgang } from '@components/skrivetilgang/ActionMenuItemKreverSkrivetilgang';

type KommentarDropdownProps = {
    isFetching: boolean;
    feilregistrerAction: () => void;
};

export const KommentarDropdown = ({ feilregistrerAction, isFetching }: KommentarDropdownProps) => (
    <ActionMenu>
        <Tooltip content="Handlinger">
            <ActionMenu.Trigger>
                <Button
                    size="xsmall"
                    variant="tertiary"
                    loading={isFetching}
                    icon={<MenuElipsisHorizontalIcon aria-hidden />}
                />
            </ActionMenu.Trigger>
        </Tooltip>
        <ActionMenu.Content>
            <ActionMenuItemKreverSkrivetilgang onSelect={feilregistrerAction}>
                Feilregistrer
            </ActionMenuItemKreverSkrivetilgang>
        </ActionMenu.Content>
    </ActionMenu>
);
