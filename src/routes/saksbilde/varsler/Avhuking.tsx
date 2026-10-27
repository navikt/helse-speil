import React, { MouseEvent, ReactElement } from 'react';

import { XMarkOctagonFillIcon } from '@navikt/aksel-icons';

import { useHarSkrivetilgang } from '@hooks/brukerrolleHooks';
import { ApiSaksbildeVarselstatus } from '@io/rest/generated/spesialist.schemas';
import { CheckIcon } from '@saksbilde/tidslinje/icons';
import { cn } from '@utils/tw';

import { VarselstatusType } from './Varsler';

import styles from './Avhuking.module.css';

type AvhukingProps = {
    type: VarselstatusType;
    varselstatus: ApiSaksbildeVarselstatus;
    settVarselstatusAktiv: () => void;
    settVarselstatusVurdert: () => void;
};

export const Avhuking = ({
    type,
    varselstatus,
    settVarselstatusAktiv,
    settVarselstatusVurdert,
}: AvhukingProps): ReactElement => {
    const harSkrivetilgang = useHarSkrivetilgang();
    const disabledButton = varselstatus === ApiSaksbildeVarselstatus.GODKJENT || type === 'feil' || !harSkrivetilgang;

    const clickEvent = (event: MouseEvent<HTMLSpanElement>) => {
        if (disabledButton) return;
        event.stopPropagation();
        event.preventDefault();
        endreVarselStatus();
    };

    const keyboardEvent = (event: React.KeyboardEvent<HTMLSpanElement>) => {
        if (disabledButton) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.stopPropagation();
            event.preventDefault();
            endreVarselStatus();
        }
    };

    const endreVarselStatus = () => {
        if (varselstatus === ApiSaksbildeVarselstatus.AKTIV) {
            settVarselstatusVurdert();
        } else if (varselstatus === ApiSaksbildeVarselstatus.VURDERT) {
            settVarselstatusAktiv();
        }
    };

    return (
        <span
            role="button"
            tabIndex={disabledButton ? -1 : 0}
            aria-disabled={disabledButton}
            aria-label="Toggle varselvurdering"
            onClick={clickEvent}
            onKeyDown={keyboardEvent}
            className={cn(styles.avhuking, styles[type])}
        >
            {type === 'feil' ? (
                <XMarkOctagonFillIcon aria-hidden fontSize="1.73rem" />
            ) : (
                <CheckIcon aria-hidden width="24px" height="24px" />
            )}
        </span>
    );
};
