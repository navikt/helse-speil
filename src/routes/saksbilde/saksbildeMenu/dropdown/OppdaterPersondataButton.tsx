import React, { ReactElement } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { useOppdaterPersondata } from './useOppdaterPersondata';

export const OppdaterPersondataButton = (): ReactElement => {
    const [forespørPersonoppdatering] = useOppdaterPersondata();

    return <Dropdown.Menu.List.Item onClick={forespørPersonoppdatering}>Oppdater persondata</Dropdown.Menu.List.Item>;
};
