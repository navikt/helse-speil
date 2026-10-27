import React from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Tooltip } from '@navikt/ds-react';

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
            <ActionMenu.Item onSelect={feilregistrerAction}>Feilregistrer</ActionMenu.Item>
        </ActionMenu.Content>
    </ActionMenu>
);
