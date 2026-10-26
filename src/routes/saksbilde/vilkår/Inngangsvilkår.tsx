import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import React, { PropsWithChildren, ReactElement, ReactNode, useEffect, useState } from 'react';

import { Events } from '@navikt/analytics-types';
import { Alert, BodyShort, Box, HStack, Heading, VStack } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { useGetPerson } from '@io/rest/generated/personer/personer';
import {
    ApiBeregnetPeriode,
    ApiSaksbildePerson,
    ApiVilkårsgrunnlagInfotrygdV2,
    ApiVilkårsgrunnlagSpleisV2,
    ApiVurdering,
} from '@io/rest/generated/spesialist.schemas';
import { sporHendelse } from '@observability/hendelser';
import { useSerPåTidligereBehandling } from '@state/inntektsforhold/inntektsforhold';
import { getRequiredVilkårsgrunnlag } from '@state/utils';
import { DateString } from '@typer/shared';
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date';

import { MedlemskapVilkår } from './MedlemskapVilkår';
import { SykepengegrunnlagVilkår } from './SykepengegrunnlagVilkår';
import { VilkårsutfallKort } from './VilkårsutfallKort';
import { Opptjening } from './opptjening/Opptjening';
import { OpptjeningsvurderingSkjema } from './opptjening/OpptjeningsvurderingSkjema';
import { useOpptjeningshistorikk } from './opptjening/useOpptjeningshistorikk';
import { useOpptjeningsvurdering } from './opptjening/useOpptjeningsvurdering';
import { VurdertAvSaksbehandler } from './vilkårsutfall';

interface InngangsvilkårProps {
    person: ApiSaksbildePerson;
    periode: ApiBeregnetPeriode;
}

export function Inngangsvilkår({ person, periode }: InngangsvilkårProps): ReactElement {
    return (
        <ErrorBoundary fallback={<InngangsvilkårError />}>
            <InngangsvilkårContainer person={person} periode={periode} />
        </ErrorBoundary>
    );
}

interface InngangsvilkårWithContentProps {
    vilkårsgrunnlag: ApiVilkårsgrunnlagSpleisV2 | ApiVilkårsgrunnlagInfotrygdV2;
    fødselsdato: DateString;
    vurdering?: ApiVurdering | null;
    personPseudoId: string;
    opptjeningsvurderingId: string;
    readOnly: boolean;
    serPåTidligereBehandling: boolean;
}

export function InngangsvilkårWithContent({
    vilkårsgrunnlag,
    fødselsdato,
    vurdering,
    personPseudoId,
    opptjeningsvurderingId,
    readOnly,
    serPåTidligereBehandling,
}: InngangsvilkårWithContentProps): ReactElement {
    const opptjeningsvurdering = useOpptjeningsvurdering(personPseudoId, opptjeningsvurderingId);
    const opptjeningsendringer = useOpptjeningshistorikk(
        personPseudoId,
        vilkårsgrunnlag.skjaeringstidspunkt,
        opptjeningsvurdering.data !== undefined && !opptjeningsvurdering.isFetching && !opptjeningsvurdering.isError,
    );
    const [vurdererOpptjening, setVurdererOpptjening] = useState(false);
    const skjæringstidspunkt = opptjeningsvurdering.data?.skjæringstidspunkt;
    const alderVedSkjæringstidspunkt = dayjs(vilkårsgrunnlag.skjaeringstidspunkt).diff(fødselsdato, 'year');
    const vurdertTekst = vurdertTekstFor(vilkårsgrunnlag, vurdering);
    const { utfall, erOverførtFraInfotrygd } = opptjeningsvurdering;
    const opptjeningErLastet = opptjeningsvurdering.data !== undefined;

    useEffect(() => {
        if (!opptjeningErLastet) return;
        sporHendelse({
            name: 'opptjening vist',
            properties: { utfall, erOverførtFraInfotrygd },
        });
    }, [opptjeningErLastet, utfall, erOverførtFraInfotrygd]);

    function vurder() {
        sporHendelse({ name: Events.SKJEMA_APNET, properties: { skjemanavn: 'opptjening' } });
        setVurdererOpptjening(true);
    }

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
                    <VStack className="w-164 shrink-0 divide-y divide-ax-border-neutral-strong">
                        {opptjeningsvurdering.erOverførtFraInfotrygd ? (
                            <VilkårsutfallKort
                                tittel="Opptjeningstid"
                                utfall={opptjeningsvurdering.utfall}
                                vurdertTekst="Vurdert i Infotrygd"
                            />
                        ) : (
                            <Opptjening
                                personPseudoId={personPseudoId}
                                opptjeningsvurdering={opptjeningsvurdering}
                                endringer={opptjeningsendringer}
                                readOnly={readOnly}
                                serPåTidligereBehandling={serPåTidligereBehandling}
                                vurderer={vurdererOpptjening}
                                onVurder={vurder}
                            />
                        )}
                        <SykepengegrunnlagVilkår
                            vilkårsgrunnlag={vilkårsgrunnlag}
                            alderVedSkjæringstidspunkt={alderVedSkjæringstidspunkt}
                            vurdertTekst={vurdertTekst}
                        />
                        <MedlemskapVilkår vilkårsgrunnlag={vilkårsgrunnlag} vurdertTekst={vurdertTekst} />
                    </VStack>
                    {!serPåTidligereBehandling && vurdererOpptjening && skjæringstidspunkt !== undefined && (
                        <Vurderingspanel>
                            <OpptjeningsvurderingSkjema
                                personPseudoId={personPseudoId}
                                skjæringstidspunkt={skjæringstidspunkt}
                                onOverstyrt={opptjeningsvurdering.onOverstyrt}
                                onLukk={() => setVurdererOpptjening(false)}
                            />
                        </Vurderingspanel>
                    )}
                </HStack>
            </VStack>
        </Box>
    );
}

interface InngangsvilkårContainerProps {
    person: ApiSaksbildePerson;
    periode: ApiBeregnetPeriode;
}

function InngangsvilkårContainer({ person, periode }: InngangsvilkårContainerProps): ReactElement | null {
    const readOnly = useIsReadOnlyOppgave(person);
    const serPåTidligereBehandling = useSerPåTidligereBehandling(person);
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
            serPåTidligereBehandling={serPåTidligereBehandling}
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
                paddingBlock="space-16 space-64"
                paddingInline="space-32"
            >
                {children}
            </Box>
        </>
    );
}

function vurdertTekstFor(
    vilkårsgrunnlag: ApiVilkårsgrunnlagSpleisV2 | ApiVilkårsgrunnlagInfotrygdV2,
    vurdering?: ApiVurdering | null,
): ReactNode | undefined {
    if (vilkårsgrunnlag.type === 'ApiVilkårsgrunnlagInfotrygdV2') {
        return 'Vurdert i Infotrygd';
    }
    if (!vurdering) {
        return undefined;
    }

    const tidspunkt = getFormattedDatetimeString(vurdering.tidsstempel);

    return vurdering.automatisk ? (
        `Vurdert automatisk ${tidspunkt}`
    ) : (
        <VurdertAvSaksbehandler tidspunkt={tidspunkt} ident={vurdering.ident} />
    );
}
