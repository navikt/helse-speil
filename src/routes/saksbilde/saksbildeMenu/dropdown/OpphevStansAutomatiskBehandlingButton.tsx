import React, { ReactElement } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { useOpphevStansAutomatiskBehandling } from '@hooks/stansAutomatiskBehandling';

interface OpphevStansAutomatiskBehandlingButtonProps {
    fødselsnummer: string;
}

export function OpphevStansAutomatiskBehandlingButton({
    fødselsnummer,
}: OpphevStansAutomatiskBehandlingButtonProps): ReactElement {
    const [opphevStansAutomatiskBehandling] = useOpphevStansAutomatiskBehandling();

    return (
        <Dropdown.Menu.List.Item onClick={() => opphevStansAutomatiskBehandling(fødselsnummer)}>
            Opphev stans av automatisk behandling
        </Dropdown.Menu.List.Item>
    );
}
