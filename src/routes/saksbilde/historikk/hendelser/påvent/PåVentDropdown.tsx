import React from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { Button, Dropdown } from '@navikt/ds-react';

import { Maybe, PersonFragment } from '@io/graphql';
import dropdownStyles from '@saksbilde/historikk/hendelser/notat/HendelseDropdownMenu.module.css';
import { EndreButton } from '@saksbilde/historikk/hendelser/påvent/EndreButton';
import { PåVentButton } from '@saksbilde/saksbildeMenu/dropdown/PåVentButton';
import { DateString } from '@typer/shared';

interface PåVentDropdownProps {
    person: PersonFragment;
    årsaker: string[];
    notattekst: Maybe<string>;
    frist: Maybe<DateString>;
}

export const PåVentDropdown = ({ person, årsaker, notattekst, frist }: PåVentDropdownProps) => (
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
                <EndreButton person={person} årsaker={årsaker} notattekst={notattekst} frist={frist} />
                <PåVentButton person={person} />
            </Dropdown.Menu.List>
        </Dropdown.Menu>
    </Dropdown>
);
