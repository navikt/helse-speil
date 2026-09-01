import React, { ReactElement, useState } from 'react';

import { Alert, BodyShort, Box, HStack, Heading, Loader, VStack } from '@navikt/ds-react';

import { manueltVurderbareVilkårskoder } from '@/form-schemas/overstyrVilkårsvurderingSkjema';
import { LovdataLenke } from '@components/LovdataLenke';
import {
    ApiKravkode,
    ApiOpptjeningsvurdering,
    ApiUtfall,
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/vilkarsproving.schemas';
import { useGetVilkårsvurderingerForPersonBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';

import { OpptjeningVilkårsrad, Utfallsikon } from './OpptjeningVilkårsrad';

const finnOpptjeningskrav = (data: ApiVilkårsvurderingerForPersonResponse): ApiOpptjeningsvurdering | undefined =>
    data.krav.find((krav) => krav.kravkode === ApiKravkode.OPPTJENING);

const vurderingerFor = (krav?: ApiOpptjeningsvurdering): ApiVilkårsvurdering[] =>
    krav && 'vurderinger' in krav ? krav.vurderinger : [];

const avgjørendeVilkårskodeFor = (krav?: ApiOpptjeningsvurdering): ApiVilkårskode | undefined =>
    krav && 'avgjørendeVilkårskode' in krav ? krav.avgjørendeVilkårskode : undefined;

interface OpptjeningProps {
    personPseudoId: string;
    opptjeningsvurderingId: string;
    readOnly: boolean;
}

export const Opptjening = ({ personPseudoId, opptjeningsvurderingId, readOnly }: OpptjeningProps): ReactElement => {
    const [overstyrtOpptjeningsvurderingId, setOverstyrtOpptjeningsvurderingId] = useState<string | null>(null);
    const [forrigeOpptjeningsvurderingId, setForrigeOpptjeningsvurderingId] = useState(opptjeningsvurderingId);

    if (forrigeOpptjeningsvurderingId !== opptjeningsvurderingId) {
        setForrigeOpptjeningsvurderingId(opptjeningsvurderingId);
        setOverstyrtOpptjeningsvurderingId(null);
    }

    const aktivOpptjeningsvurderingId = overstyrtOpptjeningsvurderingId ?? opptjeningsvurderingId;

    const { data, isLoading, isError } = useGetVilkårsvurderingerForPersonBehandler(personPseudoId, {
        opptjeningsvurderingId: aktivOpptjeningsvurderingId,
    });

    const krav = data && finnOpptjeningskrav(data);
    const vurderinger = vurderingerFor(krav);
    const avgjørendeVilkårskode = avgjørendeVilkårskodeFor(krav);

    return (
        <Box
            as="section"
            aria-labelledby="opptjening-tittel"
            data-testid="opptjening"
            className="mb-8 max-w-200"
            borderWidth="1"
            borderColor="neutral-subtle"
            borderRadius="8"
            padding="space-24"
        >
            <VStack gap="space-16">
                <HStack gap="space-8" align="center">
                    <Heading id="opptjening-tittel" size="small" level="2">
                        Opptjening
                    </Heading>
                    <LovdataLenke paragraf="8-2">§ 8-2</LovdataLenke>
                </HStack>
                {isLoading ? (
                    <Loader size="small" title="Henter opptjeningsvurdering" />
                ) : isError || !data ? (
                    <Alert variant="error" size="small">
                        Kunne ikke hente opptjeningsvurderingen
                    </Alert>
                ) : (
                    <>
                        <HStack gap="space-8" align="center">
                            <span className="flex w-6 items-center justify-center">
                                <Utfallsikon
                                    utfall={
                                        krav === undefined
                                            ? undefined
                                            : krav.rettTilSykepenger
                                              ? ApiUtfall.OPPFYLT
                                              : ApiUtfall.IKKE_OPPFYLT
                                    }
                                />
                            </span>
                            <BodyShort weight="semibold">
                                {krav === undefined
                                    ? 'Opptjening er ikke vurdert'
                                    : krav.rettTilSykepenger
                                      ? 'Kravet til opptjening er oppfylt'
                                      : 'Kravet til opptjening er ikke oppfylt'}
                            </BodyShort>
                        </HStack>
                        <ul className="m-0 flex list-none flex-col gap-4 p-0">
                            {manueltVurderbareVilkårskoder.map((vilkårskode) => (
                                <OpptjeningVilkårsrad
                                    key={vilkårskode}
                                    personPseudoId={personPseudoId}
                                    skjæringstidspunkt={data.skjæringstidspunkt}
                                    vilkårskode={vilkårskode}
                                    vurdering={vurderinger.find((it) => it.vilkårskode === vilkårskode)}
                                    erAvgjørende={avgjørendeVilkårskode === vilkårskode}
                                    readOnly={readOnly}
                                    onOverstyrt={setOverstyrtOpptjeningsvurderingId}
                                />
                            ))}
                        </ul>
                    </>
                )}
            </VStack>
        </Box>
    );
};
