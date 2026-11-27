import { useParams } from 'next/navigation';
import { ReactElement } from 'react';

import { useErTidligereSaksbehandler } from '@hooks/useErTidligereSaksbehandler';
import {
    ApiBeregnetPeriode,
    ApiGhostPeriode,
    ApiSaksbildePerson,
    ApiUberegnetPeriode,
    ApiVarselDTO,
} from '@io/rest/generated/spesialist.schemas';
import { useVilkårsgrunnlag } from '@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag';
import { finnAlleArbeidsgivere } from '@state/inntektsforhold/arbeidsgiver';
import { useHarDagOverstyringer } from '@state/inntektsforhold/inntektsforhold';
import { useAktivOppgaveForPeriode } from '@state/oppgave';
import { useInntektOgRefusjon } from '@state/overstyring';
import { finnOverstyringerForInntektsforhold, useOverstyringer } from '@state/overstyringer';
import { tilSaksbehandlerhandlingKontrolltekst, useHentSaksbehandlerhandlinger } from '@state/saksbehandlerhandlinger';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { useNyttVarseldesign } from '@state/toggles';
import { useHarBeslutteroppgave, useTotrinnsvurderingForPeriode } from '@state/totrinnsvurdering';
import { ActivePeriod } from '@typer/shared';
import { getPeriodState, getPeriodStateMedOppgave } from '@utils/mapping';
import { isArbeidsforholdoverstyring, isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

import { Beskjed, Beslutterkontroll } from './Beskjeder';
import { KalkulerEndringerBeskjed } from './KalkulerEndringerBeskjed';
import { VarselContainer } from './VarselContainer';
import { GammeltVarseldesign } from './gammelt/GammeltVarseldesign';
import {
    SaksbildeBeskjed,
    annulleringsbeskjed,
    beslutterkontroll,
    feilbeskjeder,
    statusbeskjeder,
} from './saksbildeBeskjeder';
import { synligeVarsler } from './varselstatus';

interface SaksbildevarslerOgBeskjederProps {
    person: ApiSaksbildePerson;
    periode: ActivePeriod;
    className?: string;
}

export function SaksbildevarslerOgBeskjeder({
    person,
    periode,
    className,
}: SaksbildevarslerOgBeskjederProps): ReactElement | null {
    const annullering = isBeregnetPeriode(periode) ? annulleringsbeskjed(periode.periodetilstand) : null;
    if (annullering) {
        return <Beskjed {...annullering} />;
    }

    if (isGhostPeriode(periode)) {
        sjekkAtPeriodenErKomplett(periode);
        const periodState = getPeriodState(periode);
        return (
            <Visning
                kontrollpunkter={[]}
                statusbeskjeder={statusbeskjeder(periodState, false)}
                feilbeskjeder={feilbeskjeder(periodState)}
                skjæringstidspunkt={periode.skjaeringstidspunkt}
                className={className}
            />
        );
    }

    return <PeriodeMedVarsler person={person} periode={periode} className={className} />;
}

interface PeriodeMedVarslerProps {
    person: ApiSaksbildePerson;
    periode: ApiBeregnetPeriode | ApiUberegnetPeriode;
    className?: string;
}

function PeriodeMedVarsler({ person, periode, className }: PeriodeMedVarslerProps): ReactElement | null {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: tilkommenInntekt } = useHentTilkommenInntektQuery(personPseudoId);
    const { data: saksbehandlerhandlinger } = useHentSaksbehandlerhandlinger(personPseudoId);
    const erTidligereSaksbehandler = useErTidligereSaksbehandler(person);
    const harDagOverstyringer = useHarDagOverstyringer(periode, person);
    const overstyringer = useOverstyringer();
    const navnPåDeaktiverteGhostArbeidsgivere = useNavnPåDeaktiverteGhostArbeidsgivere(person, periode);
    const harBeslutteroppgave = useHarBeslutteroppgave();
    const oppgave = useAktivOppgaveForPeriode(periode);
    const totrinnsvurdering = useTotrinnsvurderingForPeriode(periode);

    if (isBeregnetPeriode(periode)) {
        sjekkAtPeriodenErKomplett(periode);
    }

    const periodState = isBeregnetPeriode(periode)
        ? getPeriodStateMedOppgave(periode, oppgave !== null)
        : getPeriodState(periode);

    const kontrollpunkter = beslutterkontroll({
        harTotrinnsvurdering: harBeslutteroppgave,
        varsler: periode.varsler,
        harDagOverstyringer,
        harTilkommenInntektEndring:
            tilkommenInntekt?.some((inntektkilde) =>
                inntektkilde.inntekter.some((inntekt) => inntekt.erDelAvAktivTotrinnsvurdering),
            ) ?? false,
        saksbehandlerhandlingerTilKontroll: [
            ...new Set(
                (saksbehandlerhandlinger ?? [])
                    .filter((handling) => handling.erDelAvAktivTotrinnsvurdering)
                    .map((handling) => tilSaksbehandlerhandlingKontrolltekst(handling.handlingType)),
            ),
        ],
        åpneEndringerPåPerson: overstyringer.filter(
            (overstyring) => !overstyring.ferdigstilt && overstyring.vedtaksperiodeId === periode.vedtaksperiodeId,
        ),
        activePeriodTom: periode.tom,
        navnPåDeaktiverteGhostArbeidsgivere,
    });

    return (
        <Visning
            kontrollpunkter={kontrollpunkter}
            statusbeskjeder={statusbeskjeder(
                periodState,
                erTidligereSaksbehandler && (totrinnsvurdering?.erBeslutteroppgave ?? false),
            )}
            feilbeskjeder={feilbeskjeder(periodState, oppgave?.id)}
            varsler={periode.varsler}
            skjæringstidspunkt={periode.skjaeringstidspunkt}
            className={className}
        />
    );
}

