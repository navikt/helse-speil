import React from 'react';

import { PersonPencilIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, HelpText } from '@navikt/ds-react';

import { ApiSaksbildePerson, ApiUtbetalingstatus } from '@io/rest/generated/spesialist.schemas';
import {
    useGhostInntektKanOverstyres,
    useInntektKanRevurderes,
} from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import {
    useAktivtInntektsforhold,
    useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning,
    useSerPåTidligereBehandling,
} from '@state/inntektsforhold/inntektsforhold';
import { DateString } from '@typer/shared';
import { isBeregnetPeriode } from '@utils/typeguards';

interface ToggleOverstyringProps {
    person: ApiSaksbildePerson;
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
    const inntektsforhold = useAktivtInntektsforhold(person);
    const serPåTidligereBehandling = useSerPåTidligereBehandling(person);
    const kanRevurderes = useInntektKanRevurderes(person, skjæringstidspunkt);
    const ghostInntektKanOverstyres =
        useGhostInntektKanOverstyres(person, skjæringstidspunkt, organisasjonsnummer) && !erDeaktivert;
    const erAktivPeriodeLikEllerFørPeriodeTilGodkjenning = useErAktivPeriodeLikEllerFørPeriodeTilGodkjenning(person);

    const kanOverstyres = vilkårsgrunnlagId != null && (kanRevurderes || ghostInntektKanOverstyres);

    // Saksbehandler ser på en tidligere behandling av den aktive perioden, og skal ikke kunne overstyre.
    if (inntektsforhold == null || serPåTidligereBehandling) {
        return null;
    }

    const utbetalingForSkjæringstidspunkt =
        Array.from(inntektsforhold.behandlinger[0]?.perioder ?? [])
            .filter(isBeregnetPeriode)
            .reverse()
            .find((beregnetPeriode) => beregnetPeriode.skjaeringstidspunkt === skjæringstidspunkt)?.utbetaling ?? null;
    const erRevurdering = utbetalingForSkjæringstidspunkt?.status === ApiUtbetalingstatus.UTBETALT;

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
