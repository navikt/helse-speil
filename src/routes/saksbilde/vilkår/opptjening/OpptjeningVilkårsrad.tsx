import React, { PropsWithChildren, ReactElement } from 'react';

import { CheckmarkCircleIcon, ExclamationmarkTriangleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Spacer, Tag, VStack } from '@navikt/ds-react';

import { erUtvikling } from '@/env';
import { ManueltVurderbarVilkårskode, vilkårskodeLabels } from '@form-schemas/manuellVurderingAvVilkårSkjema';
import {
    ApiUtfall,
    ApiVilkårsvurdering,
    ApiVurderingsgrunnlag,
    ApiVurderingsgrunnlagArbeidsforhold,
    ApiVurderingskilde,
    ApiVurderingskildeSaksbehandler,
} from '@io/rest/generated/vilkarsproving.schemas';
import { getFormattedDatetimeString, somNorskDato } from '@utils/date';
import { cn } from '@utils/tw';

import { ArbeidsforholdIGrunnlaget } from './ArbeidsforholdIGrunnlaget';

interface OpptjeningVilkårsradProps {
    vilkårskode: ManueltVurderbarVilkårskode;
    vurdering?: ApiVilkårsvurdering;
    erAvgjørende: boolean;
    readOnly: boolean;
    erAktiv: boolean;
    onVurder: () => void;
}

export function OpptjeningVilkårsrad({
    vilkårskode,
    vurdering,
    readOnly,
    erAktiv,
    onVurder,
}: OpptjeningVilkårsradProps): ReactElement {
    const vilkårsnavn = vilkårskodeLabels[vilkårskode];
    const titleId = `opptjeningsvilkår-tittel-${vilkårskode}`;

    return (
        <VStack
            as="li"
            gap="space-8"
            paddingBlock="space-16"
            paddingInline="space-16 space-32"
            data-testid={`opptjeningsvilkår-${vilkårskode}`}
            className={cn('z-10 -mr-[3px] border-b-ax-border-neutral-subtle not-last:border-b', {
                'bg-ax-bg-accent-soft': erAktiv,
            })}
        >
            <HStack gap="space-8" align="center" wrap={false}>
                <span className="flex w-6 shrink-0 items-center justify-center">
                    <Utfallsikon utfall={vurdering?.utfall} />
                </span>
                <BodyShort id={titleId} weight="semibold">
                    {vilkårsnavn}
                </BodyShort>
                <Spacer />
                {!readOnly && erUtvikling && (
                    <Button type="button" variant="secondary" size="small" onClick={onVurder}>
                        Vurder vilkår
                    </Button>
                )}
            </HStack>
            <VStack gap="space-8">
                <HStack gap="space-8" align="center">
                    <Tag size="xsmall" variant={utfallTagVariant(vurdering?.utfall)}>
                        {vurdertTagTekst(vurdering)}
                    </Tag>
                </HStack>
                {vurdering && <Vurderingsdetaljer vurdering={vurdering} />}
            </VStack>
        </VStack>
    );
}

function Vurderingsdetaljer({ vurdering }: { vurdering: ApiVilkårsvurdering }): ReactElement | null {
    const grunnlag = grunnlagFraKilde(vurdering.kilde);
    const arbeidsforholdgrunnlag = grunnlag && erArbeidsforholdgrunnlag(grunnlag) ? grunnlag : undefined;
    const opptjeningsgrunnlag = opptjeningsgrunnlagFor(vurdering);
    const journalpostIder = erSaksbehandlerkilde(vurdering.kilde) ? vurdering.kilde.journalpostId : [];

    if (!erSaksbehandlerkilde(vurdering.kilde) && !arbeidsforholdgrunnlag) {
        return null;
    }

    return (
        <VStack gap="space-12">
            {erSaksbehandlerkilde(vurdering.kilde) && (
                <dl className="m-0 grid w-fit grid-cols-[auto_auto] gap-x-6 gap-y-1">
                    <Detaljrad label="Begrunnelse">{vurdering.kilde.fritekstbegrunnelse}</Detaljrad>
                    {journalpostIder.length > 0 && (
                        <Detaljrad label="Journalpost-ID">{journalpostIder.join(', ')}</Detaljrad>
                    )}
                </dl>
            )}
            {arbeidsforholdgrunnlag && (
                <VStack gap="space-4">
                    {opptjeningsgrunnlag && (
                        <HStack gap="space-24">
                            <BodyShort>Opptjening fra</BodyShort>
                            <BodyShort>
                                {`${somNorskDato(opptjeningsgrunnlag.fom) ?? 'ukjent'} (${opptjeningsgrunnlag.opptjeningsdager} dager)`}
                            </BodyShort>
                        </HStack>
                    )}
                    <ArbeidsforholdIGrunnlaget arbeidsforhold={arbeidsforholdgrunnlag.arbeidsforhold} />
                </VStack>
            )}
        </VStack>
    );
}

