import React from 'react';

import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { useFjernOppdatererToast } from '@hooks/useFjernOppdatererToast';
import { usePostSjekkEndringForsikring } from '@io/rest/forsikring';
import {
    visningenErOppdatertToast,
    visningenErOppdatertToastKey,
    visningenOppdateresToast,
} from '@state/oppdateringToasts';
import { erNyOppgaveEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { ToastObject, useAddToast, useRemoveToast } from '@state/toasts';
import { useVisningenOppdateresState } from '@state/visningenOppdateres';
import { generateId } from '@utils/generateId';

interface EndringssjekkKnappProps {
    identitetsnummer: string;
    skjæringstidspunkt: string;
    behandlingId: string;
    vedtaksperiodeId: string;
}

export function EndringssjekkKnapp({
    identitetsnummer,
    skjæringstidspunkt,
    behandlingId,
    vedtaksperiodeId,
}: EndringssjekkKnappProps) {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const [visningenOppdateres, setVisningenOppdateres] = useVisningenOppdateresState();
    const { mutate, isPending } = usePostSjekkEndringForsikring();

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
                    behandlingId,
                    vedtaksperiodeId,
                },
            },
            {
                onSuccess: ({ nyForsikringsvurdering }) => {
                    if (nyForsikringsvurdering) {
                        setVisningenOppdateres(true);
                        addToast(visningenOppdateresToast({}));
                    } else {
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
