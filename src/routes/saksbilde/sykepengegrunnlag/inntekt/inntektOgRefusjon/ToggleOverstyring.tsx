import { PersonPencilIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, HelpText } from '@navikt/ds-react';

import { useRedigeringISykefraværstilfellet } from '@hooks/useRedigeringISykefraværstilfellet';
import { ApiSaksbildePerson, ApiUtbetalingstatus } from '@io/rest/generated/spesialist.schemas';
import {
    useGhostInntektKanOverstyres,
    useInntektKanRevurderes,
} from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import {
    Inntektsforhold,
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
    const redigering = useRedigeringISykefraværstilfellet(person, vilkårsgrunnlagId);

    const kanOverstyres =
        vilkårsgrunnlagId != null && (redigering ? redigering.kanRedigere : kanRevurderes || ghostInntektKanOverstyres);

    // Saksbehandler ser på en tidligere behandling av den aktive perioden, og skal ikke kunne overstyre.
    if (redigering ? redigering.erEldreGrunnlag : inntektsforhold == null || serPåTidligereBehandling) {
        return null;
    }

    const erRevurdering = redigering
        ? redigering.erRevurdering
        : erUtbetaltPåSkjæringstidspunkt(inntektsforhold, skjæringstidspunkt);

    return kanOverstyres ? (
        !editing ? (
            <Button
                onClick={() => setEditing(true)}
                size="xsmall"
                variant="secondary"
                icon={<PersonPencilIcon aria-hidden />}
            >
                {erRevurdering ? 'Revurder' : 'Endre'}
            </Button>
        ) : (
            <Button onClick={() => setEditing(false)} size="xsmall" variant="tertiary" icon={<XMarkIcon aria-hidden />}>
                Avbryt
            </Button>
        )
    ) : (
        <HelpText title="Perioden kan ikke overstyres">
            {redigering === null && !erAktivPeriodeLikEllerFørPeriodeTilGodkjenning
                ? 'Perioden kan ikke overstyres fordi det finnes en oppgave på en tidligere periode'
                : !vilkårsgrunnlagId
                  ? 'Perioden kan ikke overstyres fordi den mangler vilkårsgrunnlag'
                  : 'Det er ikke mulig å endre inntekt i denne perioden'}
        </HelpText>
    );
};

function erUtbetaltPåSkjæringstidspunkt(
    inntektsforhold: Inntektsforhold | undefined,
    skjæringstidspunkt: DateString,
): boolean {
    const utbetalingForSkjæringstidspunkt =
        Array.from(inntektsforhold?.behandlinger[0]?.perioder ?? [])
            .filter(isBeregnetPeriode)
            .reverse()
            .find((beregnetPeriode) => beregnetPeriode.skjaeringstidspunkt === skjæringstidspunkt)?.utbetaling ?? null;
    return utbetalingForSkjæringstidspunkt?.status === ApiUtbetalingstatus.UTBETALT;
}
