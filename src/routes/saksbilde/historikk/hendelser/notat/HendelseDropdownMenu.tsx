import React from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { Button, Dropdown } from '@navikt/ds-react';

import styles from './HendelseDropdownMenu.module.css';

type DropdownMenuProps = {
    isFetching: boolean;
    feilregistrerAction: () => void;
};

export const HendelseDropdownMenu = ({ feilregistrerAction, isFetching }: DropdownMenuProps) => {
    return (
        <Dropdown onSelect={(event: React.MouseEvent) => event.stopPropagation()}>
            <Button
                as={Dropdown.Toggle}
                variant="tertiary"
                className={styles.ToggleButton}
                size="xsmall"
                loading={isFetching}
                onClick={(event: React.MouseEvent) => {
                    event.stopPropagation();
                }}
            >
                <MenuElipsisHorizontalIcon height={32} width={32} />
            </Button>
            <Dropdown.Menu className={styles.Menu}>
                <Dropdown.Menu.List>
                    <Dropdown.Menu.List.Item onClick={feilregistrerAction} className={styles.ListItem}>
                        Feilregistrer
                    </Dropdown.Menu.List.Item>
                </Dropdown.Menu.List>
            </Dropdown.Menu>
        </Dropdown>
    );
};
