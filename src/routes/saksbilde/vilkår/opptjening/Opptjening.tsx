import React, { ReactElement, useState } from 'react';

import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { Alert, Heading, Loader, VStack } from '@navikt/ds-react';

import { manueltVurderbareVilkårskoder } from '@form-schemas/manuellVurderingAvVilkårSkjema';
import {
    ApiKravkode,
    ApiOpptjeningsvurdering,
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/vilkarsproving.schemas';
import { useGetVilkårsvurderingerForPersonBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';

import { OpptjeningVilkårsrad } from './OpptjeningVilkårsrad';

const finnOpptjeningskrav = (data: ApiVilkårsvurderingerForPersonResponse): ApiOpptjeningsvurdering | undefined =>
    data.krav.find((krav) => krav.kravkode === ApiKravkode.OPPTJENING);

const vurderingerFor = (krav?: ApiOpptjeningsvurdering): ApiVilkårsvurdering[] =>
    krav && 'vurderinger' in krav ? krav.vurderinger : [];

const avgjørendeVilkårskodeFor = (krav?: ApiOpptjeningsvurdering): ApiVilkårskode | undefined =>
    krav && 'avgjørendeVilkårskode' in krav ? (krav.avgjørendeVilkårskode ?? undefined) : undefined;

interface OpptjeningProps {
    personPseudoId: string;
    opptjeningsvurderingId: string;
    readOnly: boolean;
}

interface OpptjeningsgruppeIkonProps {
    vurdering: 'IkkeVurdert' | 'VurdertOk' | 'VurdertIkkeOk';
}

const OpptjeningsgruppeIkon = ({ vurdering }: OpptjeningsgruppeIkonProps): ReactElement => {
    switch (vurdering) {
        case 'IkkeVurdert':
            return (
                <ExclamationmarkTriangleFillIcon
                    title="Ikke vurdert"
                    className="text-ax-text-warning-decoration"
                    fontSize="24"
                />
            );
        case 'VurdertOk':
            return (
                <CheckmarkCircleFillIcon title="Oppfylt" className="text-ax-text-success-decoration" fontSize="24" />
            );
        case 'VurdertIkkeOk':
            return (
                <XMarkOctagonFillIcon title="Ikke oppfylt" className="text-ax-text-danger-decoration" fontSize="24" />
            );
    }
};

export const Opptjening = ({ personPseudoId, opptjeningsvurderingId, readOnly }: OpptjeningProps): ReactElement => {
    const [overstyrtOpptjeningsvurderingId, setOverstyrtOpptjeningsvurderingId] = useState<string | null>(null);

    const aktivOpptjeningsvurderingId = overstyrtOpptjeningsvurderingId ?? opptjeningsvurderingId;

    const { data, isLoading, isError } = useGetVilkårsvurderingerForPersonBehandler(personPseudoId, {
        opptjeningsvurderingId: aktivOpptjeningsvurderingId,
    });

    const krav = data && finnOpptjeningskrav(data);
    const vurderinger = vurderingerFor(krav);
    const avgjørendeVilkårskode = avgjørendeVilkårskodeFor(krav);

    const vurdering = krav === undefined ? 'IkkeVurdert' : krav.opptjeningOk ? 'VurdertOk' : 'VurdertIkkeOk';

    return (
        <VStack gap="space-16" data-testid="opptjening" className="w-full">
            <div className="flex items-center gap-3.5">
                {isLoading ? (
                    <Loader size="medium" title="Henter opptjeningsvurdering" />
                ) : (
                    <span className="flex shrink-0 items-center justify-center">
                        <OpptjeningsgruppeIkon vurdering={vurdering} />
                    </span>
                )}
                <Heading level="3" size="xsmall">
                    Opptjeningstid
                </Heading>
            </div>
            <div className="w-full border-t border-ax-border-neutral-subtle">
                <VStack gap="space-0">
                    {isLoading ? (
                        <Loader size="small" title="Henter opptjeningsvurdering" />
                    ) : isError || !data ? (
                        <Alert variant="error" size="small">
                            Kunne ikke hente opptjeningsvurderingen
                        </Alert>
                    ) : (
                        <div className="bg-ax-bg-info-soft px-4 py-4">
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
                        </div>
                    )}
                </VStack>
            </div>
        </VStack>
    );
};
