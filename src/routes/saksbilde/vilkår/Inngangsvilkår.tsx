import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import React, { ReactElement, useState } from 'react';

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
import { OppfylteVilkår } from '@saksbilde/vilkår/vilkårsgrupper/OppfylteVilkår';
import { useAktivtInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useNyOpptjeningVisning } from '@state/toggles';
import { getRequiredVilkårsgrunnlag } from '@state/utils';
import { DateString } from '@typer/shared';
import { Vilkårdata } from '@typer/vilkår';
import { getFormattedDateString } from '@utils/date';
import { isSelvstendigNaering } from '@utils/typeguards';

import { MedlemskapVilkår } from './MedlemskapVilkår';
import { SykepengegrunnlagVilkår } from './SykepengegrunnlagVilkår';
import {
    kategoriserteInngangsvilkår,
    medlemskapOppfylt,
    sykepengegrunnlagOppfylt,
} from './kategoriserteInngangsvilkår';
import { ManuellVurderingAvVilkårSkjema } from './opptjening/ManuellVurderingAvVilkårSkjema';
import { Opptjening } from './opptjening/Opptjening';
import { useOpptjeningsvurdering } from './opptjening/useOpptjeningsvurdering';
import { IkkeOppfylteVilkår } from './vilkårsgrupper/IkkeOppfylteVilkår';
import { IkkeVurderteVilkår } from './vilkårsgrupper/IkkeVurderteVilkår';
import { VurdertIInfotrygd } from './vilkårsgrupper/VurdertIInfotrygd';
import { VurdertISpleis } from './vilkårsgrupper/VurdertISpleis';

const harVilkår = (vilkår?: Vilkårdata[]): vilkår is Vilkårdata[] =>
    vilkår !== undefined && vilkår !== null && vilkår.length > 0;

interface OpptjeningParametre {
    personPseudoId: string;
    opptjeningsvurderingId: string;
    readOnly: boolean;
}

interface InngangsvilkårWithContentProps {
    erSelvstendigNæring: boolean;
    periodeFom: DateString;
    vilkårsgrunnlag: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2;
    fødselsdato: DateString;
    vurdering?: Vurdering | null;
    opptjening?: OpptjeningParametre | null;
}

export const InngangsvilkårWithContent = ({
    erSelvstendigNæring,
    periodeFom,
    vilkårsgrunnlag,
    fødselsdato,
    vurdering,
    opptjening,
}: InngangsvilkårWithContentProps) => {
    const alderVedSkjæringstidspunkt = dayjs(vilkårsgrunnlag.skjaeringstidspunkt).diff(fødselsdato, 'year');

    if (opptjening) {
        const vurdertIInfotrygd = vilkårsgrunnlag.__typename === 'VilkarsgrunnlagInfotrygdV2';

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
                    <VilkårMedVurderingspanel
                        opptjening={opptjening}
                        vurdertIInfotrygd={vurdertIInfotrygd}
                        vilkårsgrunnlag={vilkårsgrunnlag}
                        alderVedSkjæringstidspunkt={alderVedSkjæringstidspunkt}
                        vurdering={vurdering}
                    />
                </VStack>
            </Box>
        );
    }

    const { oppfylteVilkår, ikkeVurderteVilkår, ikkeOppfylteVilkår, vilkårVurdertIInfotrygd, vilkårVurdertISpleis } =
        kategoriserteInngangsvilkår(erSelvstendigNæring, vilkårsgrunnlag, alderVedSkjæringstidspunkt, vurdering);

    const harBehandledeVilkår =
        harVilkår(ikkeVurderteVilkår) || harVilkår(ikkeOppfylteVilkår) || harVilkår(oppfylteVilkår);

    const harAlleredeVurderteVilkår = harVilkår(vilkårVurdertISpleis) || harVilkår(vilkårVurdertIInfotrygd);

    return (
        <Box paddingBlock="space-32 space-64" paddingInline="space-24">
            {harBehandledeVilkår && (
                <HStack wrap={false} gap="space-16">
                    {harVilkår(ikkeVurderteVilkår) && <IkkeVurderteVilkår vilkår={ikkeVurderteVilkår} />}
                    {harVilkår(ikkeOppfylteVilkår) && <IkkeOppfylteVilkår vilkår={ikkeOppfylteVilkår} />}
                    {harVilkår(oppfylteVilkår) && <OppfylteVilkår vilkår={oppfylteVilkår} />}
                </HStack>
            )}
            {harAlleredeVurderteVilkår && (
                <VStack className="w-max">
                    {harVilkår(vilkårVurdertISpleis) && vurdering && (
                        <VurdertISpleis
                            vilkår={vilkårVurdertISpleis}
                            ident={vurdering.ident}
                            skjæringstidspunkt={vilkårsgrunnlag.skjaeringstidspunkt}
                            automatiskBehandlet={vurdering.automatisk}
                            erForlengelse={dayjs(periodeFom).isAfter(vilkårsgrunnlag.skjaeringstidspunkt)}
                        />
                    )}
                    {harVilkår(vilkårVurdertIInfotrygd) && <VurdertIInfotrygd vilkår={vilkårVurdertIInfotrygd} />}
                </VStack>
            )}
        </Box>
    );
};

