import React, { ReactElement } from 'react';

import { XMarkOctagonFillIcon } from '@navikt/aksel-icons';

import { useHarSkrivetilgang } from '@hooks/brukerrolleHooks';
import { ApiSaksbildeVarselstatus } from '@io/rest/generated/spesialist.schemas';
import { CheckIcon } from '@saksbilde/tidslinje/icons';
import { cn } from '@utils/tw';

import { VarselstatusType } from './Varsler';

interface AvhukingProps {
    type: VarselstatusType;
    varselstatus: ApiSaksbildeVarselstatus;
    settVarselstatusAktiv: () => void;
    settVarselstatusVurdert: () => void;
}

export function Avhuking({
    type,
    varselstatus,
    settVarselstatusAktiv,
    settVarselstatusVurdert,
}: AvhukingProps): ReactElement {
    const harSkrivetilgang = useHarSkrivetilgang();

    if (type === 'feil') {
        return (
            <XMarkOctagonFillIcon
                title="Feil"
                fontSize="1.73rem"
                className="-ms-0.5 bg-[radial-gradient(circle_at_50%_50%,var(--ax-bg-default)_25%,0,transparent)] text-ax-danger-600"
            />
        );
    }

    const erVurdert = varselstatus !== ApiSaksbildeVarselstatus.AKTIV;
    const kanEndreVurdering = varselstatus !== ApiSaksbildeVarselstatus.GODKJENT && harSkrivetilgang;

    const endreVurdering = () => {
        if (varselstatus === ApiSaksbildeVarselstatus.AKTIV) {
            settVarselstatusVurdert();
        } else if (varselstatus === ApiSaksbildeVarselstatus.VURDERT) {
            settVarselstatusAktiv();
        }
    };

    return (
        <button
            type="button"
            disabled={!kanEndreVurdering}
            aria-label="Vurdert"
            aria-pressed={erVurdert}
            onClick={endreVurdering}
            className={cn('flex disabled:cursor-not-allowed', ikonfarge[type])}
        >
            <CheckIcon aria-hidden width="24px" height="24px" />
        </button>
    );
}

const ikonfarge: Record<Exclude<VarselstatusType, 'feil'>, string> = {
    aktiv: 'cursor-pointer [&_circle]:fill-ax-bg-default [&_circle]:stroke-ax-text-accent-subtle hover:[&_circle]:fill-ax-accent-100 [&_path]:fill-ax-text-accent-subtle',
    vurdert:
        'cursor-pointer [&_circle]:fill-ax-border-success [&_circle]:stroke-ax-border-success hover:[&_circle]:fill-ax-success-800 [&_path]:fill-ax-text-neutral-contrast',
    'ferdig-behandlet':
        '[&_circle]:fill-ax-border-success [&_circle]:stroke-ax-border-success [&_path]:fill-ax-bg-default',
};
