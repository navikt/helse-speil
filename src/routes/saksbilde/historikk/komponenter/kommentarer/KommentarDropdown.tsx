import React from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';

type KommentarDropdownProps = {
    isFetching: boolean;
    feilregistrerAction: () => void;
};

export const KommentarDropdown = ({ feilregistrerAction, isFetching }: KommentarDropdownProps) => (
    <ActionMenu>
        <ActionMenu.Trigger>
            <Button
                size="xsmall"
                variant="tertiary"
                loading={isFetching}
                icon={<MenuElipsisHorizontalIcon title="Handlinger" />}
            />
        </ActionMenu.Trigger>
        <ActionMenu.Content>
            <ActionMenu.Item onSelect={feilregistrerAction}>Feilregistrer</ActionMenu.Item>
        </ActionMenu.Content>
    </ActionMenu>
);
