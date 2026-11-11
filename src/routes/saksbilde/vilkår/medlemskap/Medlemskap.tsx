import { ReactElement, ReactNode, useId } from 'react';

import { BodyShort, Button, HStack, Heading, List, Loader, Skeleton, VStack } from '@navikt/ds-react';

import { ErrorMessageWithRefetch } from '@components/ErrorMessageWithRefetch';
import { useErCoachFagkoordinatorEllerSupersaksbehandler } from '@hooks/brukerrolleHooks';
import {
    ApiKildetype,
    ApiMedlemskapsvurdering,
    ApiVurderingskildeAutomatisk,
    ApiVurderingskildeSaksbehandler,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { VilkårsutfallIkon, VilkårsutfallTag, VurdertAvSaksbehandler } from '@saksbilde/vilkår/vilkårsutfall';
import { useKanOverstyreMedlemskap } from '@state/toggles';
import { getFormattedDatetimeString } from '@utils/date';
import { cn } from '@utils/tw';

import { EndringsloggMedlemskapButton } from './EndringsloggMedlemskapButton';
import { Medlemskapsendring } from './useMedlemskapshistorikk';
import { Medlemskapsvurdering, utfallFraStatus } from './useMedlemskapsvurdering';

interface MedlemskapProps {
    medlemskapsvurdering: Medlemskapsvurdering;
    endringer: Medlemskapsendring[];
    readOnly: boolean;
    serPåTidligereBehandling: boolean;
    vurderer: boolean;
    onVurder: () => void;
}

export function Medlemskap({
    medlemskapsvurdering,
    endringer,
    readOnly,
    serPåTidligereBehandling,
    vurderer,
    onVurder,
}: MedlemskapProps): ReactElement {
    const { vurdering, isLoading, isError, utfall, erOverførtFraInfotrygd } = medlemskapsvurdering;
    const tittelId = useId();
    const erCoachFagkoordinatorEllerSupersaksbehandler = useErCoachFagkoordinatorEllerSupersaksbehandler();
    const kanOverstyreMedlemskap = useKanOverstyreMedlemskap();
    const kanVurdere =
        kanOverstyreMedlemskap &&
        !readOnly &&
        !serPåTidligereBehandling &&
        erCoachFagkoordinatorEllerSupersaksbehandler &&
        vurdering !== undefined &&
        !erOverførtFraInfotrygd;

    return (
        <VStack
            as="section"
            aria-labelledby={tittelId}
            gap="space-16"
            className={cn('-mr-[3px] -ml-1 px-1 pt-6 pb-6', {
                // Dekker den blå kanten til vurderingspanelet, så seksjonen og skjemaet henger sammen
                'relative z-10 bg-ax-bg-accent-soft': vurderer,
            })}
        >
            <HStack align="center" gap="space-12">
                {isLoading ? (
                    <Loader size="medium" title="Henter medlemskapsvurdering" />
                ) : (
                    <span className="flex shrink-0 items-center justify-center">
                        <VilkårsutfallIkon utfall={utfall} />
                    </span>
                )}
                <Heading id={tittelId} level="3" size="xsmall">
                    Lovvalg og medlemskap
                </Heading>
                <EndringsloggMedlemskapButton endringer={endringer} />
                {kanVurdere && (
                    <Button type="button" variant="secondary" size="small" onClick={onVurder} className="ml-auto">
                        Vurder vilkår
                    </Button>
                )}
            </HStack>
            <VStack gap="space-8" className="pl-9">
                {isLoading ? (
                    <Skeleton variant="rounded" height={56} />
                ) : isError || !vurdering ? (
                    <ErrorMessageWithRefetch
                        className="rounded-xl"
                        errorMessage="Kunne ikke hente medlemskapsvurderingen."
                        refetch={medlemskapsvurdering.refetch}
                    />
                ) : (
                    <Medlemskapsdetaljer vurdering={vurdering} />
                )}
            </VStack>
        </VStack>
    );
}

export function Medlemskapsdetaljer({ vurdering }: { vurdering: ApiMedlemskapsvurdering }): ReactElement {
    const { kilde } = vurdering;
    const utfall = utfallFraStatus(vurdering.status);
    const vurdert = vurdertTekst(vurdering);
    return (
        <>
            <HStack gap="space-8">
                <VilkårsutfallTag utfall={utfall} />
                {vurdert && vurdert !== '' && <VilkårsutfallTag utfall={utfall}>{vurdert}</VilkårsutfallTag>}
            </HStack>
            {kilde.kildetype === ApiKildetype.AUTOMATISK && (
                <Årsaker årsaker={(kilde as ApiVurderingskildeAutomatisk).årsaker} />
            )}
            {kilde.kildetype === ApiKildetype.SAKSBEHANDLER && (
                <BodyShort size="small" className="whitespace-pre-wrap">
                    {(kilde as ApiVurderingskildeSaksbehandler).fritekstbegrunnelse}
                </BodyShort>
            )}
        </>
    );
}

function Årsaker({ årsaker }: { årsaker: ApiVurderingskildeAutomatisk['årsaker'] }): ReactElement | null {
    if (årsaker.length === 0) return null;
    return (
        <VStack gap="space-4">
            <BodyShort size="small" weight="semibold">
                Årsaker til uavklart svar
            </BodyShort>
            <List size="small">
                {årsaker.map((årsak) => (
                    <List.Item key={årsak.regelId}>
                        {årsak.forklaringPaaUavklart} ({årsak.regelId})
                    </List.Item>
                ))}
            </List>
        </VStack>
    );
}

function vurdertTekst({ kilde, vurdertTidspunkt }: ApiMedlemskapsvurdering): ReactNode {
    const tidspunkt = getFormattedDatetimeString(vurdertTidspunkt);
    switch (kilde.kildetype) {
        case ApiKildetype.AUTOMATISK:
            return `Vurdert automatisk ${tidspunkt}`;
        case ApiKildetype.SAKSBEHANDLER:
            return (
                <VurdertAvSaksbehandler
                    tidspunkt={tidspunkt}
                    ident={(kilde as ApiVurderingskildeSaksbehandler).ident}
                />
            );
        case ApiKildetype.OVERFOERT_FRA_SPLEIS:
            return '';
        case ApiKildetype.OVERFOERT_FRA_INFOTRYGD:
            return 'Vurdert i Infotrygd';
    }
}
