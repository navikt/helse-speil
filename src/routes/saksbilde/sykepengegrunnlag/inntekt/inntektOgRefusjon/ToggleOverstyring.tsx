import React from 'react';

import { PersonPencilIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, HelpText } from '@navikt/ds-react';

import { PersonFragment, Utbetalingstatus } from '@io/graphql';
import {
    useGhostInntektKanOverstyres,
    useInntektKanRevurderes,
} from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import {
    useAktivtInntektsforhold,
    useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
} from '@state/inntektsforhold/inntektsforhold';
import { useActivePeriod } from '@state/periode';
import { isInCurrentGeneration } from '@state/selectors/period';
import { DateString } from '@typer/shared';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

interface ToggleOverstyringProps {
    person: PersonFragment;
    skjæringstidspunkt: DateString;
    vilkårsgrunnlagId?: string | null;
    organisasjonsnummer: string;
    erDeaktivert: boolean;
    editing: boolean;
    setEditing: (value: boolean) => void;
}

export const ToggleOverstyring = ({
    person,
    skjæringstidspunkt,
    vilkårsgrunnlagId,
    organisasjonsnummer,
    erDeaktivert,
    editing,
    setEditing,
}: ToggleOverstyringProps) => {
    const aktivPeriode = useActivePeriod(person);
    const inntektsforhold = useAktivtInntektsforhold(person);
    const kanRevurderes = useInntektKanRevurderes(person, skjæringstidspunkt);
    const ghostInntektKanOverstyres =
        useGhostInntektKanOverstyres(person, skjæringstidspunkt, organisasjonsnummer) && !erDeaktivert;
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);

    const kanOverstyres = vilkårsgrunnlagId != null && (kanRevurderes || ghostInntektKanOverstyres);

    // Saksbehandler ser på en tidligere behandling av den aktive perioden, og skal ikke kunne overstyre.
    if (
        aktivPeriode == null ||
        inntektsforhold == null ||
        (!isGhostPeriode(aktivPeriode) && !isInCurrentGeneration(aktivPeriode, inntektsforhold))
    ) {
        return null;
    }

    const utbetalingForSkjæringstidspunkt =
        Array.from(inntektsforhold.behandlinger[0]?.perioder ?? [])
            .filter(isBeregnetPeriode)
            .reverse()
            .find((beregnetPeriode) => beregnetPeriode.skjaeringstidspunkt === skjæringstidspunkt)?.utbetaling ?? null;
    const erRevurdering = utbetalingForSkjæringstidspunkt?.status === Utbetalingstatus.Utbetalt;

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
