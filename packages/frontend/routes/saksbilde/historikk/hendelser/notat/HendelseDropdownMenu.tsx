import React from 'react';

import { EllipsisH } from '@navikt/ds-icons';
import { Button, Dropdown } from '@navikt/ds-react';

import styles from './HendelseDropdownMenu.module.css';

type DropdownMenuProps = {
    isFetching: boolean;
    feilregistrerAction: () => void;
};

export const HendelseDropdownMenu = ({ feilregistrerAction, isFetching }: DropdownMenuProps) => {
    return (
        <Dropdown>
            <Button
                as={Dropdown.Toggle}
                variant="tertiary"
                className={styles.ToggleButton}
                size="xsmall"
                loading={isFetching}
            >
                <EllipsisH height={32} width={32} />
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
