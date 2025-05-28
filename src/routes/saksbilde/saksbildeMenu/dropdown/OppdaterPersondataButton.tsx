import React, { ReactElement } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { PersonFragment } from '@io/graphql';

import { useOppdaterPersondata } from './useOppdaterPersondata';

type Props = {
    person: PersonFragment;
};

export const OppdaterPersondataButton = ({ person }: Props): ReactElement => {
    const [forespørPersonoppdatering] = useOppdaterPersondata();

    return (
        <Dropdown.Menu.List.Item onClick={() => forespørPersonoppdatering(person.fodselsnummer)}>
            Oppdater Infotrygd-historikk
        </Dropdown.Menu.List.Item>
    );
};
