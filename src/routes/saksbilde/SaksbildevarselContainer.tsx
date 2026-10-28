import { useParams } from 'next/navigation';
import React from 'react';

import { Alert } from '@navikt/ds-react';

import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import { useHarTotrinnsvurdering } from '@hooks/useHarTotrinnsvurdering';
import {
    ApiBeregnetPeriode,
    ApiOverstyring,
    ApiPeriodetilstand,
    ApiSaksbildePerson,
    ApiUberegnetPeriode,
} from '@io/rest/generated/spesialist.schemas';
import { useVilkårsgrunnlag } from '@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag';
import { Saksbildevarsler } from '@saksbilde/varsler/Saksbildevarsler';
import { finnAlleArbeidsgivere } from '@state/inntektsforhold/arbeidsgiver';
import {
    Inntektsforhold,
    finnAlleInntektsforhold,
    useHarDagOverstyringer,
} from '@state/inntektsforhold/inntektsforhold';
import { useAktivOppgaveForPeriode } from '@state/oppgave';
import { tilSaksbehandlerhandlingKontrolltekst, useHentSaksbehandlerhandlinger } from '@state/saksbehandlerhandlinger';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { ActivePeriod } from '@typer/shared';
import { getPeriodState, getPeriodStateMedOppgave } from '@utils/mapping';
import { isArbeidsforholdoverstyring, isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

interface SaksbildevarselContainerProps {
    person: ApiSaksbildePerson;
    periode: ActivePeriod;
}

export const SaksbildevarselContainer = ({ person, periode }: SaksbildevarselContainerProps) => {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: tilkommenInntektData } = useHentTilkommenInntektQuery(personPseudoId);
    const harTilkommenInntektEndring =
        tilkommenInntektData?.some((inntektkilde) =>
            inntektkilde.inntekter.some((tilkommenInntekt) => tilkommenInntekt.erDelAvAktivTotrinnsvurdering),
        ) ?? false;
    const { data: saksbehandlerhandlinger } = useHentSaksbehandlerhandlinger(personPseudoId);
    const saksbehandlerhandlingerTilKontroll = [
        ...new Set(
            (saksbehandlerhandlinger ?? [])
                .filter((handling) => handling.erDelAvAktivTotrinnsvurdering)
                .map((handling) => tilSaksbehandlerhandlingKontrolltekst(handling.handlingType)),
        ),
    ];

    if (isAnnullertBeregnetPeriode(periode)) {
        return (
            <Alert variant="info" className="rounded-none border-x-0 border-t-0 py-2">
                Utbetalingen er annullert
            </Alert>
        );
    } else if (isTilAnnulleringBeregnetPeriode(periode)) {
        return (
            <Alert variant="info" className="rounded-none border-x-0 border-t-0 py-2">
                Utbetalingen er sendt til annullering
            </Alert>
        );
    } else if (isUberegnetPeriode(periode)) {
        return (
            <UberegnetSaksbildevarsler
                person={person}
                periode={periode as ApiUberegnetPeriode}
                harTilkommenInntektEndring={harTilkommenInntektEndring}
                saksbehandlerhandlingerTilKontroll={saksbehandlerhandlingerTilKontroll}
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
                periode={periode as ApiBeregnetPeriode}
                person={person}
                harTilkommenInntektEndring={harTilkommenInntektEndring}
                saksbehandlerhandlingerTilKontroll={saksbehandlerhandlingerTilKontroll}
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
    person: ApiSaksbildePerson,
    periode: ApiBeregnetPeriode | ApiUberegnetPeriode,
) => {
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, periode);
    return vilkårsgrunnlag?.type === 'ApiVilkårsgrunnlagSpleisV2'
        ? finnAlleArbeidsgivere(person)
              .filter((arbeidsgiver) =>
                  arbeidsgiver.overstyringer.find(
                      (overstyring) => isArbeidsforholdoverstyring(overstyring) && !overstyring.ferdigstilt,
                  ),
              )
              .flatMap((arbeidsgiver) => arbeidsgiver.navn)
              .join(', ')
        : undefined;
};

interface BeregnetSaksbildevarslerProps {
    person: ApiSaksbildePerson;
    periode: ApiBeregnetPeriode;
    harTilkommenInntektEndring: boolean;
    saksbehandlerhandlingerTilKontroll: string[];
}

function getÅpneEndringerForPeriode(arbeidsgivere: Inntektsforhold[], vedtaksperiodeId: string) {
    return arbeidsgivere
        .flatMap((ag) => ag.overstyringer)
        .filter((overstyring) => !overstyring.ferdigstilt && overstyring.vedtaksperiodeId === vedtaksperiodeId);
}

const BeregnetSaksbildevarsler = ({
    person,
    periode,
    harTilkommenInntektEndring,
    saksbehandlerhandlingerTilKontroll,
}: BeregnetSaksbildevarslerProps) => {
    const erTidligereSaksbehandler = useErTidligereSaksbehandler(person);
    const harDagOverstyringer = useHarDagOverstyringer(periode, person);
    const navnPåDeaktiverteGhostArbeidsgivere = useNavnPåDeaktiverteGhostArbeidsgivere(person, periode);
    const harTotrinnsvurdering = useHarTotrinnsvurdering(person);
    const oppgave = useAktivOppgaveForPeriode(periode);
    const åpneEndringerPåPerson: ApiOverstyring[] = getÅpneEndringerForPeriode(
        finnAlleInntektsforhold(person),
        periode.vedtaksperiodeId,
    );

    return (
        <Saksbildevarsler
            periodState={getPeriodStateMedOppgave(periode, oppgave !== null)}
            oppgavereferanse={oppgave?.id}
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
            saksbehandlerhandlingerTilKontroll={saksbehandlerhandlingerTilKontroll}
        />
    );
};

interface UberegnetSaksbildevarslerProps {
    person: ApiSaksbildePerson;
    periode: ApiUberegnetPeriode;
    harTilkommenInntektEndring: boolean;
    saksbehandlerhandlingerTilKontroll: string[];
}

const UberegnetSaksbildevarsler = ({
    person,
    periode,
    harTilkommenInntektEndring,
    saksbehandlerhandlingerTilKontroll,
}: UberegnetSaksbildevarslerProps) => {
    const harDagOverstyringer = useHarDagOverstyringer(periode, person);
    const navnPåDeaktiverteGhostArbeidsgivere = useNavnPåDeaktiverteGhostArbeidsgivere(person, periode);
    const harTotrinnsvurdering = useHarTotrinnsvurdering(person);
    const åpneEndringerPåPerson: ApiOverstyring[] = getÅpneEndringerForPeriode(
        finnAlleInntektsforhold(person),
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
            saksbehandlerhandlingerTilKontroll={saksbehandlerhandlingerTilKontroll}
        />
    );
};

export const isAnnullertBeregnetPeriode = (activePeriod: ActivePeriod) =>
    isBeregnetPeriode(activePeriod) && activePeriod.periodetilstand === ApiPeriodetilstand.Annullert;

const isTilAnnulleringBeregnetPeriode = (activePeriod: ActivePeriod) =>
    isBeregnetPeriode(activePeriod) && activePeriod.periodetilstand === ApiPeriodetilstand.TilAnnullering;
