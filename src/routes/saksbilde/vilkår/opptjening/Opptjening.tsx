import React, { ReactElement, useState } from 'react';

import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import {
    Alert,
    BodyLong,
    BodyShort,
    Box,
    Button,
    Detail,
    ExpansionCard,
    HStack,
    Loader,
    Spacer,
    VStack,
} from '@navikt/ds-react';

import { manueltVurderbareVilkårskoder } from '@/form-schemas/overstyrVilkårsvurderingSkjema';
import {
    ApiKravkode,
    ApiOpptjeningsvurdering,
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
    ApiVurderingskildeSaksbehandler,
} from '@io/rest/generated/vilkarsproving.schemas';
import { useGetVilkårsvurderingerForPersonBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { getFormattedDatetimeString, somNorskDato } from '@utils/date';

import { OpptjeningVilkårsrad, opptjeningsgrunnlagFor } from './OpptjeningVilkårsrad';

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

interface VurderingIkonProps {
    vurdering: 'IkkeVurdert' | 'VurdertOk' | 'VurdertIkkeOk';
}

const VurderingIkon = ({ vurdering }: VurderingIkonProps): ReactElement => {
    switch (vurdering) {
        case 'IkkeVurdert':
            return <ExclamationmarkTriangleFillIcon className="text-ax-text-warning-decoration" fontSize="24" />;
        case 'VurdertOk':
            return <CheckmarkCircleFillIcon className="text-ax-text-success-decoration" fontSize="24" />;
        case 'VurdertIkkeOk':
            return <XMarkOctagonFillIcon className="text-ax-text-danger-decoration" fontSize="24" />;
    }
};

const headerFarge = (vurdering: 'IkkeVurdert' | 'VurdertOk' | 'VurdertIkkeOk'): string => {
    switch (vurdering) {
        case 'IkkeVurdert':
            return 'bg-ax-bg-warning-soft';
        case 'VurdertOk':
            return 'bg-ax-bg-success-soft';
        case 'VurdertIkkeOk':
            return 'bg-ax-bg-danger-soft';
    }
};

const NØYTRAL_HEADERFARGE = 'bg-ax-bg-neutral-soft';

export const Opptjening = ({ personPseudoId, opptjeningsvurderingId, readOnly }: OpptjeningProps): ReactElement => {
    const [overstyrtOpptjeningsvurderingId, setOverstyrtOpptjeningsvurderingId] = useState<string | null>(null);
    const [forrigeOpptjeningsvurderingId, setForrigeOpptjeningsvurderingId] = useState(opptjeningsvurderingId);
    const [vurderingÅpen, setVurderingÅpen] = useState(false);

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
    const avgjørendeVurdering = vurderinger.find((it) => it.vilkårskode === avgjørendeVilkårskode);

    const vurdering = krav === undefined ? 'IkkeVurdert' : krav.opptjeningOk ? 'VurdertOk' : 'VurdertIkkeOk';

    const detail =
        krav?.kravkilde === 'VURDERT_I_SPEIL'
            ? avgjørendeVurdering?.kilde?.kildetype === 'SAKSBEHANDLER'
                ? `Vurdert av ${(avgjørendeVurdering.kilde as ApiVurderingskildeSaksbehandler).ident} ${getFormattedDatetimeString(avgjørendeVurdering.vurdertTidspunkt)}`
                : 'Vurdert automatisk'
            : 'Vurdert i Infotrygd';

    const opptjeningsgrunnlag = opptjeningsgrunnlagFor(avgjørendeVurdering);

    return (
        <ExpansionCard
            aria-labelledby="opptjening-tittel"
            data-testid="opptjening"
            className="has-[>.aksel-expansioncard__header:hover]:border-ax-border-strong mb-8 w-full border-ax-border-neutral-subtleA shadow-none has-[>.aksel-expansioncard__header:hover]:shadow-[0_0_0_1px_var(--ax-border-strong)]"
            size="small"
        >
            <ExpansionCard.Header
                className={`${isLoading ? NØYTRAL_HEADERFARGE : headerFarge(vurdering)} grid grid-cols-[1fr_auto] items-center after:content-none`}
            >
                <ExpansionCard.Title id="opptjening-tittel" size="medium" as={Box} className="w-full">
                    <HStack wrap={false} align="center" gap="space-4">
                        <HStack align="center" gap="space-6">
                            {isLoading ? (
                                <Loader size="medium" title="Henter opptjeningsvurdering" />
                            ) : (
                                <VurderingIkon vurdering={vurdering} />
                            )}
                            <BodyLong size="medium" weight="semibold">
                                Opptjeningstid
                            </BodyLong>
                        </HStack>
                        <Spacer />
                        {!isLoading && krav && (
                            <Detail size="small" className="text-center">
                                {detail}
                            </Detail>
                        )}
                    </HStack>
                </ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                <VStack gap="space-16">
                    {isLoading ? (
                        <Loader size="small" title="Henter opptjeningsvurdering" />
                    ) : isError || !data ? (
                        <Alert variant="error" size="small">
                            Kunne ikke hente opptjeningsvurderingen
                        </Alert>
                    ) : (
                        <>
                            {opptjeningsgrunnlag && (
                                <BodyShort>
                                    {`Opptjening fra ${somNorskDato(opptjeningsgrunnlag.fom) ?? 'ukjent'} (${opptjeningsgrunnlag.opptjeningsdager} dager)`}
                                </BodyShort>
                            )}
                            {readOnly ? (
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
                            ) : vurderingÅpen ? (
                                <Box
                                    background="neutral-moderate"
                                    borderColor="accent-strong"
                                    borderWidth="0 0 0 4"
                                    borderRadius="0 8 8 0"
                                    padding="space-16"
                                >
                                    <VStack gap="space-12">
                                        <Button
                                            type="button"
                                            variant="tertiary"
                                            size="small"
                                            className="self-start"
                                            onClick={() => setVurderingÅpen(false)}
                                        >
                                            Avbryt
                                        </Button>
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
                                    </VStack>
                                </Box>
                            ) : (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="small"
                                    className="self-start"
                                    onClick={() => setVurderingÅpen(true)}
                                >
                                    Vurder vilkår
                                </Button>
                            )}
                        </>
                    )}
                </VStack>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};
