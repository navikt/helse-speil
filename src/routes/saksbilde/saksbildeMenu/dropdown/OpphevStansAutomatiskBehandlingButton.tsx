import { nanoid } from 'nanoid';
import React, { ReactElement } from 'react';

import { Dropdown, Loader } from '@navikt/ds-react';

import { useOpphevStansAutomatiskBehandling } from '@hooks/stansAutomatiskBehandling';
import { ToastObject, useAddToast, useRemoveToast } from '@state/toasts';

interface OpphevStansAutomatiskBehandlingButtonProps {
    fødselsnummer: string;
}

export function OpphevStansAutomatiskBehandlingButton({
    fødselsnummer,
}: OpphevStansAutomatiskBehandlingButtonProps): ReactElement {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const [opphevStansAutomatiskBehandling] = useOpphevStansAutomatiskBehandling();

    async function opphev() {
        addToast(opphevStansLoadingToast);
        await opphevStansAutomatiskBehandling(fødselsnummer).then(() => {
            removeToast(opphevStansLoadingKey);
            addToast(opphevStansDoneToast);
        });
    }

    return <Dropdown.Menu.List.Item onClick={opphev}>Opphev stans av automatisk behandling</Dropdown.Menu.List.Item>;
}

const opphevStansLoadingKey = 'opphevStansAutomatiskBehandlingLoading';

const opphevStansLoadingToast: ToastObject = {
    key: opphevStansLoadingKey,
    message: (
        <>
            Opphever stans av automatisk behandling <Loader size="xsmall" variant="inverted" />
        </>
    ),
};

const opphevStansDoneToast: ToastObject = {
    key: nanoid(),
    message: 'Stans av automatisk behandling opphevet',
    variant: 'success',
    timeToLiveMs: 5000,
};
