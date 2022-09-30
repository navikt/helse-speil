import React from 'react';

import { EllipsisH } from '@navikt/ds-icons';
import { Button, Loader } from '@navikt/ds-react';
import { Dropdown } from '@navikt/ds-react-internal';

import styles from './HendelseDropdownMenu.module.css';

type DropdownMenuProps = {
    isFetching: boolean;
    feilregistrerAction: () => void;
};

export const HendelseDropdownMenu = ({ feilregistrerAction, isFetching }: DropdownMenuProps) => {
    return (
        <Dropdown>
            <Button as={Dropdown.Toggle} variant="tertiary" className={styles.ToggleButton} size="xsmall">
                <EllipsisH height={32} width={32} />
            </Button>
            <Dropdown.Menu className={styles.Menu}>
                <Dropdown.Menu.List>
                    <Dropdown.Menu.List.Item onClick={feilregistrerAction} className={styles.ListItem}>
                        Feilregistrer {isFetching && <Loader size="xsmall" />}
                    </Dropdown.Menu.List.Item>
                </Dropdown.Menu.List>
            </Dropdown.Menu>
        </Dropdown>
    );
};
