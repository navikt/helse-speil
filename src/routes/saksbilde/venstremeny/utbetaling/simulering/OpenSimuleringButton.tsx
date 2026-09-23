import React, { ReactElement } from 'react';

import { Alert, Link } from '@navikt/ds-react';

import { PopupWindowPortal, usePopupWindow } from '@components/PopupWindow';
import { Simulering, Utbetaling } from '@io/graphql';
import { cn } from '@utils/tw';

import { SimuleringView } from './SimuleringView';

interface OpenSimuleringButtonProps {
    simulering: Simulering;
    utbetaling: Utbetaling;
    className?: string;
}

export function OpenSimuleringButton({ simulering, utbetaling, className }: OpenSimuleringButtonProps): ReactElement {
    const { popup, erBlokkert, åpne } = usePopupWindow('Simulering', 'width=600,height=900');

    return (
        <>
            <Link
                as="button"
                type="button"
                aria-expanded={popup !== null}
                onClick={åpne}
                className={cn('-mt-1 mb-1 w-max', className)}
            >
                Simulering
            </Link>
            {erBlokkert && (
                <Alert variant="warning" size="small" inline>
                    Nettleseren blokkerte vinduet. Tillat sprettoppvinduer for Speil for å se simuleringen.
                </Alert>
            )}
            {popup !== null && (
                <PopupWindowPortal popup={popup}>
                    <SimuleringView simulering={simulering} utbetalingId={utbetaling.id} />
                </PopupWindowPortal>
            )}
        </>
    );
}
