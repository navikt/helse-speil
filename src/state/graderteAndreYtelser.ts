import { useParams } from 'next/navigation';

import {
    ApiEndreGraderteAndreYtelserRequest,
    ApiGraderteAndreYtelser,
    ApiYrkesaktivitetstype,
} from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import {
    useGetGraderteAndreYtelser,
    useGetGraderteAndreYtelserVersjon,
} from '@io/rest/generated/andre-ytelser/graderte-andre-ytelser/graderte-andre-ytelser';
import { ApiBeregnetPeriode, ApiUberegnetPeriode } from '@io/rest/generated/spesialist.schemas';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { isInCurrentGeneration } from '@state/selectors/period';
import { isArbeidsgiver, isBeregnetPeriode } from '@utils/typeguards';

type Yrkesaktivitet = Pick<ApiEndreGraderteAndreYtelserRequest, 'yrkesaktivitet' | 'organisasjonsnummer'>;

export function useGraderteAndreYtelser(): ApiGraderteAndreYtelser[] {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const { data } = useGetGraderteAndreYtelser(personPseudoId!, {
        query: { enabled: !!personPseudoId },
    });
    return data ?? [];
}

export function useGraderteAndreYtelserVedVersjon(versjon: string | null): ApiGraderteAndreYtelser | undefined {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const { data } = useGetGraderteAndreYtelserVersjon(personPseudoId!, versjon!, {
        query: { enabled: !!personPseudoId && !!versjon },
    });
    return versjon ? data : undefined;
}

// Gjeldende behandling bruker siste fordeling, så den vises også før Spleis har beregnet på nytt
export function useGraderteAndreYtelserForPeriode(
    periode: ApiBeregnetPeriode | ApiUberegnetPeriode,
    inntektsforhold: Inntektsforhold,
): ApiGraderteAndreYtelser | undefined {
    const erGjeldendeBehandling = isInCurrentGeneration(periode, inntektsforhold);
    const sisteFordeling = finnGraderteAndreYtelser(useGraderteAndreYtelser(), inntektsforhold);
    const fordelingFraBeregningen = useGraderteAndreYtelserVedVersjon(
        versjonForEldreBehandling(periode, erGjeldendeBehandling),
    );
    if (erGjeldendeBehandling) return sisteFordeling;
    return fordelingFraBeregningen;
}

export function finnGraderteAndreYtelser(
    graderteAndreYtelser: ApiGraderteAndreYtelser[],
    inntektsforhold: Inntektsforhold,
): ApiGraderteAndreYtelser | undefined {
    const { yrkesaktivitet, organisasjonsnummer } = tilYrkesaktivitet(inntektsforhold);
    return graderteAndreYtelser.find(
        (it) => it.yrkesaktivitet === yrkesaktivitet && (it.organisasjonsnummer ?? null) === organisasjonsnummer,
    );
}

export function tilYrkesaktivitet(inntektsforhold: Inntektsforhold): Yrkesaktivitet {
    return isArbeidsgiver(inntektsforhold)
        ? {
              yrkesaktivitet: ApiYrkesaktivitetstype.ARBEIDSTAKER,
              organisasjonsnummer: inntektsforhold.organisasjonsnummer,
          }
        : { yrkesaktivitet: ApiYrkesaktivitetstype.SELVSTENDIG, organisasjonsnummer: null };
}

function versjonForEldreBehandling(
    periode: ApiBeregnetPeriode | ApiUberegnetPeriode,
    erGjeldendeBehandling: boolean,
): string | null {
    if (erGjeldendeBehandling || !isBeregnetPeriode(periode)) return null;
    return periode.graderteAndreYtelserVersjon ?? null;
}
