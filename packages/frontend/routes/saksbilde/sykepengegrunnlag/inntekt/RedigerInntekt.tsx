import React, { Dispatch, SetStateAction } from 'react';

import { EditButton } from '@components/EditButton';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { Arbeidsgiver, BeregnetPeriode, Vilkarsgrunnlagtype } from '@io/graphql';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { isGodkjent, isInCurrentGeneration, isTilGodkjenning, isWaiting, overlapper } from '@state/selectors/period';
import { getVilkårsgrunnlag } from '@state/selectors/person';
import { isRevurdering } from '@state/selectors/utbetaling';
import { isBeregnetPeriode } from '@utils/typeguards';

export const perioderMedSkjæringstidspunktHarKunÉnFagsystemId = (
    arbeidsgiver: Arbeidsgiver,
    skjæringstidspunkt: DateString
): boolean => {
    return (
        arbeidsgiver.generasjoner[0]?.perioder
            .filter(isBeregnetPeriode)
            .filter((periode) => periode.skjaeringstidspunkt === skjæringstidspunkt)
            .reduce((ider, periode) => ider.add(periode.utbetaling.arbeidsgiverFagsystemId), new Set()).size === 1
    );
};

export const harVilkårsgrunnlagFraSpleis = (person: FetchedPerson, grunnlagId: string): boolean => {
    return getVilkårsgrunnlag(person, grunnlagId)?.vilkarsgrunnlagtype === Vilkarsgrunnlagtype.Spleis;
};

export const periodeErTilGodkjenningMedOverlappendeAvsluttetPeriode = (
    periode: FetchedBeregnetPeriode,
    person: FetchedPerson
): boolean => {
    if (!isTilGodkjenning(periode) || isRevurdering(periode.utbetaling)) {
        return false;
    }

    const beregnedePerioder = person.arbeidsgivere.flatMap(
        (arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder.filter(isBeregnetPeriode) ?? []
    ) as Array<FetchedBeregnetPeriode>;

    return beregnedePerioder
        .filter((other) => other.vedtaksperiodeId !== periode.vedtaksperiodeId)
        .filter(overlapper(periode))
        .some(isGodkjent);
};

export const kanRedigereInnekt = (
    person: FetchedPerson,
    arbeidsgiver: Arbeidsgiver,
    periode: FetchedBeregnetPeriode,
    vilkårsgrunnlagId: string
): boolean => {
    return (
        !isWaiting(periode) &&
        !periodeErTilGodkjenningMedOverlappendeAvsluttetPeriode(periode, person) &&
        harVilkårsgrunnlagFraSpleis(person, vilkårsgrunnlagId) &&
        perioderMedSkjæringstidspunktHarKunÉnFagsystemId(arbeidsgiver, periode.skjaeringstidspunkt)
    );
};

interface RedigerInntektProps {
    setEditing: Dispatch<SetStateAction<boolean>>;
    editing: boolean;
    erRevurdering: boolean;
    vilkårsgrunnlagId: string;
}

export const RedigerInntekt = ({ setEditing, editing, erRevurdering, vilkårsgrunnlagId }: RedigerInntektProps) => {
    const periode = useActivePeriod() as BeregnetPeriode;
    const person = useCurrentPerson() as FetchedPerson;
    const arbeidsgiver = useCurrentArbeidsgiver() as Arbeidsgiver;

    if (!isInCurrentGeneration(periode, arbeidsgiver)) return null;

    return kanRedigereInnekt(person, arbeidsgiver, periode, vilkårsgrunnlagId) ? (
        <EditButton
            isOpen={editing}
            openText="Avbryt"
            closedText={erRevurdering ? 'Revurder' : 'Endre'}
            onOpen={() => setEditing(true)}
            onClose={() => setEditing(false)}
            style={{ justifySelf: 'flex-end', alignSelf: 'baseline' }}
        />
    ) : (
        <PopoverHjelpetekst ikon={<SortInfoikon />}>
            <p>
                {isWaiting(periode)
                    ? 'Det finnes andre endringer som må ferdigstilles før du kan endre inntekten'
                    : periodeErTilGodkjenningMedOverlappendeAvsluttetPeriode(periode, person)
                    ? 'Det er ikke støtte for endring av inntekt på førstegangsbehandlinger når det finnes avsluttede overlappende perioder for andre arbeidsgivere'
                    : 'Det er foreløpig ikke støtte for endringer i saker som har vært delvis behandlet i Infotrygd'}
            </p>
        </PopoverHjelpetekst>
    );
};