interface VisningProps {
    kontrollpunkter: string[];
    statusbeskjeder: SaksbildeBeskjed[];
    feilbeskjeder: SaksbildeBeskjed[];
    varsler?: ApiVarselDTO[];
    skjæringstidspunkt?: string | null;
    className?: string;
}

function Visning({
    kontrollpunkter,
    statusbeskjeder,
    feilbeskjeder,
    varsler,
    skjæringstidspunkt,
    className,
}: VisningProps): ReactElement | null {
    const nyttVarseldesign = useNyttVarseldesign();
    const lokaleInntektoverstyringer = useInntektOgRefusjon();

    const skalViseKalkulerEndringer =
        !!lokaleInntektoverstyringer &&
        lokaleInntektoverstyringer.skjæringstidspunkt === skjæringstidspunkt &&
        lokaleInntektoverstyringer.arbeidsgivere.length > 0;
    const harInnhold =
        (varsler?.length ?? 0) > 0 ||
        kontrollpunkter.length > 0 ||
        statusbeskjeder.length > 0 ||
        feilbeskjeder.length > 0 ||
        skalViseKalkulerEndringer;
    if (!harInnhold) return null;

    const varslerSomVises = synligeVarsler(varsler ?? []);
    return (
        <div className={className}>
            {nyttVarseldesign ? (
                <>
                    {kontrollpunkter.length > 0 && <Beslutterkontroll kontrollpunkter={kontrollpunkter} />}
                    {statusbeskjeder.map((beskjed) => (
                        <Beskjed key={beskjed.tekst} {...beskjed} />
                    ))}
                    {feilbeskjeder.map((beskjed) => (
                        <Beskjed key={beskjed.tekst} {...beskjed} />
                    ))}
                    {varslerSomVises.length > 0 && <VarselContainer varsler={varslerSomVises} />}
                </>
            ) : (
                <GammeltVarseldesign
                    kontrollpunkter={kontrollpunkter}
                    statusbeskjeder={statusbeskjeder}
                    feilbeskjeder={feilbeskjeder}
                    varsler={varsler}
                />
            )}
            {skalViseKalkulerEndringer && (
                <KalkulerEndringerBeskjed lokaleInntektoverstyringer={lokaleInntektoverstyringer} />
            )}
        </div>
    );
}

function sjekkAtPeriodenErKomplett(periode: ApiBeregnetPeriode | ApiGhostPeriode) {
    if (!periode.skjaeringstidspunkt) {
        throw Error(`Mangler skjæringstidspunkt for periode med id: ${periode.id}. Ta kontakt med en utvikler.`);
    }
    if (!periode.vilkarsgrunnlagId) {
        throw Error(`Mangler vilkårsgrunnlag for periode med id: ${periode.id}. Ta kontakt med en utvikler.`);
    }
}

function useNavnPåDeaktiverteGhostArbeidsgivere(
    person: ApiSaksbildePerson,
    periode: ApiBeregnetPeriode | ApiUberegnetPeriode,
): string | undefined {
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, periode);
    const overstyringer = useOverstyringer();
    return vilkårsgrunnlag?.type === 'ApiVilkårsgrunnlagSpleisV2'
        ? finnAlleArbeidsgivere(person)
              .filter((arbeidsgiver) =>
                  finnOverstyringerForInntektsforhold(overstyringer, arbeidsgiver).find(
                      (overstyring) => isArbeidsforholdoverstyring(overstyring) && !overstyring.ferdigstilt,
                  ),
              )
              .flatMap((arbeidsgiver) => arbeidsgiver.navn)
              .join(', ')
        : undefined;
}
