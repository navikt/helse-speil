import React, { PropsWithChildren, ReactElement, ReactNode, useId } from 'react';

import { CheckmarkCircleIcon, ExclamationmarkTriangleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Spacer, VStack } from '@navikt/ds-react';

import { likestiltYtelseLabels } from '@form-schemas/likestiltYtelseSkjema';
import {
    ApiVilkårsvurdering,
    ApiVurderingskilde,
    ApiVurderingskildeSaksbehandler,
} from '@io/rest/generated/vilkarsproving.schemas';
import {
    AvgjørendeVilkårTag,
    Vilkårsutfall,
    VilkårsutfallTag,
    VurdertAvSaksbehandler,
} from '@saksbilde/vilkår/vilkårsutfall';
import { getFormattedDatetimeString } from '@utils/date';
import { cn } from '@utils/tw';

interface VilkårsradProps {
    navn: string;
    utfall: Vilkårsutfall;
    vurdering?: ApiVilkårsvurdering;
    erAvgjørende?: boolean;
    erAktiv?: boolean;
    onVurder?: () => void;
}

export function Vilkårsrad({
    navn,
    utfall,
    vurdering,
    erAvgjørende = false,
    erAktiv = false,
    onVurder,
    children,
}: PropsWithChildren<VilkårsradProps>): ReactElement {
    const navnId = useId();

    return (
        <VStack
            as="li"
            gap="space-8"
            paddingBlock="space-16"
            paddingInline="space-16 space-32"
            aria-labelledby={navnId}
            className={cn('z-10 -mr-[3px] border-b-ax-border-neutral-subtle not-last:border-b', {
                'bg-ax-bg-accent-soft': erAktiv,
            })}
        >
            <HStack gap="space-8" align="center" wrap={false}>
                <span className="flex w-6 shrink-0 items-center justify-center">
                    <Utfallsikon utfall={utfall} />
                </span>
                <BodyShort id={navnId} weight="semibold">
                    {navn}
                </BodyShort>
                <Spacer />
                {onVurder && (
                    <Button type="button" variant="secondary" size="small" onClick={onVurder}>
                        Vurder vilkår
                    </Button>
                )}
            </HStack>
            <HStack gap="space-8" align="center">
                <VilkårsutfallTag utfall={utfall}>{vurdertTekst(vurdering)}</VilkårsutfallTag>
                {erAvgjørende && <AvgjørendeVilkårTag />}
            </HStack>
            {children}
        </VStack>
    );
}

export function Detaljrad({ label, children }: PropsWithChildren<{ label: string }>): ReactElement {
    return (
        <>
            <BodyShort as="dt" size="small" textColor="subtle">
                {label}
            </BodyShort>
            <BodyShort as="dd" size="small" className="wrap-anywhere">
                {children}
            </BodyShort>
        </>
    );
}

export function Saksbehandlerdetaljer({
    kilde,
    children,
}: PropsWithChildren<{ kilde: ApiVurderingskildeSaksbehandler }>): ReactElement {
    return (
        <dl className="m-0 grid w-fit grid-cols-[auto_auto] gap-x-6 gap-y-1">
            {kilde.ytelser.length > 0 && (
                <Detaljrad label="Likestilte ytelser">
                    {kilde.ytelser.map((ytelse) => likestiltYtelseLabels[ytelse]).join(', ')}
                </Detaljrad>
            )}
            {children}
            <Detaljrad label="Begrunnelse">{kilde.fritekstbegrunnelse}</Detaljrad>
            {kilde.journalpostId.length > 0 && (
                <Detaljrad label="Journalpost-ID">{kilde.journalpostId.join(', ')}</Detaljrad>
            )}
        </dl>
    );
}

export function erSaksbehandlerkilde(kilde: ApiVurderingskilde): kilde is ApiVurderingskildeSaksbehandler {
    return 'ident' in kilde;
}

function Utfallsikon({ utfall }: { utfall: Vilkårsutfall }): ReactElement {
    switch (utfall) {
        case 'Oppfylt':
            return <CheckmarkCircleIcon title="Oppfylt" className="text-ax-text-neutral" fontSize="24" />;
        case 'IkkeOppfylt':
            return <XMarkOctagonIcon title="Ikke oppfylt" className="text-ax-text-neutral" fontSize="24" />;
        case 'IkkeVurdert':
            return <ExclamationmarkTriangleIcon title="Ikke vurdert" className="text-ax-text-neutral" fontSize="24" />;
    }
}

function vurdertTekst(vurdering?: ApiVilkårsvurdering): ReactNode | undefined {
    if (!vurdering?.vurdertTidspunkt) {
        return undefined;
    }

    const tidspunkt = getFormattedDatetimeString(vurdering.vurdertTidspunkt);

    return erSaksbehandlerkilde(vurdering.kilde) ? (
        <VurdertAvSaksbehandler tidspunkt={tidspunkt} ident={vurdering.kilde.ident} />
    ) : (
        `Vurdert automatisk ${tidspunkt}`
    );
}