function Detaljrad({ label, children }: PropsWithChildren<{ label: string }>): ReactElement {
    return (
        <>
            <BodyShort as="dt" size="small" textColor="subtle">
                {label}
            </BodyShort>
            <BodyShort as="dd" size="small">
                {children}
            </BodyShort>
        </>
    );
}

function Utfallsikon({ utfall }: { utfall?: ApiUtfall }): ReactElement {
    switch (utfall) {
        case ApiUtfall.OPPFYLT:
            return <CheckmarkCircleIcon title="Vurdert automatisk" className="text-ax-text-neutral" fontSize="24" />;
        case ApiUtfall.IKKE_OPPFYLT:
            return <XMarkOctagonIcon title="Ikke oppfylt" className="text-ax-text-neutral" fontSize="24" />;
        default:
            return <ExclamationmarkTriangleIcon title="Ikke vurdert" className="text-ax-text-neutral" fontSize="24" />;
    }
}

function vurdertTagTekst(vurdering?: ApiVilkårsvurdering): string {
    if (!vurdering || !vurdering.vurdertTidspunkt) {
        return utfallstekst(vurdering?.utfall);
    }

    const tidspunkt = getFormattedDatetimeString(vurdering.vurdertTidspunkt);

    return erSaksbehandlerkilde(vurdering.kilde)
        ? `Vurdert ${tidspunkt} – ${vurdering.kilde.ident}`
        : `Vurdert automatisk ${tidspunkt}`;
}

function utfallstekst(utfall?: ApiUtfall): string {
    switch (utfall) {
        case ApiUtfall.OPPFYLT:
            return 'Oppfylt';
        case ApiUtfall.IKKE_OPPFYLT:
            return 'Ikke oppfylt';
        default:
            return 'Ikke vurdert';
    }
}

function utfallTagVariant(utfall?: ApiUtfall): 'neutral' | 'error' | 'warning' {
    switch (utfall) {
        case ApiUtfall.OPPFYLT:
            return 'neutral';
        case ApiUtfall.IKKE_OPPFYLT:
            return 'error';
        default:
            return 'warning';
    }
}

function opptjeningsgrunnlagFor(
    vurdering?: ApiVilkårsvurdering,
): { fom: string; opptjeningsdager: number } | undefined {
    const grunnlag = vurdering && grunnlagFraKilde(vurdering.kilde);
    const arbeidsforholdgrunnlag = grunnlag && erArbeidsforholdgrunnlag(grunnlag) ? grunnlag : undefined;

    return arbeidsforholdgrunnlag?.opptjeningsperiode
        ? {
              fom: arbeidsforholdgrunnlag.opptjeningsperiode.fom,
              opptjeningsdager: arbeidsforholdgrunnlag.opptjeningsdager,
          }
        : undefined;
}

function erSaksbehandlerkilde(kilde: ApiVurderingskilde): kilde is ApiVurderingskildeSaksbehandler {
    return 'ident' in kilde;
}

function grunnlagFraKilde(kilde: ApiVurderingskilde): ApiVurderingsgrunnlag | undefined {
    return 'grunnlag' in kilde ? kilde.grunnlag : undefined;
}

function erArbeidsforholdgrunnlag(grunnlag: ApiVurderingsgrunnlag): grunnlag is ApiVurderingsgrunnlagArbeidsforhold {
    return 'arbeidsforhold' in grunnlag;
}
