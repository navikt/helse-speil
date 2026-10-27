import React, { PropsWithChildren, ReactElement } from 'react';

import { Tooltip } from '@navikt/ds-react';

import { ApiInntektskilde } from '@io/rest/generated/spesialist.schemas';
import { Kildetype } from '@saksbilde/historikk/hendelser/dokument/dokument';
import { cn } from '@utils/tw';

interface KildeProps {
    type: KildeikonType;
    className?: string;
}

type KildeikonType = Kildetype | ApiInntektskilde | 'AINNTEKT' | 'VEDTAK' | 'Endringslogg' | undefined;

export function Kilde({ type, children, className }: PropsWithChildren<KildeProps>): ReactElement {
    const { farge, tekstplassering = 'translate-y-px', tooltip, ikon } = kildeinfo(type);
    return (
        <Tooltip content={tooltip}>
            <div
                role="img"
                className={cn(
                    'flex h-4 w-5 cursor-default items-center justify-center rounded-[3px] border border-solid bg-transparent text-[12px] text-ax-text-neutral',
                    farge,
                    className,
                )}
            >
                {ikon ? children : <div className={tekstplassering}>{children}</div>}
            </div>
        </Tooltip>
    );
}

type Kildeinfo = {
    farge?: string;
    tekstplassering?: string;
    tooltip: string;
    ikon?: boolean;
};

const ukjent: Kildeinfo = { tooltip: 'Ukjent' };

const aordningen: Kildeinfo = {
    farge: 'bg-ax-success-200 border-ax-success-600',
    tekstplassering: 'translate-x-[0.5px] translate-y-px',
    tooltip: 'A-ordningen',
};

const inntektsmelding: Kildeinfo = {
    farge: 'bg-ax-meta-lime-100 border-ax-warning-700',
    tooltip: 'Inntektsmelding',
};

const nøytral = 'bg-ax-neutral-200 border-ax-neutral-800 [&_svg]:size-[12px]!';

const kilder: Record<NonNullable<KildeikonType>, Kildeinfo> = {
    AINNTEKT: {
        farge: 'bg-ax-brand-blue-200 border-ax-brand-blue-600',
        tekstplassering: '-translate-x-[0.5px] translate-y-px',
        tooltip: 'A-inntekt',
    },
    VEDTAK: ukjent,
    InntektHentetFraAordningen: aordningen,
    [ApiInntektskilde.AORDNINGEN]: aordningen,
    Sykmelding: { farge: 'bg-ax-accent-200 border-ax-accent-600', tooltip: 'Sykmelding' },
    Soknad: { farge: 'bg-ax-meta-purple-200 border-ax-meta-purple-500', tooltip: 'Søknad' },
    Inntektsmelding: inntektsmelding,
    [ApiInntektskilde.INNTEKTSMELDING]: inntektsmelding,
    Saksbehandler: { farge: nøytral, tooltip: 'Saksbehandler', ikon: true },
    [ApiInntektskilde.SAKSBEHANDLER]: { tooltip: 'Saksbehandler', ikon: true },
    [ApiInntektskilde.SKJONNSMESSIG_FASTSATT]: { farge: nøytral, tooltip: 'Skjønnsmessig fastsatt', ikon: true },
    Endringslogg: { farge: nøytral, tooltip: 'Endringslogg', ikon: true },
    Skatteetaten: { farge: 'bg-ax-success-100 border-ax-success-700', tooltip: 'Skatteetaten' },
    [ApiInntektskilde.IKKE_RAPPORTERT]: { tooltip: 'Ikke rapportert' },
    [ApiInntektskilde.INFOTRYGD]: ukjent,
    Ukjent: ukjent,
};

function kildeinfo(type: KildeikonType): Kildeinfo {
    return (type && kilder[type]) || ukjent;
}
