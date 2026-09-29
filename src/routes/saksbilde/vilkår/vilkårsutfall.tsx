import React, { PropsWithChildren, ReactElement } from 'react';

import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { Tag } from '@navikt/ds-react';

import { ApiUtfall } from '@io/rest/generated/vilkarsproving.schemas';

export type Vilkårsutfall = 'Oppfylt' | 'IkkeOppfylt' | 'IkkeVurdert';

export function VilkårsutfallIkon({ utfall }: { utfall: Vilkårsutfall }): ReactElement {
    switch (utfall) {
        case 'Oppfylt':
            return (
                <CheckmarkCircleFillIcon title="Oppfylt" className="text-ax-text-success-decoration" fontSize="24" />
            );
        case 'IkkeOppfylt':
            return (
                <XMarkOctagonFillIcon title="Ikke oppfylt" className="text-ax-text-danger-decoration" fontSize="24" />
            );
        case 'IkkeVurdert':
            return (
                <ExclamationmarkTriangleFillIcon
                    title="Ikke vurdert"
                    className="text-ax-text-warning-decoration"
                    fontSize="24"
                />
            );
    }
}

export function VilkårsutfallTag({
    utfall,
    children,
}: PropsWithChildren<{
    utfall: Vilkårsutfall;
}>): ReactElement {
    return (
        <Tag size="xsmall" variant="outline" data-color={tagfarge(utfall)}>
            {children ?? utfallstekst(utfall)}
        </Tag>
    );
}

export function utfallFraOppfylt(oppfylt: boolean | null | undefined): Vilkårsutfall {
    return oppfylt === true ? 'Oppfylt' : oppfylt === false ? 'IkkeOppfylt' : 'IkkeVurdert';
}

export function utfallFraApi(utfall?: ApiUtfall): Vilkårsutfall {
    switch (utfall) {
        case ApiUtfall.OPPFYLT:
            return 'Oppfylt';
        case ApiUtfall.IKKE_OPPFYLT:
            return 'IkkeOppfylt';
        default:
            return 'IkkeVurdert';
    }
}

function utfallstekst(utfall: Vilkårsutfall): string {
    switch (utfall) {
        case 'Oppfylt':
            return 'Oppfylt';
        case 'IkkeOppfylt':
            return 'Ikke oppfylt';
        case 'IkkeVurdert':
            return 'Ikke vurdert';
    }
}

function tagfarge(utfall: Vilkårsutfall): 'neutral' | 'danger' | 'warning' {
    switch (utfall) {
        case 'Oppfylt':
            return 'neutral';
        case 'IkkeOppfylt':
            return 'danger';
        case 'IkkeVurdert':
            return 'warning';
    }
}
