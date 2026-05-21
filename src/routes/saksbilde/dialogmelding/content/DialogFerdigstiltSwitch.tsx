'use client';

import React, { ReactElement, useState } from 'react';

import { Alert, Switch } from '@navikt/ds-react';

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

    return (
        <>
            <Switch
                checked={checked}
                onChange={(e) => {
                    mutate({
                        pseudoId: personPseudoId,
                        conversationRef: dialogId,
                        data: { ferdigstilt: e.target.checked },
                    });
                }}
                disabled={isPending}
            >
                Ferdigstilt
            </Switch>
            {isError && (
                <Alert variant="error" size="small">
                    Kunne ikke oppdatere status. Prøv igjen.
                </Alert>
            )}
        </>
    );
}
