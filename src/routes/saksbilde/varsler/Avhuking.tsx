import React, { MouseEvent, ReactElement } from 'react';

import { XMarkOctagonFillIcon } from '@navikt/aksel-icons';

import { useHarSkrivetilgang } from '@hooks/brukerrolleHooks';
import { Varselstatus } from '@io/graphql';
import { CheckIcon } from '@saksbilde/timeline/icons';
import { cn } from '@utils/tw';

import { VarselstatusType } from './Varsler';

import styles from './Avhuking.module.css';

type AvhukingProps = {
    type: VarselstatusType;
    varselstatus: Varselstatus;
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
    const disabledButton = varselstatus === Varselstatus.Godkjent || type === 'feil' || !harSkrivetilgang;

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
        if (varselstatus === Varselstatus.Aktiv) {
            settVarselstatusVurdert();
        } else if (varselstatus === Varselstatus.Vurdert) {
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
            {type === 'feil' ? <XMarkOctagonFillIcon fontSize="1.73rem" /> : <CheckIcon width="24px" height="24px" />}
        </span>
    );
};
