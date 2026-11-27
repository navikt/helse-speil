import {
    ApiPeriode,
    ApiPeriodetilstand,
    ApiSaksbildePerson,
    ApiUtbetalingstatus,
} from '@io/rest/generated/spesialist.schemas';
import { finnAlleArbeidsgivere } from '@state/inntektsforhold/arbeidsgiver';
import { Inntektsforhold, finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

export type Sykefraværstilfellestatus = 'vis' | 'ikkeBeregnet' | 'annullert';

export type Sykefraværstilfelle = {
    perioder: ActivePeriod[];
    vilkarsgrunnlagId: string | null;
    status: Sykefraværstilfellestatus;
};

type PeriodeMedVilkårsgrunnlag = { periode: ApiPeriode; vilkarsgrunnlagId: string | null };

export function finnSykefraværstilfelle(person: ApiSaksbildePerson, valgtPeriode: ActivePeriod): Sykefraværstilfelle {
    const perioder = finnAlleInntektsforhold(person).flatMap(medVilkårsgrunnlag);
    const { skjaeringstidspunkt } = valgtPeriode;

    if (isUberegnetPeriode(valgtPeriode)) {
        return lagSykefraværstilfelle(
            person,
            perioder,
            skjaeringstidspunkt,
            finnNyesteVilkårsgrunnlagId(perioder, skjaeringstidspunkt),
            valgtPeriode,
        );
    }

    const vilkarsgrunnlagId = isGhostPeriode(valgtPeriode)
        ? (valgtPeriode.vilkarsgrunnlagId ?? null)
        : (perioder.find(({ periode }) => periode.id === valgtPeriode.id)?.vilkarsgrunnlagId ?? null);
    if (vilkarsgrunnlagId === null) {
        return { perioder: [valgtPeriode], vilkarsgrunnlagId: null, status: 'ikkeBeregnet' };
    }

    return lagSykefraværstilfelle(person, perioder, skjaeringstidspunkt, vilkarsgrunnlagId, valgtPeriode);
}

export function finnSykefraværstilfelleForSkjæringstidspunkt(
    person: ApiSaksbildePerson,
    skjæringstidspunkt: string,
): Sykefraværstilfelle {
    const perioder = finnAlleInntektsforhold(person).flatMap(medVilkårsgrunnlag);
    return lagSykefraværstilfelle(
        person,
        perioder,
        skjæringstidspunkt,
        finnNyesteVilkårsgrunnlagId(perioder, skjæringstidspunkt),
        null,
    );
}

export type Redigering = { kanRedigere: boolean; erEldreGrunnlag: boolean; erRevurdering: boolean };

export function redigeringISykefraværstilfellet(
    person: ApiSaksbildePerson,
    vilkarsgrunnlagId: string | null,
    venterPåBeslutter: boolean,
): Redigering {
    const skjæringstidspunkt = vilkarsgrunnlagId === null ? null : finnSkjæringstidspunkt(person, vilkarsgrunnlagId);
    if (skjæringstidspunkt === null) return { kanRedigere: false, erEldreGrunnlag: false, erRevurdering: false };

    const nyesteTilfelle = finnSykefraværstilfelleForSkjæringstidspunkt(person, skjæringstidspunkt);
    const erEldreGrunnlag = nyesteTilfelle.vilkarsgrunnlagId !== vilkarsgrunnlagId;
    return {
        kanRedigere: !erEldreGrunnlag && !venterPåBeslutter && nyesteTilfelle.status !== 'annullert',
        erEldreGrunnlag,
        erRevurdering: erFørstePeriodeUtbetalt(nyesteTilfelle.perioder),
    };
}

// Endringer i grunnlaget er en revurdering når den første perioden i sykefraværstilfellet er utbetalt
function erFørstePeriodeUtbetalt(perioder: ActivePeriod[]): boolean {
    const førstePeriode = perioder
        .filter(isBeregnetPeriode)
        .filter((periode) => !erAnnullertPeriode(periode))
        .sort((a, b) => a.fom.localeCompare(b.fom))[0];
    return førstePeriode?.utbetaling.status === ApiUtbetalingstatus.UTBETALT;
}

function finnSkjæringstidspunkt(person: ApiSaksbildePerson, vilkarsgrunnlagId: string): string | null {
    const periode =
        finnAlleInntektsforhold(person)
            .flatMap(medVilkårsgrunnlag)
            .find((periode) => periode.vilkarsgrunnlagId === vilkarsgrunnlagId)?.periode ??
        finnAlleArbeidsgivere(person)
            .flatMap((arbeidsgiver) => arbeidsgiver.ghostPerioder)
            .find((ghostPeriode) => ghostPeriode.vilkarsgrunnlagId === vilkarsgrunnlagId);
    return periode?.skjaeringstidspunkt ?? null;
}

// Uberegnede perioder får det nyeste grunnlaget når de beregnes, så de hører bare til klyngen for det
function lagSykefraværstilfelle(
    person: ApiSaksbildePerson,
    perioder: PeriodeMedVilkårsgrunnlag[],
    skjæringstidspunkt: string,
    vilkarsgrunnlagId: string | null,
    valgtPeriode: ActivePeriod | null,
): Sykefraværstilfelle {
    const erNyesteGrunnlag = vilkarsgrunnlagId === finnNyesteVilkårsgrunnlagId(perioder, skjæringstidspunkt);
    const perioderITilfellet = [
        ...finnVedtaksperioder(
            perioder,
            valgtPeriode,
            (periode) =>
                (vilkarsgrunnlagId !== null && periode.vilkarsgrunnlagId === vilkarsgrunnlagId) ||
                (erNyesteGrunnlag &&
                    isUberegnetPeriode(periode.periode) &&
                    periode.periode.skjaeringstidspunkt === skjæringstidspunkt),
        ),
        ...(vilkarsgrunnlagId !== null ? finnGhostPerioder(person, valgtPeriode?.id ?? null, vilkarsgrunnlagId) : []),
    ];
    if (vilkarsgrunnlagId === null) {
        return { perioder: perioderITilfellet, vilkarsgrunnlagId: null, status: 'ikkeBeregnet' };
    }
    return {
        perioder: perioderITilfellet,
        vilkarsgrunnlagId,
        status: erAnnullert(perioderITilfellet) ? 'annullert' : 'vis',
    };
}

function finnNyesteVilkårsgrunnlagId(perioder: PeriodeMedVilkårsgrunnlag[], skjæringstidspunkt: string): string | null {
    const nyesteMedGrunnlag = nyestePerVedtaksperiode(
        perioder.filter(
            ({ periode, vilkarsgrunnlagId }) =>
                vilkarsgrunnlagId !== null && periode.skjaeringstidspunkt === skjæringstidspunkt,
        ),
    );
    const sisteFørst = nyesteMedGrunnlag.sort((a, b) => b.periode.tom.localeCompare(a.periode.tom));
    return (
        sisteFørst.find(({ periode }) => !erAnnullertPeriode(periode))?.vilkarsgrunnlagId ??
        sisteFørst[0]?.vilkarsgrunnlagId ??
        null
    );
}

function medVilkårsgrunnlag(inntektsforhold: Inntektsforhold): PeriodeMedVilkårsgrunnlag[] {
    // Behandlingene ligger nyeste først
    const perioder = inntektsforhold.behandlinger.flatMap((behandling) => behandling.perioder);
    return perioder.map((periode, index) => {
        if (!isBeregnetPeriode(periode)) return { periode, vilkarsgrunnlagId: null };
        if (periode.vilkarsgrunnlagId || !erAnnullertPeriode(periode)) {
            return { periode, vilkarsgrunnlagId: periode.vilkarsgrunnlagId ?? null };
        }
        const førAnnulleringen = perioder
            .slice(index + 1)
            .find(
                (eldre) =>
                    eldre.vedtaksperiodeId === periode.vedtaksperiodeId &&
                    isBeregnetPeriode(eldre) &&
                    eldre.vilkarsgrunnlagId,
            );
        return {
            periode,
            vilkarsgrunnlagId: isBeregnetPeriode(førAnnulleringen)
                ? (førAnnulleringen.vilkarsgrunnlagId ?? null)
                : null,
        };
    });
}

function finnVedtaksperioder(
    perioder: PeriodeMedVilkårsgrunnlag[],
    valgtPeriode: ActivePeriod | null,
    hørerTilSykefraværstilfellet: (periode: PeriodeMedVilkårsgrunnlag) => boolean,
): ActivePeriod[] {
    const valgtVedtaksperiodeId =
        valgtPeriode === null || isGhostPeriode(valgtPeriode) ? null : valgtPeriode.vedtaksperiodeId;
    const andrePerioder = nyestePerVedtaksperiode(
        perioder.filter(
            (periode) =>
                periode.periode.vedtaksperiodeId !== valgtVedtaksperiodeId && hørerTilSykefraværstilfellet(periode),
        ),
    ).map(({ periode }) => periode);
    return valgtPeriode === null || valgtVedtaksperiodeId === null ? andrePerioder : [valgtPeriode, ...andrePerioder];
}

// Perioderekkefølgen er nyeste behandling først, så første treff per vedtaksperiode er den nyeste
function nyestePerVedtaksperiode(perioder: PeriodeMedVilkårsgrunnlag[]): PeriodeMedVilkårsgrunnlag[] {
    const nyeste = new Map<string, PeriodeMedVilkårsgrunnlag>();
    perioder.forEach((periode) => {
        if (!nyeste.has(periode.periode.vedtaksperiodeId)) nyeste.set(periode.periode.vedtaksperiodeId, periode);
    });
    return [...nyeste.values()];
}

// Tidslinjen viser ikke deaktiverte ghost-perioder
function finnGhostPerioder(
    person: ApiSaksbildePerson,
    valgtPeriodeId: string | null,
    vilkarsgrunnlagId: string,
): ActivePeriod[] {
    return finnAlleArbeidsgivere(person)
        .flatMap((arbeidsgiver) => arbeidsgiver.ghostPerioder)
        .filter(
            (ghostPeriode) =>
                ghostPeriode.id === valgtPeriodeId ||
                (!ghostPeriode.deaktivert && ghostPeriode.vilkarsgrunnlagId === vilkarsgrunnlagId),
        );
}

const annullerteTilstander: ApiPeriodetilstand[] = [ApiPeriodetilstand.Annullert, ApiPeriodetilstand.TilAnnullering];

export function erAnnullertPeriode(periode: ApiPeriode): boolean {
    return annullerteTilstander.includes(periode.periodetilstand);
}

// Ghost-perioder kan ikke annulleres, så bare de beregnede periodene teller
function erAnnullert(perioder: ActivePeriod[]): boolean {
    const beregnedePerioder = perioder.filter(isBeregnetPeriode);
    return beregnedePerioder.length > 0 && beregnedePerioder.every(erAnnullertPeriode);
}
