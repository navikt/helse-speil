import React, { ReactElement, ReactNode, useState } from 'react';

import { ParagraphIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, Button, Dialog, HStack, Loader, Tag, Tooltip, VStack } from '@navikt/ds-react';

import {
    ApiKildetype,
    ApiKravkode,
    ApiOpptjeningsvurdering,
    ApiUtfall,
    ApiVilkårsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/vilkarsproving.schemas';
import { useGetVilkårsvurderingerForPersonBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';

import { finnKodeverkvilkår, somParagrafhenvisning } from './vilkårskodeverk';

const finnOpptjeningskrav = (data: ApiVilkårsvurderingerForPersonResponse): ApiOpptjeningsvurdering | undefined =>
    data.krav.find((krav) => krav.kravkode === ApiKravkode.OPPTJENING);

const vurderingerFra = (data?: ApiVilkårsvurderingerForPersonResponse): ApiVilkårsvurdering[] => {
    const krav = data && finnOpptjeningskrav(data);
    return krav && 'vurderinger' in krav ? krav.vurderinger : [];
};

const vurderingstype = (vurdering: ApiVilkårsvurdering): string => {
    switch (vurdering.kilde.kildetype) {
        case ApiKildetype.SAKSBEHANDLER:
            return 'Manuelt vurdert';
        case ApiKildetype.OVERFOERT_FRA_SPLEIS:
            return 'Overført fra Spleis';
        default:
            return 'Automatisk vurdert';
    }
};

interface VurdertVilkårProps {
    vurdering: ApiVilkårsvurdering;
}

const VurdertVilkår = ({ vurdering }: VurdertVilkårProps): ReactElement => {
    const kodeverkvilkår = finnKodeverkvilkår(vurdering.vilkårskode);
    const oppfylt = vurdering.utfall === ApiUtfall.OPPFYLT;

    return (
        <Box
            as="li"
            borderWidth="1"
            borderColor="neutral-subtle"
            borderRadius="8"
            padding="space-16"
            data-testid={`vilkårsvurdering-${vurdering.vilkårskode}`}
        >
            <HStack gap="space-24" align="start" wrap={false}>
                <VStack gap="space-8" className="grow">
                    <BodyShort weight="semibold" className="font-mono">
                        {kodeverkvilkår?.kode ?? vurdering.vilkårskode}
                    </BodyShort>
                    {kodeverkvilkår && <BodyShort size="small">{kodeverkvilkår.beskrivelse}</BodyShort>}
                    <HStack gap="space-8">
                        <Tag size="xsmall" variant={oppfylt ? 'success' : 'error'}>
                            {oppfylt ? 'Oppfylt' : 'Ikke oppfylt'}
                        </Tag>
                        <Tag size="xsmall" variant="neutral">
                            {vurderingstype(vurdering)}
                        </Tag>
                    </HStack>
                </VStack>
                {kodeverkvilkår && (
                    <VStack className="shrink-0">
                        <BodyShort size="small" textColor="subtle">
                            {kodeverkvilkår.vilkårshjemmel.lovverk}
                        </BodyShort>
                        <BodyShort size="small" textColor="subtle">
                            {somParagrafhenvisning(kodeverkvilkår.vilkårshjemmel)}
                        </BodyShort>
                    </VStack>
                )}
            </HStack>
        </Box>
    );
};

interface VilkårsvurderingerInnholdProps {
    personPseudoId: string;
    opptjeningsvurderingId: string;
}

const VilkårsvurderingerInnhold = ({
    personPseudoId,
    opptjeningsvurderingId,
}: VilkårsvurderingerInnholdProps): ReactNode => {
    const { data, isLoading, isError } = useGetVilkårsvurderingerForPersonBehandler(personPseudoId, {
        opptjeningsvurderingId,
    });

    if (isLoading) return <Loader size="small" title="Henter vilkårsvurderinger" />;

    if (isError || !data)
        return (
            <Alert variant="error" size="small">
                Kunne ikke hente vilkårsvurderingene
            </Alert>
        );

    const vurderinger = vurderingerFra(data);

    if (vurderinger.length === 0) return <BodyShort>Ingen vilkår er vurdert</BodyShort>;

    return (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {vurderinger.map((vurdering) => (
                <VurdertVilkår key={vurdering.id} vurdering={vurdering} />
            ))}
        </ul>
    );
};

interface VilkårsvurderingerKnappProps {
    personPseudoId: string;
    opptjeningsvurderingId: string;
}

export const VilkårsvurderingerKnapp = ({
    personPseudoId,
    opptjeningsvurderingId,
}: VilkårsvurderingerKnappProps): ReactElement => {
    const [åpen, setÅpen] = useState(false);

    return (
        <>
            <Tooltip content="Vilkårsvurderinger">
                <Button
                    variant="tertiary-neutral"
                    size="small"
                    icon={<ParagraphIcon aria-hidden />}
                    aria-label="Vilkårsvurderinger"
                    onClick={() => setÅpen(true)}
                />
            </Tooltip>
            <Dialog open={åpen} onOpenChange={setÅpen}>
                <Dialog.Popup width="large">
                    <Dialog.Header>
                        <Dialog.Title>Vilkårsvurderinger</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        {åpen && (
                            <VilkårsvurderingerInnhold
                                personPseudoId={personPseudoId}
                                opptjeningsvurderingId={opptjeningsvurderingId}
                            />
                        )}
                    </Dialog.Body>
                </Dialog.Popup>
            </Dialog>
        </>
    );
};
