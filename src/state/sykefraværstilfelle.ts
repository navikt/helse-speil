import { ApiPeriode, ApiPeriodetilstand, ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
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

    if (isUberegnetPeriode(valgtPeriode)) {
        const { skjaeringstidspunkt } = valgtPeriode;
        return {
            perioder: finnVedtaksperioder(
                perioder,
                valgtPeriode,
                ({ periode }) => isUberegnetPeriode(periode) && periode.skjaeringstidspunkt === skjaeringstidspunkt,
            ),
            vilkarsgrunnlagId: null,
            status: 'ikkeBeregnet',
        };
    }

    const vilkarsgrunnlagId = isGhostPeriode(valgtPeriode)
        ? (valgtPeriode.vilkarsgrunnlagId ?? null)
        : (perioder.find(({ periode }) => periode.id === valgtPeriode.id)?.vilkarsgrunnlagId ?? null);
    if (vilkarsgrunnlagId === null) {
        return { perioder: [valgtPeriode], vilkarsgrunnlagId: null, status: 'ikkeBeregnet' };
    }

    const perioderITilfellet = [
        ...finnVedtaksperioder(perioder, valgtPeriode, (periode) => periode.vilkarsgrunnlagId === vilkarsgrunnlagId),
        ...finnGhostPerioder(person, valgtPeriode, vilkarsgrunnlagId),
    ];
    return {
        perioder: perioderITilfellet,
        vilkarsgrunnlagId,
        status: erAnnullert(perioderITilfellet) ? 'annullert' : 'vis',
    };
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
    valgtPeriode: ActivePeriod,
    hørerTilSykefraværstilfellet: (periode: PeriodeMedVilkårsgrunnlag) => boolean,
): ActivePeriod[] {
    const valgtVedtaksperiodeId = isGhostPeriode(valgtPeriode) ? null : valgtPeriode.vedtaksperiodeId;
    const nyestePerVedtaksperiode = new Map<string, ApiPeriode>();

    perioder
        .filter(
            (periode) =>
                periode.periode.vedtaksperiodeId !== valgtVedtaksperiodeId && hørerTilSykefraværstilfellet(periode),
        )
        .forEach(({ periode }) => {
            if (!nyestePerVedtaksperiode.has(periode.vedtaksperiodeId)) {
                nyestePerVedtaksperiode.set(periode.vedtaksperiodeId, periode);
            }
        });

    const andrePerioder = [...nyestePerVedtaksperiode.values()];
    return valgtVedtaksperiodeId === null ? andrePerioder : [valgtPeriode, ...andrePerioder];
}

// Tidslinjen viser ikke deaktiverte ghost-perioder
function finnGhostPerioder(
    person: ApiSaksbildePerson,
    valgtPeriode: ActivePeriod,
    vilkarsgrunnlagId: string,
): ActivePeriod[] {
    return finnAlleArbeidsgivere(person)
        .flatMap((arbeidsgiver) => arbeidsgiver.ghostPerioder)
        .filter(
            (ghostPeriode) =>
                ghostPeriode.id === valgtPeriode.id ||
                (!ghostPeriode.deaktivert && ghostPeriode.vilkarsgrunnlagId === vilkarsgrunnlagId),
        );
}

const annullerteTilstander: ApiPeriodetilstand[] = [ApiPeriodetilstand.Annullert, ApiPeriodetilstand.TilAnnullering];

function erAnnullertPeriode(periode: ApiPeriode): boolean {
    return annullerteTilstander.includes(periode.periodetilstand);
}

// Ghost-perioder kan ikke annulleres, så bare de beregnede periodene teller
function erAnnullert(perioder: ActivePeriod[]): boolean {
    const beregnedePerioder = perioder.filter(isBeregnetPeriode);
    return beregnedePerioder.length > 0 && beregnedePerioder.every(erAnnullertPeriode);
}
