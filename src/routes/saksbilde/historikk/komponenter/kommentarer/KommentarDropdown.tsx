import React from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { Button, Dropdown } from '@navikt/ds-react';

type KommentarDropdownProps = {
    isFetching: boolean;
    feilregistrerAction: () => void;
};

export const KommentarDropdown = ({ feilregistrerAction, isFetching }: KommentarDropdownProps) => {
    return (
        <Dropdown>
            <span>
                <Button
                    as={Dropdown.Toggle}
                    size="xsmall"
                    variant="tertiary"
                    loading={isFetching}
                    icon={<MenuElipsisHorizontalIcon title="kommentar dropdown" />}
                />
            </span>
            <Dropdown.Menu>
                <Dropdown.Menu.List>
                    <Dropdown.Menu.List.Item onClick={feilregistrerAction}>Feilregistrer</Dropdown.Menu.List.Item>
                </Dropdown.Menu.List>
            </Dropdown.Menu>
        </Dropdown>
    );
};
