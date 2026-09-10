import React, { ReactElement, ReactNode, useState } from 'react';

import { CheckmarkIcon, ExclamationmarkTriangleIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, ExpansionCard, HStack, Spacer, Tag, VStack } from '@navikt/ds-react';

import { ManueltVurderbarVilkårskode, vilkårskodeLabels } from '@/form-schemas/overstyrVilkårsvurderingSkjema';
import {
    ApiUtfall,
    ApiVilkårsvurdering,
    ApiVurderingsgrunnlag,
    ApiVurderingsgrunnlagArbeidsforhold,
    ApiVurderingskilde,
    ApiVurderingskildeSaksbehandler,
} from '@io/rest/generated/vilkarsproving.schemas';
import { getFormattedDatetimeString, somNorskDato } from '@utils/date';

import { ArbeidsforholdIGrunnlaget } from './ArbeidsforholdIGrunnlaget';
import { VurderOpptjeningsvilkårSkjema } from './VurderOpptjeningsvilkårSkjema';

const erSaksbehandlerkilde = (kilde: ApiVurderingskilde): kilde is ApiVurderingskildeSaksbehandler => 'ident' in kilde;

const grunnlagFraKilde = (kilde: ApiVurderingskilde): ApiVurderingsgrunnlag | undefined =>
    'grunnlag' in kilde ? kilde.grunnlag : undefined;

const erArbeidsforholdgrunnlag = (grunnlag: ApiVurderingsgrunnlag): grunnlag is ApiVurderingsgrunnlagArbeidsforhold =>
    'arbeidsforhold' in grunnlag;

export const opptjeningsgrunnlagFor = (
    vurdering?: ApiVilkårsvurdering,
): { fom: string; opptjeningsdager: number } | undefined => {
    const grunnlag = vurdering && grunnlagFraKilde(vurdering.kilde);
    const arbeidsforholdgrunnlag = grunnlag && erArbeidsforholdgrunnlag(grunnlag) ? grunnlag : undefined;

    return arbeidsforholdgrunnlag?.opptjeningsperiode
        ? {
              fom: arbeidsforholdgrunnlag.opptjeningsperiode.fom,
              opptjeningsdager: arbeidsforholdgrunnlag.opptjeningsdager,
          }
        : undefined;
};

const utfallstekst = (utfall?: ApiUtfall): string => {
    switch (utfall) {
        case ApiUtfall.OPPFYLT:
            return 'Oppfylt';
        case ApiUtfall.IKKE_OPPFYLT:
            return 'Ikke oppfylt';
        default:
            return 'Ikke vurdert';
    }
};

const utfallTagVariant = (utfall?: ApiUtfall): 'success' | 'error' | 'warning' => {
    switch (utfall) {
        case ApiUtfall.OPPFYLT:
            return 'success';
        case ApiUtfall.IKKE_OPPFYLT:
            return 'error';
        default:
            return 'warning';
    }
};

interface UtfallsikonProps {
    utfall?: ApiUtfall;
}

export const Utfallsikon = ({ utfall }: UtfallsikonProps): ReactElement => {
    switch (utfall) {
        case ApiUtfall.OPPFYLT:
            return <CheckmarkIcon title="Oppfylt" fontSize="24" />;
        case ApiUtfall.IKKE_OPPFYLT:
            return <XMarkIcon title="Ikke oppfylt" fontSize="24" />;
        default:
            return <ExclamationmarkTriangleIcon title="Ikke vurdert" fontSize="24" />;
    }
};

interface DetaljradProps {
    label: string;
    children: ReactNode;
}

const Detaljrad = ({ label, children }: DetaljradProps): ReactElement => (
    <>
        <BodyShort as="dt" size="small" textColor="subtle">
            {label}
        </BodyShort>
        <BodyShort as="dd" size="small">
            {children}
        </BodyShort>
    </>
);

interface VurderingsdetaljerProps {
    vurdering: ApiVilkårsvurdering;
}

