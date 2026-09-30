import { useParams } from 'next/navigation';
import React from 'react';

import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { useFjernOppdatererToast } from '@hooks/useFjernOppdatererToast';
import { usePostSjekkEndringForsikring } from '@io/rest/forsikring';
import { getGetForsikringsvurderingForPersonQueryKey } from '@io/rest/generated/forsikringer/forsikringer';
import {
    visningenErOppdatertToast,
    visningenErOppdatertToastKey,
    visningenOppdateresToast,
} from '@state/oppdateringToasts';
import { erNyOppgaveEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { ToastObject, useAddToast, useRemoveToast } from '@state/toasts';
import { useVisningenOppdateresState } from '@state/visningenOppdateres';
import { useQueryClient } from '@tanstack/react-query';
import { generateId } from '@utils/generateId';

interface EndringssjekkKnappProps {
    identitetsnummer: string;
    skjæringstidspunkt: string;
    forsikringsvurderingId: string;
}

export function EndringssjekkKnapp({
    identitetsnummer,
    skjæringstidspunkt,
    forsikringsvurderingId,
}: EndringssjekkKnappProps) {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const [visningenOppdateres, setVisningenOppdateres] = useVisningenOppdateresState();
    const { mutate, isPending } = usePostSjekkEndringForsikring();
    const queryClient = useQueryClient();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();

    useHåndterNyttEvent((event) => {
        if (erNyOppgaveEvent(event) && visningenOppdateres) {
            addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
            setVisningenOppdateres(false);
        }
    });

    useFjernOppdatererToast(visningenOppdateres);

    function sjekkEndring() {
        mutate(
            {
                data: {
                    identitetsnummer,
                    skjæringstidspunkt,
                },
            },
            {
                onSuccess: async ({ vurderingErEndret }) => {
                    if (vurderingErEndret) {
                        setVisningenOppdateres(true);
                        addToast(visningenOppdateresToast({}));
                    } else {
                        await queryClient.invalidateQueries({
                            queryKey: getGetForsikringsvurderingForPersonQueryKey(
                                personPseudoId,
                                forsikringsvurderingId,
                            ),
                        });
                        addToast(ingenEndringVedEndringssjekkToast);
                    }
                },
                onError: () => {
                    addToast(feilVedEndringssjekkToast);
                },
            },
        );
    }

    return (
        <Button
            size="xsmall"
            variant="tertiary"
            icon={<ArrowsCirclepathIcon />}
            loading={isPending || visningenOppdateres}
            onClick={sjekkEndring}
        >
            Hent på nytt
        </Button>
    );
}

const ingenEndringVedEndringssjekkToast: ToastObject = {
    key: generateId(),
    message: 'Forsikringsinformasjonen er allerede oppdatert',
    timeToLiveMs: 5000,
};

const feilVedEndringssjekkToast: ToastObject = {
    key: generateId(),
    message: 'Kunne ikke hente forsikring på nytt',
    variant: 'error',
    timeToLiveMs: 10000,
};
