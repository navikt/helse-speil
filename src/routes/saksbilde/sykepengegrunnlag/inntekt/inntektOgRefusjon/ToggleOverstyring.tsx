import React from 'react';

import { PersonPencilIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, HelpText } from '@navikt/ds-react';

import { ArbeidsgiverFragment, Maybe, PersonFragment, Utbetalingstatus } from '@io/graphql';
import {
    useGhostInntektKanOverstyres,
    useInntektKanRevurderes,
} from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import {
    useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
    useUtbetalingForSkjæringstidspunkt,
} from '@state/arbeidsgiver';
import { isInCurrentGeneration } from '@state/selectors/period';
import { ActivePeriod } from '@typer/shared';
import { isGhostPeriode } from '@utils/typeguards';

interface ToggleOverstyringProps {
    person: PersonFragment;
    arbeidsgiver: ArbeidsgiverFragment;
    periode: ActivePeriod;
    vilkårsgrunnlagId?: Maybe<string>;
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
    organisasjonsnummer,
    erDeaktivert,
    editing,
    setEditing,
}: ToggleOverstyringProps) => {
    const kanRevurderes = useInntektKanRevurderes(person, periode.skjaeringstidspunkt);
    const ghostInntektKanOverstyres =
        useGhostInntektKanOverstyres(person, periode.skjaeringstidspunkt, organisasjonsnummer) && !erDeaktivert;
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);
    const erRevurdering =
        useUtbetalingForSkjæringstidspunkt(periode.skjaeringstidspunkt, person)?.status === Utbetalingstatus.Utbetalt;

    const kanOverstyres = vilkårsgrunnlagId != null && (kanRevurderes || ghostInntektKanOverstyres);

    if (!isGhostPeriode(periode) && !isInCurrentGeneration(periode, arbeidsgiver)) return null;

    return kanOverstyres ? (
        !editing ? (
            <Button onClick={() => setEditing(true)} size="xsmall" variant="secondary" icon={<PersonPencilIcon />}>
                {erRevurdering ? 'Revurder' : 'Endre'}
            </Button>
        ) : (
            <Button onClick={() => setEditing(false)} size="xsmall" variant="tertiary" icon={<XMarkIcon />}>
                Avbryt
            </Button>
        )
    ) : (
        <HelpText title="Perioden kan ikke overstyres">
            {!erAktivPeriodeLikEllerFørPeriodeTilGodkjenning
                ? 'Perioden kan ikke overstyres fordi det finnes en oppgave på en tidligere periode'
                : !vilkårsgrunnlagId
                  ? 'Perioden kan ikke overstyres fordi den mangler vilkårsgrunnlag'
                  : 'Det er ikke mulig å endre inntekt i denne perioden'}
        </HelpText>
    );
};
