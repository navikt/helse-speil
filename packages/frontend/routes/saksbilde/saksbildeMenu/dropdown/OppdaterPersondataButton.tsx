import React from 'react';

import { Dropdown } from '@navikt/ds-react';

import { useOppdaterPersondata } from './useOppdaterPersondata';

export const OppdaterPersondataButton: React.FC = () => {
    const [forespørPersonoppdatering] = useOppdaterPersondata();

    return <Dropdown.Menu.List.Item onClick={forespørPersonoppdatering}>Oppdater persondata</Dropdown.Menu.List.Item>;
};
