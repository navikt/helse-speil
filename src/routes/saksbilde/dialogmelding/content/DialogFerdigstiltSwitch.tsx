'use client';

import { ReactElement, useState } from 'react';

import { Alert, Switch, Tooltip } from '@navikt/ds-react';

import { UTEN_SKRIVETILGANG_TEKST } from '@components/skrivetilgang/utenSkrivetilgang';
import { useHarSkrivetilgang } from '@hooks/brukerrolleHooks';
import {
    getGetDialogmeldingQueryKey,
    getGetDialogmeldingerQueryKey,
    usePatchDialogstatus,
} from '@io/rest/generated/default/default';
import { ApiDialogmeldingStatus } from '@io/rest/generated/sporhund.schemas';
import { useQueryClient } from '@tanstack/react-query';

interface DialogFerdigstiltSwitchProps {
    personPseudoId: string;
    dialogId: string;
    initialFerdigstilt: boolean;
}

export function DialogFerdigstiltSwitch({
    personPseudoId,
    dialogId,
    initialFerdigstilt,
}: DialogFerdigstiltSwitchProps): ReactElement {
    const [checked, setChecked] = useState(initialFerdigstilt);
    const queryClient = useQueryClient();
    const harSkrivetilgang = useHarSkrivetilgang();

    const { mutate, isPending, isError } = usePatchDialogstatus({
        mutation: {
            onSuccess: (data) => {
                setChecked(data.status === ApiDialogmeldingStatus.FERDIGSTILT);
                queryClient.invalidateQueries({
                    queryKey: getGetDialogmeldingQueryKey(personPseudoId, dialogId),
                });
                queryClient.invalidateQueries({
                    queryKey: getGetDialogmeldingerQueryKey(personPseudoId),
                });
            },
        },
    });

    const ferdigstiltSwitch = (
        <Switch
            checked={checked}
            onChange={(e) => {
                mutate({
                    pseudoId: personPseudoId,
                    conversationRef: dialogId,
                    data: { ferdigstilt: e.target.checked },
                });
            }}
            readOnly={!harSkrivetilgang}
            disabled={isPending}
            className="[&_span]:text-ax-heading-xsmall"
        >
            Ferdigstilt
        </Switch>
    );

    return (
        <>
            {harSkrivetilgang ? (
                ferdigstiltSwitch
            ) : (
                <Tooltip content={UTEN_SKRIVETILGANG_TEKST} describesChild>
                    {ferdigstiltSwitch}
                </Tooltip>
            )}
            {isError && (
                <Alert variant="error" size="small">
                    Kunne ikke oppdatere status. Prøv igjen.
                </Alert>
            )}
        </>
    );
}
