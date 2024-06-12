import React, { ReactElement } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { PersonFragment } from '@io/graphql';

import { useOppdaterPersondata } from './useOppdaterPersondata';

type Props = {
    person: PersonFragment;
};

export const OppdaterPersondataButton = ({ person }: Props): ReactElement => {
    const [forespørPersonoppdatering] = useOppdaterPersondata(person);

    return <Dropdown.Menu.List.Item onClick={forespørPersonoppdatering}>Oppdater persondata</Dropdown.Menu.List.Item>;
};
