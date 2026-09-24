import React, { ReactElement, ReactNode } from 'react';

import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Heading, Spacer, Tag, VStack } from '@navikt/ds-react';

export type VilkårsutfallKortUtfall = 'Oppfylt' | 'IkkeOppfylt' | 'IkkeVurdert';

export const utfallForOppfylt = (oppfylt: boolean | null): VilkårsutfallKortUtfall =>
    oppfylt === true ? 'Oppfylt' : oppfylt === false ? 'IkkeOppfylt' : 'IkkeVurdert';

const utfallstekst = (utfall: VilkårsutfallKortUtfall): string => {
    switch (utfall) {
        case 'Oppfylt':
            return 'Oppfylt';
        case 'IkkeOppfylt':
            return 'Ikke oppfylt';
        case 'IkkeVurdert':
            return 'Ikke vurdert';
    }
};

const utfallTagVariant = (utfall: VilkårsutfallKortUtfall): 'success' | 'error' | 'warning' => {
    switch (utfall) {
        case 'Oppfylt':
            return 'success';
        case 'IkkeOppfylt':
            return 'error';
        case 'IkkeVurdert':
            return 'warning';
    }
};

interface VilkårsutfallIkonProps {
    utfall: VilkårsutfallKortUtfall;
}

export const VilkårsutfallIkon = ({ utfall }: VilkårsutfallIkonProps): ReactElement => {
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
};

interface VilkårsutfallKortProps {
    titleId: string;
    tittel: ReactNode;
    paragraf?: ReactNode;
    utfall: VilkårsutfallKortUtfall;
    vurdertTagTekst?: string;
    erAvgjørende?: boolean;
    visVurderVilkårKnapp?: boolean;
    onVurderVilkår?: () => void;
    testId?: string;
    children?: ReactNode;
}

export const VilkårsutfallKort = ({
    titleId,
    tittel,
    paragraf,
    utfall,
    vurdertTagTekst,
    erAvgjørende,
    visVurderVilkårKnapp = false,
    onVurderVilkår,
    testId,
    children,
}: VilkårsutfallKortProps): ReactElement => (
    <VStack gap="space-16" data-testid={testId} className="w-full">
        <HStack gap="space-8" className="gap-3.5" align="center" wrap={false}>
            <span className="flex shrink-0 items-center justify-center">
                <VilkårsutfallIkon utfall={utfall} />
            </span>
            <Heading id={titleId} level="3" size="xsmall">
                {tittel}
            </Heading>
            {paragraf}
            <Spacer />
            {visVurderVilkårKnapp && (
                <button
                    type="button"
                    className="shrink-0 cursor-pointer rounded border-2 border-ax-border-accent bg-transparent px-3 py-1.5 text-sm font-semibold text-ax-text-accent-decoration hover:bg-ax-bg-accent-moderate"
                    onClick={onVurderVilkår}
                >
                    Vurder vilkår
                </button>
            )}
        </HStack>
        <VStack gap="space-8" className="pl-9.5">
            <HStack gap="space-8" align="center">
                <Tag size="xsmall" variant={utfallTagVariant(utfall)}>
                    {vurdertTagTekst ?? utfallstekst(utfall)}
                </Tag>
                {erAvgjørende !== undefined && (
                    <Tag size="xsmall" variant="info">
                        {erAvgjørende ? 'Avgjørende vilkår' : 'Ikke avgjørende vilkår'}
                    </Tag>
                )}
            </HStack>
            {children && <BodyShort as="div">{children}</BodyShort>}
        </VStack>
    </VStack>
);
