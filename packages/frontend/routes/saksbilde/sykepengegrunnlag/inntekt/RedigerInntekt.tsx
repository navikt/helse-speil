import React, { Dispatch, SetStateAction } from 'react';

import { EditButton } from '@components/EditButton';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import {
    useActiveGenerationIsLast,
    useFørstegangsbehandlingTilGodkjenningMedOverlappendeAvsluttetPeriode,
    useHarKunEnFagsystemIdPåArbeidsgiverIAktivPeriode,
} from '@hooks/revurdering';
import { Vilkarsgrunnlagtype } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson, useVilkårsgrunnlag } from '@state/person';
import { getPeriodState } from '@utils/mapping';

interface RedigerInntektProps {
    setEditing: Dispatch<SetStateAction<boolean>>;
    editing: boolean;
    erRevurdering: boolean;
    vilkårsgrunnlagId: string;
}

export const RedigerInntekt = ({ setEditing, editing, erRevurdering, vilkårsgrunnlagId }: RedigerInntektProps) => {
    const periode = useActivePeriod();
    const person = useCurrentPerson() as FetchedPerson;

    const førstegangsbehandlingTilGodkjenningMedOverlappendeAvsluttetPeriode =
        useFørstegangsbehandlingTilGodkjenningMedOverlappendeAvsluttetPeriode(periode!!, person!!);

    const aktivPeriodeVenter = ['venter', 'venterPåKiling'].includes(getPeriodState(periode));

    const erTidslinjeperiodeISisteGenerasjon = useActiveGenerationIsLast();

    const erSpleisVilkårsgrunnlagtype =
        useVilkårsgrunnlag(vilkårsgrunnlagId)?.vilkarsgrunnlagtype === Vilkarsgrunnlagtype.Spleis;
    const erIkkePingPong = useHarKunEnFagsystemIdPåArbeidsgiverIAktivPeriode();

    if (!erTidslinjeperiodeISisteGenerasjon) return null;

    return !aktivPeriodeVenter &&
        !førstegangsbehandlingTilGodkjenningMedOverlappendeAvsluttetPeriode &&
        erSpleisVilkårsgrunnlagtype &&
        erIkkePingPong ? (
        <EditButton
            isOpen={editing}
            openText="Avbryt"
            closedText={erRevurdering ? 'Revurder' : 'Endre'}
            onOpen={() => setEditing(true)}
            onClose={() => setEditing(false)}
            style={{ justifySelf: 'flex-end' }}
        />
    ) : erTidslinjeperiodeISisteGenerasjon ? (
        <PopoverHjelpetekst ikon={<SortInfoikon />}>
            <p>
                {aktivPeriodeVenter
                    ? 'Det finnes andre endringer som må ferdigstilles før du kan endre inntekten'
                    : førstegangsbehandlingTilGodkjenningMedOverlappendeAvsluttetPeriode
                    ? 'Det er ikke støtte for endring av inntekt på førstegangsbehandlinger når det finnes avsluttede overlappende perioder for andre arbeidsgivere'
                    : 'Det er foreløpig ikke støtte for endringer i saker som har vært delvis behandlet i Infotrygd'}
            </p>
        </PopoverHjelpetekst>
    ) : (
        <></>
    );
};