interface InngangsvilkårContainerProps {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
}

const InngangsvilkårContainer = ({ person, periode }: InngangsvilkårContainerProps): ReactElement | null => {
    const inntektsforhold = useAktivtInntektsforhold(person);
    const nyOpptjeningVisning = useNyOpptjeningVisning();
    const readOnly = useIsReadOnlyOppgave(person);
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: apiPerson } = useGetPerson(personPseudoId);
    const vilkårsgrunnlag = getRequiredVilkårsgrunnlag(person, periode.vilkarsgrunnlagId);
    const opptjeningsvurderingId = vilkårsgrunnlag.opptjeningsvurderingId;

    if (!apiPerson) {
        return null;
    }

    return (
        <InngangsvilkårWithContent
            erSelvstendigNæring={isSelvstendigNaering(inntektsforhold)}
            vurdering={periode.utbetaling.vurdering}
            periodeFom={periode.fom}
            vilkårsgrunnlag={vilkårsgrunnlag}
            fødselsdato={apiPerson.fødselsdato}
            opptjening={nyOpptjeningVisning ? { personPseudoId, opptjeningsvurderingId, readOnly } : null}
        />
    );
};

const InngangsvilkårError = (): ReactElement => (
    <Alert variant="error" size="small">
        Noe gikk galt. Kan ikke vise inngangsvilkår for denne perioden.
    </Alert>
);

interface InngangsvilkårProps {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
}

export const Inngangsvilkår = ({ person, periode }: InngangsvilkårProps): ReactElement => (
    <ErrorBoundary fallback={<InngangsvilkårError />}>
        <InngangsvilkårContainer person={person} periode={periode} />
    </ErrorBoundary>
);

interface VilkårMedVurderingspanelProps {
    opptjening: OpptjeningParametre;
    vurdertIInfotrygd: boolean;
    vilkårsgrunnlag: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2;
    alderVedSkjæringstidspunkt: number;
    vurdering?: Vurdering | null;
}

function VilkårMedVurderingspanel({
    opptjening,
    vurdertIInfotrygd,
    vilkårsgrunnlag,
    alderVedSkjæringstidspunkt,
    vurdering,
}: VilkårMedVurderingspanelProps): ReactElement {
    const opptjeningsvurdering = useOpptjeningsvurdering(opptjening.personPseudoId, opptjening.opptjeningsvurderingId);
    const [aktivtVilkår, setAktivtVilkår] = useState<ManueltVurderbarVilkårskode | null>(null);
    const skjæringstidspunkt = opptjeningsvurdering.data?.skjæringstidspunkt;
    const spleisgrunnlag = vilkårsgrunnlag.__typename === 'VilkarsgrunnlagSpleisV2' ? vilkårsgrunnlag : undefined;

    return (
        <HStack wrap={false} gap="space-0" align="start">
            <VStack className="min-w-164 divide-y divide-ax-border-neutral-strong">
                <div>
                    <Opptjening
                        opptjeningsvurdering={opptjeningsvurdering}
                        readOnly={opptjening.readOnly}
                        aktivtVilkår={aktivtVilkår}
                        onVurder={setAktivtVilkår}
                    />
                </div>
                <div className="py-6 first:pt-0 last:pb-0">
                    <SykepengegrunnlagVilkår
                        oppfylt={sykepengegrunnlagOppfylt(vilkårsgrunnlag)}
                        sykepengegrunnlag={spleisgrunnlag?.sykepengegrunnlag}
                        grunnbeløp={spleisgrunnlag?.grunnbelop}
                        alderVedSkjæringstidspunkt={alderVedSkjæringstidspunkt}
                        vurdertIInfotrygd={vurdertIInfotrygd}
                        vurdering={vurdering}
                    />
                </div>
                <div className="py-6 first:pt-0 last:pb-0">
                    <MedlemskapVilkår
                        oppfylt={medlemskapOppfylt(vilkårsgrunnlag)}
                        vurdertIInfotrygd={vurdertIInfotrygd}
                        vurdering={vurdering}
                    />
                </div>
            </VStack>
            {aktivtVilkår !== null && skjæringstidspunkt !== undefined && (
                <>
                    <span className="inline-block self-stretch border-r-[3px] border-ax-border-accent-strong" />
                    <Box
                        className="w-130 min-w-130"
                        background="accent-soft"
                        paddingBlock="space-32 space-64"
                        paddingInline="space-32"
                    >
                        <ManuellVurderingAvVilkårSkjema
                            key={aktivtVilkår}
                            personPseudoId={opptjening.personPseudoId}
                            skjæringstidspunkt={skjæringstidspunkt}
                            vilkårskode={aktivtVilkår}
                            eksisterendeUtfall={opptjeningsvurdering.vurderingFor(aktivtVilkår)?.utfall}
                            onOverstyrt={opptjeningsvurdering.onOverstyrt}
                            onLukk={() => setAktivtVilkår(null)}
                        />
                    </Box>
                </>
            )}
        </HStack>
    );
}