const Vurderingsdetaljer = ({ vurdering }: VurderingsdetaljerProps): ReactElement => {
    const grunnlag = grunnlagFraKilde(vurdering.kilde);
    const arbeidsforholdgrunnlag = grunnlag && erArbeidsforholdgrunnlag(grunnlag) ? grunnlag : undefined;

    return (
        <VStack gap="space-12">
            <dl className="m-0 grid w-fit grid-cols-[auto_auto] gap-x-6 gap-y-1">
                {arbeidsforholdgrunnlag?.opptjeningsperiode && (
                    <Detaljrad label="Opptjening fra">
                        {somNorskDato(arbeidsforholdgrunnlag.opptjeningsperiode.fom) ?? 'ukjent'}
                    </Detaljrad>
                )}
                {arbeidsforholdgrunnlag && (
                    <Detaljrad label="Antall dager (>28)">{`${arbeidsforholdgrunnlag.opptjeningsdager}`}</Detaljrad>
                )}
                {erSaksbehandlerkilde(vurdering.kilde) ? (
                    <>
                        <Detaljrad label="Vurdert av">{vurdering.kilde.ident}</Detaljrad>
                        <Detaljrad label="Begrunnelse">{vurdering.kilde.fritekstbegrunnelse}</Detaljrad>
                    </>
                ) : (
                    <Detaljrad label="Vurdert">Automatisk</Detaljrad>
                )}
                {vurdering.vurdertTidspunkt && (
                    <Detaljrad label="Vurdert tidspunkt">
                        {getFormattedDatetimeString(vurdering.vurdertTidspunkt)}
                    </Detaljrad>
                )}
            </dl>
            {arbeidsforholdgrunnlag && (
                <ArbeidsforholdIGrunnlaget arbeidsforhold={arbeidsforholdgrunnlag.arbeidsforhold} />
            )}
        </VStack>
    );
};

interface OpptjeningVilkårsradProps {
    personPseudoId: string;
    skjæringstidspunkt: string;
    vilkårskode: ManueltVurderbarVilkårskode;
    vurdering?: ApiVilkårsvurdering;
    erAvgjørende: boolean;
    readOnly: boolean;
    onOverstyrt: (opptjeningsvurderingId: string) => void;
}

export const OpptjeningVilkårsrad = ({
    personPseudoId,
    skjæringstidspunkt,
    vilkårskode,
    vurdering,
    erAvgjørende,
    readOnly,
    onOverstyrt,
}: OpptjeningVilkårsradProps): ReactElement => {
    const [open, setOpen] = useState(false);
    const vilkårsnavn = vilkårskodeLabels[vilkårskode];
    const titleId = `opptjeningsvilkår-tittel-${vilkårskode}`;

    return (
        <li>
            <ExpansionCard
                size="small"
                open={open}
                onToggle={setOpen}
                aria-labelledby={titleId}
                data-testid={`opptjeningsvilkår-${vilkårskode}`}
                className="border-ax-border-neutral-subtleA bg-ax-bg-default"
            >
                <ExpansionCard.Header className="grid grid-cols-[1fr_auto] items-center after:content-none hover:bg-ax-bg-default">
                    <ExpansionCard.Title id={titleId} size="small" as={Box} className="w-full">
                        <HStack gap="space-8" align="center">
                            <span className="flex w-6 items-center justify-center">
                                <Utfallsikon utfall={vurdering?.utfall} />
                            </span>
                            <BodyShort weight="semibold" className="underline">
                                {vilkårsnavn}
                            </BodyShort>
                            <Spacer />
                            {erAvgjørende && (
                                <Tag size="xsmall" variant="info">
                                    Avgjørende vilkår
                                </Tag>
                            )}
                            <Tag size="xsmall" variant={utfallTagVariant(vurdering?.utfall)}>
                                {utfallstekst(vurdering?.utfall)}
                            </Tag>
                        </HStack>
                    </ExpansionCard.Title>
                </ExpansionCard.Header>
                <ExpansionCard.Content>
                    {open &&
                        (readOnly ? (
                            vurdering && <Vurderingsdetaljer vurdering={vurdering} />
                        ) : (
                            <VurderOpptjeningsvilkårSkjema
                                personPseudoId={personPseudoId}
                                skjæringstidspunkt={skjæringstidspunkt}
                                vilkårskode={vilkårskode}
                                eksisterendeUtfall={vurdering?.utfall}
                                onOverstyrt={(opptjeningsvurderingId) => {
                                    setOpen(false);
                                    onOverstyrt(opptjeningsvurderingId);
                                }}
                                onAvbryt={() => setOpen(false)}
                            />
                        ))}
                </ExpansionCard.Content>
            </ExpansionCard>
        </li>
    );
};
