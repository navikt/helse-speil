import { useParams } from 'next/navigation';
import React from 'react';

import { BriefcaseIcon, SackKronerIcon } from '@navikt/aksel-icons';

import { capitalizeArbeidsgiver } from '@components/Inntektsforholdnavn';
import { useOrganisasjonerQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { harUvurderteVarslerPåPeriode } from '@hooks/uvurderteVarsler';
import { useGetNotatVedtaksperiodeIderForPerson } from '@io/rest/generated/notater/notater';
import {
    ApiArbeidsgiver,
    ApiGhostPeriode,
    ApiPeriode,
    ApiSykdomsdagtype,
    ApiTilkommenInntekt,
    ApiTilkommenInntektskilde,
    ApiUtbetalingsdagtype,
} from '@io/rest/generated/spesialist.schemas';
import { PeriodPins } from '@saksbilde/tidslinje/timeline/period/TimelinePeriod';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { InfotrygdPeriod, PeriodCategory, getPeriodCategory } from '@typer/shared';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

export type TidslinjeElement = {
    fom: string;
    tom: string;
    skjæringstidspunkt?: string;
    behandlingId?: string;
    status: PeriodCategory;
    periode?: ApiPeriode;
    ghostPeriode?: ApiGhostPeriode;
    infotrygdPeriode?: InfotrygdPeriod;
    tilkommenInntekt?: ApiTilkommenInntekt;
    periodPins?: PeriodPins[];
    generasjonIndex: number;
};

export type TidslinjeRad = {
    id: string | number;
    navn: string;
    icon: React.ReactElement;
    tidslinjeElementer: TidslinjeElement[];
    organisasjonsnummer?: string;
};

const isArbeidsgiver = (f: Inntektsforhold): f is ApiArbeidsgiver => 'navn' in f;

const getVedtaksperiodeId = (periode: ApiPeriode): string | undefined =>
    isBeregnetPeriode(periode) || isUberegnetPeriode(periode) ? periode.vedtaksperiodeId : undefined;

const shouldShowInfoPin = (periode: ApiPeriode): boolean => {
    if (!isBeregnetPeriode(periode)) return false;

    return periode.tidslinje.some(
        (dag) =>
            !(
                [
                    ApiUtbetalingsdagtype.HELGEDAG,
                    ApiUtbetalingsdagtype.NAVDAG,
                    ApiUtbetalingsdagtype.NAVHELGDAG,
                ] as ApiUtbetalingsdagtype[]
            ).includes(dag.utbetalingsdagtype) ||
            ([ApiSykdomsdagtype.PERMISJONSDAG] as ApiSykdomsdagtype[]).includes(dag.sykdomsdagtype),
    );
};

const getPeriodPins = (periode: ApiPeriode, harNotat: boolean): PeriodPins[] => {
    const pins: PeriodPins[] = [];
    if (harUvurderteVarslerPåPeriode(periode)) pins.push('warning');
    if (shouldShowInfoPin(periode)) pins.push('info');
    if (harNotat) pins.push('notat');
    return pins;
};

export function useTidslinjeRader(
    inntektsforhold: Inntektsforhold[],
    tilkomneInntektskilder: ApiTilkommenInntektskilde[],
) {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: notatVedtaksperiodeIder, isLoading: isLoadingNotater } =
        useGetNotatVedtaksperiodeIderForPerson(personPseudoId);

    const vedtaksperiodeIdsWithNotat = new Set(
        notatVedtaksperiodeIder
            ?.filter((entry) => entry.notattyper.includes('Generelt'))
            .map((entry) => entry.vedtaksperiodeId) ?? [],
    );

    const orgnumre = tilkomneInntektskilder.map((k) => k.organisasjonsnummer);
    const { navnMap, isLoading: isLoadingOrgNames } = useOrganisasjonerQuery(orgnumre);

    const isLoading = isLoadingNotater || isLoadingOrgNames;

    const arbeidsgiverRader: TidslinjeRad[] = inntektsforhold.map((forhold, index) => {
        const behandlingElements: TidslinjeElement[] = forhold.behandlinger.flatMap((behandling, generasjonIndex) =>
            behandling.perioder.map((periode) => {
                const vedtaksperiodeId = getVedtaksperiodeId(periode);
                const harNotat = vedtaksperiodeId ? vedtaksperiodeIdsWithNotat.has(vedtaksperiodeId) : false;

                return {
                    fom: periode.fom,
                    tom: periode.tom,
                    skjæringstidspunkt: periode.skjaeringstidspunkt,
                    behandlingId: periode.behandlingId,
                    status:
                        generasjonIndex === 0 ? (getPeriodCategory(getPeriodState(periode)) ?? 'ukjent') : 'historisk',
                    periode,
                    periodPins: generasjonIndex === 0 ? getPeriodPins(periode, harNotat) : [],
                    generasjonIndex,
                };
            }),
        );

        const ghostElements: TidslinjeElement[] = isArbeidsgiver(forhold)
            ? forhold.ghostPerioder
                  .filter((ghostPeriode: ApiGhostPeriode) => !ghostPeriode.deaktivert)
                  .map((ghostPeriode: ApiGhostPeriode) => ({
                      fom: ghostPeriode.fom,
                      tom: ghostPeriode.tom,
                      skjæringstidspunkt: ghostPeriode.skjaeringstidspunkt,
                      status: 'ghost',
                      ghostPeriode,
                      generasjonIndex: 0,
                  }))
            : [];

        return {
            id: index,
            navn: isArbeidsgiver(forhold) ? capitalizeArbeidsgiver(forhold.navn) : 'Selvstendig næring',
            icon: <BriefcaseIcon aria-hidden className="text-ax-text-neutral" fontSize="1.5rem" />,
            organisasjonsnummer: isArbeidsgiver(forhold) ? forhold.organisasjonsnummer : undefined,
            tidslinjeElementer: [...behandlingElements, ...ghostElements].sort((a, b) => a.fom.localeCompare(b.fom)),
        };
    });

    const tilkommenRader: TidslinjeRad[] = tilkomneInntektskilder.map((inntektskilde) => ({
        id: inntektskilde.organisasjonsnummer,
        navn: capitalizeArbeidsgiver(
            navnMap.get(inntektskilde.organisasjonsnummer) ?? inntektskilde.organisasjonsnummer,
        ),
        icon: <SackKronerIcon aria-hidden fontSize="1.5rem" />,
        organisasjonsnummer: inntektskilde.organisasjonsnummer,
        tidslinjeElementer: inntektskilde.inntekter
            .map((inntekt) => ({
                fom: inntekt.periode.fom,
                tom: inntekt.periode.tom,
                status: (inntekt.fjernet ? 'tilkommen_fjernet' : 'tilkommen') as PeriodCategory,
                tilkommenInntekt: inntekt,
                generasjonIndex: 0,
            }))
            .sort((a, b) => a.fom.localeCompare(b.fom)),
    }));

    return { arbeidsgiverRader, tilkommenRader, isLoading };
}
