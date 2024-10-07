import React from 'react';

import { PadlockUnlockedIcon, PersonPencilIcon } from '@navikt/aksel-icons';
import { Button, HelpText } from '@navikt/ds-react';

import { ArbeidsgiverFragment, Maybe, PersonFragment } from '@io/graphql';
import {
    useGhostInntektKanOverstyres,
    useInntektKanRevurderes,
} from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import { useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { isInCurrentGeneration } from '@state/selectors/period';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode } from '@utils/typeguards';

interface ToggleOverstyringProps {
    person: PersonFragment;
    arbeidsgiver: ArbeidsgiverFragment;
    periode: ActivePeriod;
    vilkårsgrunnlagId?: Maybe<string>;
    skjæringstidspunkt: string;
    organisasjonsnummer: string;
    erDeaktivert: boolean;
    editing: boolean;
    setEditing: (value: boolean) => void;
}

export const ToggleOverstyring = ({
    person,
    arbeidsgiver,
    periode,
    vilkårsgrunnlagId,
    skjæringstidspunkt,
    organisasjonsnummer,
    erDeaktivert,
    editing,
    setEditing,
}: ToggleOverstyringProps) => {
    const kanRevurderes = useInntektKanRevurderes(person, skjæringstidspunkt);
    const ghostInntektKanOverstyres =
        useGhostInntektKanOverstyres(person, skjæringstidspunkt, organisasjonsnummer) && !erDeaktivert;
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);

    const kanOverstyres =
        vilkårsgrunnlagId != null && ((isBeregnetPeriode(periode) && kanRevurderes) || ghostInntektKanOverstyres);

    if (!isInCurrentGeneration(periode, arbeidsgiver)) return null;

    return kanOverstyres ? (
        !editing ? (
            <Button onClick={() => setEditing(true)} size="xsmall" variant="secondary" icon={<PersonPencilIcon />}>
                Overstyr
            </Button>
        ) : (
            <Button onClick={() => setEditing(false)} size="xsmall" variant="tertiary" icon={<PadlockUnlockedIcon />}>
                Avbryt
            </Button>
        )
    ) : (
        <HelpText>
            {!erAktivPeriodeLikEllerFørPeriodeTilGodkjenning
                ? 'Perioden kan ikke overstyres fordi det finnes en oppgave på en tidligere periode'
                : !vilkårsgrunnlagId
                  ? 'Perioden kan ikke overstyres fordi den mangler vilkårsgrunnlag'
                  : 'Det er ikke mulig å endre inntekt i denne perioden'}
        </HelpText>
    );
};
