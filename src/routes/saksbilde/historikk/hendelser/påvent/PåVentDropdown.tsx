import React from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { Button, Dropdown } from '@navikt/ds-react';

import { PersonFragment } from '@io/graphql';
import dropdownStyles from '@saksbilde/historikk/hendelser/notat/HendelseDropdownMenu.module.css';
import { PåVentButton } from '@saksbilde/saksbildeMenu/dropdown/PåVentButton';

export const PåVentDropdown = ({ person }: { person: PersonFragment }) => (
    <Dropdown>
        <Button
            as={Dropdown.Toggle}
            size="xsmall"
            variant="tertiary"
            title="Mer"
            className={dropdownStyles.ToggleButton}
        >
            <MenuElipsisHorizontalIcon title="Alternativer" height={20} width={20} />
        </Button>
        <Dropdown.Menu className={dropdownStyles.Menu}>
            <Dropdown.Menu.List>
                <PåVentButton person={person} />
            </Dropdown.Menu.List>
        </Dropdown.Menu>
    </Dropdown>
);
