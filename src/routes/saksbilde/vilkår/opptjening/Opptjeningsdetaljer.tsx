import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';

import { BodyShort, HStack, VStack } from '@navikt/ds-react';

import { opptjeningsaktivitetLabels } from '@form-schemas/opptjeningsvurderingSkjema';
import {
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVurderingsgrunnlag,
    ApiVurderingsgrunnlagArbeidsforhold,
    ApiVurderingskilde,
} from '@io/rest/generated/vilkarsproving.schemas';
import { VilkårsutfallTag, VurdertAvSaksbehandler } from '@saksbilde/vilkår/vilkårsutfall';
import { getFormattedDatetimeString, somNorskDato } from '@utils/date';

import { ArbeidsforholdIGrunnlaget } from './ArbeidsforholdIGrunnlaget';
import {
    erOppfylt,
    erSaksbehandlerkilde,
    opptjeningsvilkår,
    utledOpptjening,
    vurderingForVisning,
} from './opptjeningsutfall';

interface OpptjeningsdetaljerProps {
    vurderingFor: (vilkårskode: ApiVilkårskode) => ApiVilkårsvurdering | undefined;
    visDetaljer?: boolean;
}

// Første ledd og punktumene i andre ledd vurderes i samme skjema og vises samlet
export function Opptjeningsdetaljer({ vurderingFor, visDetaljer = false }: OpptjeningsdetaljerProps): ReactElement {
    const vilkår = opptjeningsvilkår(vurderingFor);
    const { arbeid, første, andre, tredje } = vilkår;
    const { utfall, hjemmel } = utledOpptjening(vilkår);
    const vurdering = vurderingForVisning(vilkår);
    const saksbehandlerkilde =
        visDetaljer && vurdering && erSaksbehandlerkilde(vurdering.kilde) ? vurdering.kilde : undefined;
    const arbeidsforholdgrunnlag = arbeid && arbeidsforholdgrunnlagFra(arbeid.kilde);
    const minst4Uker = første ?? arbeid;

    return (
        <VStack gap="space-8">
            <VilkårsutfallTag utfall={utfall}>{vurdertTekst(vurdering)}</VilkårsutfallTag>
            {saksbehandlerkilde && (
                <dl className="m-0 grid w-fit grid-cols-[auto_auto] gap-x-6 gap-y-1">
                    {saksbehandlerkilde.opptjeningsaktiviteter.length > 0 && (
                        <Detaljrad label="Arbeid og likestilte ytelser">
                            {saksbehandlerkilde.opptjeningsaktiviteter
                                .map((aktivitet) => opptjeningsaktivitetLabels[aktivitet])
                                .join(', ')}
                        </Detaljrad>
                    )}
                    {minst4Uker && <Detaljrad label="Minst 4 uker">{jaNei(erOppfylt(minst4Uker))}</Detaljrad>}
                    {andre && <Detaljrad label="Foreldrepenger opptjent på AAP">{jaNei(!erOppfylt(andre))}</Detaljrad>}
                    {tredje && <Detaljrad label="Yrkesaktiv 4 uker før uttak">{jaNei(erOppfylt(tredje))}</Detaljrad>}
                    {hjemmel && <Detaljrad label="Hjemmel">{hjemmel}</Detaljrad>}
                    <Detaljrad label="Begrunnelse">{saksbehandlerkilde.fritekstbegrunnelse}</Detaljrad>
                    {saksbehandlerkilde.journalpostId.length > 0 && (
                        <Detaljrad label="Journalpost-ID">{saksbehandlerkilde.journalpostId.join(', ')}</Detaljrad>
                    )}
                </dl>
            )}
            {arbeidsforholdgrunnlag && <Arbeidsforholddetaljer grunnlag={arbeidsforholdgrunnlag} />}
        </VStack>
    );
}

function Arbeidsforholddetaljer({ grunnlag }: { grunnlag: ApiVurderingsgrunnlagArbeidsforhold }): ReactElement {
    return (
        <VStack gap="space-4" className="pb-4">
            {grunnlag.opptjeningsperiode && (
                <HStack gap="space-24">
                    <BodyShort>Opptjening fra</BodyShort>
                    <BodyShort>
                        {`${somNorskDato(grunnlag.opptjeningsperiode.fom) ?? 'ukjent'} (${grunnlag.opptjeningsdager} dager)`}
                    </BodyShort>
                </HStack>
            )}
            <ArbeidsforholdIGrunnlaget arbeidsforhold={grunnlag.arbeidsforhold} />
        </VStack>
    );
}

function Detaljrad({ label, children }: PropsWithChildren<{ label: string }>): ReactElement {
    return (
        <>
            <BodyShort as="dt" size="small" textColor="subtle">
                {label}
            </BodyShort>
            <BodyShort as="dd" size="small" className="wrap-anywhere">
                {children}
            </BodyShort>
        </>
    );
}

function vurdertTekst(vurdering?: ApiVilkårsvurdering): ReactNode | undefined {
    if (!vurdering?.vurdertTidspunkt) return undefined;
    const tidspunkt = getFormattedDatetimeString(vurdering.vurdertTidspunkt);
    return erSaksbehandlerkilde(vurdering.kilde) ? (
        <VurdertAvSaksbehandler tidspunkt={tidspunkt} ident={vurdering.kilde.ident} />
    ) : (
        `Vurdert automatisk ${tidspunkt}`
    );
}

function jaNei(verdi: boolean): string {
    return verdi ? 'Ja' : 'Nei';
}

function arbeidsforholdgrunnlagFra(kilde: ApiVurderingskilde): ApiVurderingsgrunnlagArbeidsforhold | undefined {
    const grunnlag: ApiVurderingsgrunnlag | undefined = 'grunnlag' in kilde ? kilde.grunnlag : undefined;
    return grunnlag && erArbeidsforholdgrunnlag(grunnlag) ? grunnlag : undefined;
}

function erArbeidsforholdgrunnlag(grunnlag: ApiVurderingsgrunnlag): grunnlag is ApiVurderingsgrunnlagArbeidsforhold {
    return 'arbeidsforhold' in grunnlag;
}
