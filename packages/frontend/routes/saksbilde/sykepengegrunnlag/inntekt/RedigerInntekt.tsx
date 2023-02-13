import React, { Dispatch, SetStateAction } from 'react';

import { EditButton } from '@components/EditButton';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { Arbeidsgiver, BeregnetPeriode, Utbetalingstatus, Vilkarsgrunnlagtype } from '@io/graphql';
import { usePeriodForSkjæringstidspunktForArbeidsgiver } from '@state/arbeidsgiver';
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
            .filter((periode) => periode.utbetaling.status !== Utbetalingstatus.Godkjentutenutbetaling)
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
    skjæringstidspunkt: DateString;
    organisasjonsnummer: string;
    arbeidsgiver: Arbeidsgiver;
}

export const RedigerInntekt = ({
    setEditing,
    editing,
    erRevurdering,
    vilkårsgrunnlagId,
    skjæringstidspunkt,
    organisasjonsnummer,
    arbeidsgiver,
}: RedigerInntektProps) => {
    const person = useCurrentPerson() as FetchedPerson;
    const periode = usePeriodForSkjæringstidspunktForArbeidsgiver(
        skjæringstidspunkt,
        organisasjonsnummer
    ) as BeregnetPeriode;

    if (!isInCurrentGeneration(periode, arbeidsgiver)) return null;

    return kanRedigereInnekt(person, arbeidsgiver, periode, vilkårsgrunnlagId) ? (
        <EditButton
            isOpen={editing}
            openText="Avbryt"
            closedText={erRevurdering ? 'Revurder' : 'Endre'}
            onOpen={() => setEditing(true)}
            onClose={() => setEditing(false)}
            style={{ placeSelf: 'center flex-end' }}
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
