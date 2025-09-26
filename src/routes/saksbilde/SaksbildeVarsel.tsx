import React from 'react';

import { Alert } from '@navikt/ds-react';

import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { useHarTotrinnsvurdering } from '@hooks/useHarTotrinnsvurdering';
import {
    Arbeidsforholdoverstyring,
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    Overstyring,
    Periodetilstand,
    PersonFragment,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import styles from '@saksbilde/saksbilder/SharedViews.module.css';
import { useVilkårsgrunnlag } from '@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag';
import { Saksbildevarsler } from '@saksbilde/varsler/Saksbildevarsler';
import { useHarDagOverstyringer } from '@state/arbeidsgiver';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { ActivePeriod } from '@typer/shared';
import { getPeriodState } from '@utils/mapping';
import { isArbeidsforholdoverstyring, isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

interface SaksbildeVarselProps {
    person: PersonFragment;
    periode: ActivePeriod;
}

export const SaksbildeVarsel = ({ person, periode }: SaksbildeVarselProps) => {
    const { data: tilkommenInntektData } = useHentTilkommenInntektQuery(person.aktorId);
    const harTilkommenInntektEndring =
        tilkommenInntektData?.restGetTilkomneInntektskilder.some((inntektkilde) =>
            inntektkilde.inntekter.some((tilkommenInntekt) => tilkommenInntekt.erDelAvAktivTotrinnsvurdering),
        ) ?? false;

    if (isAnnullertBeregnetPeriode(periode)) {
        return (
            <Alert variant="info" className={styles.Varsel}>
                Utbetalingen er annullert
            </Alert>
        );
    } else if (isTilAnnulleringBeregnetPeriode(periode)) {
        return (
            <Alert variant="info" className={styles.Varsel}>
                Utbetalingen er sendt til annullering
            </Alert>
        );
    } else if (isUberegnetPeriode(periode)) {
        return (
            <UberegnetSaksbildevarsler
                person={person}
                periode={periode as UberegnetPeriodeFragment}
                harTilkommenInntektEndring={harTilkommenInntektEndring}
            />
        );
    }

    if (!periode.skjaeringstidspunkt) {
        throw Error(`Mangler skjæringstidspunkt for periode med id: ${periode.id}. Ta kontakt med en utvikler.`);
    }

    if (!periode.vilkarsgrunnlagId) {
        throw Error(`Mangler vilkårsgrunnlag for periode med id: ${periode.id}. Ta kontakt med en utvikler.`);
    }

    if (isBeregnetPeriode(periode)) {
        return (
            <BeregnetSaksbildevarsler
                periode={periode as BeregnetPeriodeFragment}
                person={person}
                harTilkommenInntektEndring={harTilkommenInntektEndring}
            />
        );
    } else if (isGhostPeriode(periode)) {
        return (
            <Saksbildevarsler
                periodState={getPeriodState(periode)}
                skjæringstidspunkt={periode.skjaeringstidspunkt}
                harTotrinnsvurdering={false}
                harTilkommenInntektEndring={false}
            />
        );
    } else {
        return null;
    }
};

const useNavnPåDeaktiverteGhostArbeidsgivere = (
    person: PersonFragment,
    periode: BeregnetPeriodeFragment | UberegnetPeriodeFragment,
) => {
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, periode);
    return vilkårsgrunnlag?.__typename === 'VilkarsgrunnlagSpleisV2'
        ? person.arbeidsgivere
              .filter((arbeidsgiver) =>
                  arbeidsgiver.overstyringer.find(
                      (overstyring) =>
                          isArbeidsforholdoverstyring(overstyring) &&
                          !(overstyring as Arbeidsforholdoverstyring).ferdigstilt,
                  ),
              )
              .flatMap((arbeidsgiver) => arbeidsgiver.navn)
              .join(', ')
        : undefined;
};

interface BeregnetSaksbildevarslerProps {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
    harTilkommenInntektEndring: boolean;
}

function getÅpneEndringerForPeriode(arbeidsgivere: ArbeidsgiverFragment[], vedtaksperiodeId: string) {
    return arbeidsgivere
        .flatMap((ag) => ag.overstyringer)
        .filter((overstyring) => !overstyring.ferdigstilt && overstyring.vedtaksperiodeId === vedtaksperiodeId);
}

const BeregnetSaksbildevarsler = ({ person, periode, harTilkommenInntektEndring }: BeregnetSaksbildevarslerProps) => {
    const erTidligereSaksbehandler = useErTidligereSaksbehandler(person);
    const harDagOverstyringer = useHarDagOverstyringer(periode, person);
    const navnPåDeaktiverteGhostArbeidsgivere = useNavnPåDeaktiverteGhostArbeidsgivere(person, periode);
    const harTotrinnsvurdering = useHarTotrinnsvurdering(person);
    const åpneEndringerPåPerson: Overstyring[] = getÅpneEndringerForPeriode(
        person.arbeidsgivere,
        periode.vedtaksperiodeId,
    );

    return (
        <Saksbildevarsler
            periodState={getPeriodState(periode)}
            oppgavereferanse={periode.oppgave?.id}
            varsler={periode.varsler}
            erTidligereSaksbehandler={erTidligereSaksbehandler}
            erBeslutteroppgave={periode.totrinnsvurdering?.erBeslutteroppgave}
            åpneEndringerPåPerson={åpneEndringerPåPerson}
            harDagOverstyringer={harDagOverstyringer}
            activePeriodTom={periode.tom}
            skjæringstidspunkt={periode.skjaeringstidspunkt}
            navnPåDeaktiverteGhostArbeidsgivere={navnPåDeaktiverteGhostArbeidsgivere}
            harTotrinnsvurdering={harTotrinnsvurdering}
            harTilkommenInntektEndring={harTilkommenInntektEndring}
        />
    );
};

interface UberegnetSaksbildevarslerProps {
    person: PersonFragment;
    periode: UberegnetPeriodeFragment;
    harTilkommenInntektEndring: boolean;
}

const UberegnetSaksbildevarsler = ({ person, periode, harTilkommenInntektEndring }: UberegnetSaksbildevarslerProps) => {
    const harDagOverstyringer = useHarDagOverstyringer(periode, person);
    const navnPåDeaktiverteGhostArbeidsgivere = useNavnPåDeaktiverteGhostArbeidsgivere(person, periode);
    const harTotrinnsvurdering = useHarTotrinnsvurdering(person);
    const åpneEndringerPåPerson: Overstyring[] = getÅpneEndringerForPeriode(
        person.arbeidsgivere,
        periode.vedtaksperiodeId,
    );
    return (
        <Saksbildevarsler
            periodState={getPeriodState(periode)}
            varsler={periode.varsler}
            åpneEndringerPåPerson={åpneEndringerPåPerson}
            harDagOverstyringer={harDagOverstyringer}
            activePeriodTom={periode.tom}
            skjæringstidspunkt={periode.skjaeringstidspunkt}
            navnPåDeaktiverteGhostArbeidsgivere={navnPåDeaktiverteGhostArbeidsgivere}
            harTotrinnsvurdering={harTotrinnsvurdering}
            harTilkommenInntektEndring={harTilkommenInntektEndring}
        />
    );
};

export const isAnnullertBeregnetPeriode = (activePeriod: ActivePeriod) =>
    isBeregnetPeriode(activePeriod) && activePeriod.periodetilstand === Periodetilstand.Annullert;

const isTilAnnulleringBeregnetPeriode = (activePeriod: ActivePeriod) =>
    isBeregnetPeriode(activePeriod) && activePeriod.periodetilstand === Periodetilstand.TilAnnullering;
