import React, { ReactElement, useId } from 'react';

import { BodyShort, Button, HStack, Spacer, VStack } from '@navikt/ds-react';

import { likestiltYtelseLabels } from '@form-schemas/likestiltYtelseSkjema';
import { useErCoachFagkoordinatorEllerSupersaksbehandler } from '@hooks/brukerrolleHooks';
import { ApiUtfall, ApiVilkårskode, ApiVilkårsvurdering } from '@io/rest/generated/vilkarsproving.schemas';
import { AvgjørendeVilkårTag, Vilkårsutfall, VilkårsutfallTag } from '@saksbilde/vilkår/vilkårsutfall';
import { cn } from '@utils/tw';

import { Detaljrad, Utfallsikon, erSaksbehandlerkilde, vurdertTekst } from './OpptjeningVilkårsrad';

interface LikestiltYtelseVilkårsradProps {
    vurderingFor: (vilkårskode: ApiVilkårskode) => ApiVilkårsvurdering | undefined;
    erAvgjørende: boolean;
    readOnly: boolean;
    serPåTidligereBehandling: boolean;
    erAktiv: boolean;
    onVurder: () => void;
}

export function LikestiltYtelseVilkårsrad({
    vurderingFor,
    erAvgjørende,
    readOnly,
    serPåTidligereBehandling,
    erAktiv,
    onVurder,
}: LikestiltYtelseVilkårsradProps): ReactElement {
    const navnId = useId();
    const erCoachFagkoordinatorEllerSupersaksbehandler = useErCoachFagkoordinatorEllerSupersaksbehandler();
    const punktum = {
        første: vurderingFor(ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER),
        andre: vurderingFor(ApiVilkårskode.OPPTJENING_FORELDREPENGER_IKKE_OPPTJENT_PA_AAP),
        tredje: vurderingFor(ApiVilkårskode.OPPTJENING_YRKESAKTIV_MINST_4_UKER_FOR_UTTAK_AV_FORELDREPENGER),
    };
    const { utfall, hjemmel } = utledLikestiltYtelse(punktum);

    return (
        <VStack
            as="li"
            gap="space-8"
            paddingBlock="space-16"
            paddingInline="space-16 space-32"
            aria-labelledby={navnId}
            className={cn('z-10 -mr-[3px] border-b-ax-border-neutral-subtle not-last:border-b', {
                'bg-ax-bg-accent-soft': erAktiv,
            })}
        >
            <HStack gap="space-8" align="center" wrap={false}>
                <span className="flex w-6 shrink-0 items-center justify-center">
                    <Utfallsikon utfall={utfall} />
                </span>
                <VStack>
                    <BodyShort id={navnId} weight="semibold">
                        Likestilt ytelse
                    </BodyShort>
                </VStack>
                <Spacer />
                {!readOnly && !serPåTidligereBehandling && erCoachFagkoordinatorEllerSupersaksbehandler && (
                    <Button type="button" variant="secondary" size="small" onClick={onVurder}>
                        Vurder vilkår
                    </Button>
                )}
            </HStack>
            <HStack gap="space-8" align="center">
                <VilkårsutfallTag utfall={utfall}>{vurdertTekst(punktum.første)}</VilkårsutfallTag>
                {erAvgjørende && <AvgjørendeVilkårTag />}
            </HStack>
            {punktum.første && erSaksbehandlerkilde(punktum.første.kilde) && (
                <dl className="m-0 grid w-fit grid-cols-[auto_auto] gap-x-6 gap-y-1">
                    {punktum.første.kilde.ytelser.length > 0 && (
                        <Detaljrad label="Likestilte ytelser">
                            {punktum.første.kilde.ytelser.map((ytelse) => likestiltYtelseLabels[ytelse]).join(', ')}
                        </Detaljrad>
                    )}
                    <Detaljrad label="Minst 4 uker sammenlagt">{jaNei(erOppfylt(punktum.første))}</Detaljrad>
                    {punktum.andre && (
                        <Detaljrad label="Foreldrepenger opptjent på AAP">{jaNei(!erOppfylt(punktum.andre))}</Detaljrad>
                    )}
                    {punktum.tredje && (
                        <Detaljrad label="Yrkesaktiv 4 uker før uttak">{jaNei(erOppfylt(punktum.tredje))}</Detaljrad>
                    )}
                    {hjemmel && <Detaljrad label="Hjemmel">{hjemmel}</Detaljrad>}
                    <Detaljrad label="Begrunnelse">{punktum.første.kilde.fritekstbegrunnelse}</Detaljrad>
                    {punktum.første.kilde.journalpostId.length > 0 && (
                        <Detaljrad label="Journalpost-ID">{punktum.første.kilde.journalpostId.join(', ')}</Detaljrad>
                    )}
                </dl>
            )}
        </VStack>
    );
}

interface Punktumvurderinger {
    første?: ApiVilkårsvurdering;
    andre?: ApiVilkårsvurdering;
    tredje?: ApiVilkårsvurdering;
}

// Scenario B–E i docs/opptjening-8-2-kodeverk.md i sp-vilkarsproving, likt avgjørendeVilkårsvurdering() der
export function utledLikestiltYtelse({ første, andre, tredje }: Punktumvurderinger): {
    utfall: Vilkårsutfall;
    hjemmel?: string;
} {
    if (!første) return { utfall: 'IkkeVurdert' };
    if (!erOppfylt(første)) return { utfall: 'IkkeOppfylt', hjemmel: '§ 8-2 andre ledd første punktum' };
    if (!andre || erOppfylt(andre)) return { utfall: 'Oppfylt', hjemmel: '§ 8-2 andre ledd første punktum' };
    if (!tredje) return { utfall: 'IkkeOppfylt', hjemmel: '§ 8-2 andre ledd andre punktum' };
    return erOppfylt(tredje)
        ? { utfall: 'Oppfylt', hjemmel: '§ 8-2 andre ledd tredje punktum' }
        : { utfall: 'IkkeOppfylt', hjemmel: '§ 8-2 andre ledd andre punktum, jf. tredje punktum' };
}

function erOppfylt(vurdering: ApiVilkårsvurdering): boolean {
    return vurdering.utfall === ApiUtfall.OPPFYLT;
}

function jaNei(verdi: boolean): string {
    return verdi ? 'Ja' : 'Nei';
}
