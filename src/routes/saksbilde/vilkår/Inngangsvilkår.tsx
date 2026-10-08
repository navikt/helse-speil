import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import React, { PropsWithChildren, ReactElement, useState } from 'react';

import { Alert, BodyShort, Box, HStack, Heading, VStack } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { ManueltVurderbarVilkårskode } from '@form-schemas/manuellVurderingAvVilkårSkjema';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import {
    BeregnetPeriodeFragment,
    PersonFragment,
    VilkarsgrunnlagInfotrygdV2,
    VilkarsgrunnlagSpleisV2,
    Vurdering,
} from '@io/graphql';
import { useGetPerson } from '@io/rest/generated/personer/personer';
import { getRequiredVilkårsgrunnlag } from '@state/utils';
import { DateString } from '@typer/shared';
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date';

import { MedlemskapVilkår } from './MedlemskapVilkår';
import { SykepengegrunnlagVilkår } from './SykepengegrunnlagVilkår';
import { VilkårsutfallKort } from './VilkårsutfallKort';
import { ManuellVurderingAvVilkårSkjema } from './opptjening/ManuellVurderingAvVilkårSkjema';
import { Opptjening } from './opptjening/Opptjening';
import { useOpptjeningshistorikk } from './opptjening/useOpptjeningshistorikk';
import { useOpptjeningsvurdering } from './opptjening/useOpptjeningsvurdering';

interface InngangsvilkårProps {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
}

export function Inngangsvilkår({ person, periode }: InngangsvilkårProps): ReactElement {
    return (
        <ErrorBoundary fallback={<InngangsvilkårError />}>
            <InngangsvilkårContainer person={person} periode={periode} />
        </ErrorBoundary>
    );
}

interface InngangsvilkårWithContentProps {
    vilkårsgrunnlag: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2;
    fødselsdato: DateString;
    vurdering?: Vurdering | null;
    personPseudoId: string;
    opptjeningsvurderingId: string;
    readOnly: boolean;
}

export function InngangsvilkårWithContent({
    vilkårsgrunnlag,
    fødselsdato,
    vurdering,
    personPseudoId,
    opptjeningsvurderingId,
    readOnly,
}: InngangsvilkårWithContentProps): ReactElement {
    const opptjeningsvurdering = useOpptjeningsvurdering(personPseudoId, opptjeningsvurderingId);
    const opptjeningsendringer = useOpptjeningshistorikk(
        personPseudoId,
        vilkårsgrunnlag.skjaeringstidspunkt,
        opptjeningsvurdering.data !== undefined && !opptjeningsvurdering.isFetching && !opptjeningsvurdering.isError,
    );
    const [aktivtVilkår, setAktivtVilkår] = useState<ManueltVurderbarVilkårskode | null>(null);
    const skjæringstidspunkt = opptjeningsvurdering.data?.skjæringstidspunkt;
    const alderVedSkjæringstidspunkt = dayjs(vilkårsgrunnlag.skjaeringstidspunkt).diff(fødselsdato, 'year');
    const vurdertTekst = vurdertTekstFor(vilkårsgrunnlag, vurdering);

    return (
        <Box paddingBlock="space-32 space-64" paddingInline="space-24">
            <VStack gap="space-16">
                <VStack gap="space-4">
                    <BodyShort spacing>
                        {`Inngangsvilkår ved skjæringstidspunktet ${getFormattedDateString(vilkårsgrunnlag.skjaeringstidspunkt)}`}
                    </BodyShort>
                    <Heading level="2" size="medium">
                        Inngangsvilkår
                    </Heading>
                </VStack>
                <HStack wrap={false} gap="space-0" align="start">
                    <VStack className="min-w-164 divide-y divide-ax-border-neutral-strong">
                        {opptjeningsvurdering.erOverførtFraInfotrygd ? (
                            <VilkårsutfallKort
                                tittel="Opptjeningstid"
                                utfall={opptjeningsvurdering.utfall}
                                vurdertTekst="Vurdert i Infotrygd"
                            />
                        ) : (
                            <Opptjening
                                opptjeningsvurdering={opptjeningsvurdering}
                                endringer={opptjeningsendringer}
                                readOnly={readOnly}
                                aktivtVilkår={aktivtVilkår}
                                onVurder={setAktivtVilkår}
                            />
                        )}
                        <SykepengegrunnlagVilkår
                            vilkårsgrunnlag={vilkårsgrunnlag}
                            alderVedSkjæringstidspunkt={alderVedSkjæringstidspunkt}
                            vurdertTekst={vurdertTekst}
                        />
                        <MedlemskapVilkår vilkårsgrunnlag={vilkårsgrunnlag} vurdertTekst={vurdertTekst} />
                    </VStack>
                    {aktivtVilkår !== null && skjæringstidspunkt !== undefined && (
                        <Vurderingspanel>
                            <ManuellVurderingAvVilkårSkjema
                                key={aktivtVilkår}
                                personPseudoId={personPseudoId}
                                skjæringstidspunkt={skjæringstidspunkt}
                                vilkårskode={aktivtVilkår}
                                eksisterendeUtfall={opptjeningsvurdering.vurderingFor(aktivtVilkår)?.utfall}
                                onOverstyrt={opptjeningsvurdering.onOverstyrt}
                                onLukk={() => setAktivtVilkår(null)}
                            />
                        </Vurderingspanel>
                    )}
                </HStack>
            </VStack>
        </Box>
    );
}

interface InngangsvilkårContainerProps {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
}

function InngangsvilkårContainer({ person, periode }: InngangsvilkårContainerProps): ReactElement | null {
    const readOnly = useIsReadOnlyOppgave(person);
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: apiPerson } = useGetPerson(personPseudoId);
    const vilkårsgrunnlag = getRequiredVilkårsgrunnlag(person, periode.vilkarsgrunnlagId);

    if (!apiPerson) {
        return null;
    }

    return (
        <InngangsvilkårWithContent
            vilkårsgrunnlag={vilkårsgrunnlag}
            fødselsdato={apiPerson.fødselsdato}
            vurdering={periode.utbetaling.vurdering}
            personPseudoId={personPseudoId}
            opptjeningsvurderingId={vilkårsgrunnlag.opptjeningsvurderingId}
            readOnly={readOnly}
        />
    );
}

function InngangsvilkårError(): ReactElement {
    return (
        <Alert variant="error" size="small">
            Noe gikk galt. Kan ikke vise inngangsvilkår for denne perioden.
        </Alert>
    );
}

function Vurderingspanel({ children }: PropsWithChildren): ReactElement {
    return (
        <>
            <span className="inline-block self-stretch border-r-[3px] border-ax-border-accent-strong" />
            <Box
                className="w-130 min-w-130 self-stretch"
                background="accent-soft"
                paddingBlock="space-32 space-64"
                paddingInline="space-32"
            >
                {children}
            </Box>
        </>
    );
}

function vurdertTekstFor(
    vilkårsgrunnlag: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2,
    vurdering?: Vurdering | null,
): string | undefined {
    if (vilkårsgrunnlag.__typename === 'VilkarsgrunnlagInfotrygdV2') {
        return 'Vurdert i Infotrygd';
    }
    if (!vurdering) {
        return undefined;
    }

    const tidspunkt = getFormattedDatetimeString(vurdering.tidsstempel);

    return vurdering.automatisk ? `Vurdert automatisk ${tidspunkt}` : `Vurdert ${tidspunkt} – ${vurdering.ident}`;
}
