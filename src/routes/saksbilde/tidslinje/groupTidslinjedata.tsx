import React from 'react';

import { ArchiveIcon, BriefcaseIcon, SackKronerIcon } from '@navikt/aksel-icons';

import { capitalizeArbeidsgiver } from '@components/Inntektsforholdnavn';
import { useOrganisasjonerQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { harUvurderteVarslerPåPeriode } from '@hooks/uvurderteVarsler';
import { Arbeidsgiver, GhostPeriode, Periode, Sykdomsdagtype, Utbetalingsdagtype } from '@io/graphql';
import { getGetNotaterForVedtaksperiodeQueryOptions } from '@io/rest/generated/notater/notater';
import { ApiTilkommenInntekt, ApiTilkommenInntektskilde } from '@io/rest/generated/spesialist.schemas';
import { PeriodPins } from '@saksbilde/tidslinje/timeline/period/TimelinePeriod';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useQueries } from '@tanstack/react-query';
import { InfotrygdPeriod, PeriodCategory, getPeriodCategory } from '@typer/shared';
import { getPeriodState } from '@utils/mapping';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

export type TidslinjeElement = {
    fom: string;
    tom: string;
    skjæringstidspunkt?: string;
    behandlingId?: string;
    status: PeriodCategory;
    periode?: Periode;
    ghostPeriode?: GhostPeriode;
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
};

const isArbeidsgiver = (f: Inntektsforhold): f is Arbeidsgiver => 'navn' in f;

const getVedtaksperiodeId = (periode: Periode): string | undefined =>
    isBeregnetPeriode(periode) || isUberegnetPeriode(periode) ? periode.vedtaksperiodeId : undefined;

const shouldShowInfoPin = (periode: Periode): boolean => {
    if (!isBeregnetPeriode(periode)) return false;

    return periode.tidslinje.some(
        (dag) =>
            ![Utbetalingsdagtype.Helgedag, Utbetalingsdagtype.Navdag, Utbetalingsdagtype.Navhelgdag].includes(
                dag.utbetalingsdagtype,
            ) || [Sykdomsdagtype.Permisjonsdag].includes(dag.sykdomsdagtype),
    );
};

const getPeriodPins = (periode: Periode, harNotat: boolean): PeriodPins[] => {
    const pins: PeriodPins[] = [];
    if (harUvurderteVarslerPåPeriode(periode)) pins.push('warning');
    if (shouldShowInfoPin(periode)) pins.push('info');
    if (harNotat) pins.push('notat');
    return pins;
};

export function useTidslinjeRader(
    inntektsforhold: Inntektsforhold[],
    infotrygdPeriods: InfotrygdPeriod[],
    tilkomneInntektskilder: ApiTilkommenInntektskilde[],
) {
    const allPerioder = inntektsforhold.flatMap((forhold) =>
        forhold.behandlinger.flatMap((behandling) => behandling.perioder),
    );
    const uniqueVedtaksperiodeIds = [
        ...new Set(allPerioder.map(getVedtaksperiodeId).filter((id): id is string => id !== undefined)),
    ];

    const notatQueries = useQueries({
        queries: uniqueVedtaksperiodeIds.map((id) => getGetNotaterForVedtaksperiodeQueryOptions(id)),
    });

    const vedtaksperiodeIdsWithNotat = new Set(
        notatQueries
            .map((q, index) => ({ data: q.data, vedtaksperiodeId: uniqueVedtaksperiodeIds[index] }))
            .filter((q) => q.data?.some((notat) => notat.type === 'Generelt'))
            .map((q) => q.vedtaksperiodeId),
    );

    const orgnumre = tilkomneInntektskilder.map((k) => k.organisasjonsnummer);
    const { navnMap, isLoading: isLoadingOrgNames } = useOrganisasjonerQuery(orgnumre);

    const isLoading = notatQueries.some((q) => q.isLoading) || isLoadingOrgNames;

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
            ? forhold.ghostPerioder.map((ghostPeriode: GhostPeriode) => ({
                  fom: ghostPeriode.fom,
                  tom: ghostPeriode.tom,
                  skjæringstidspunkt: ghostPeriode.skjaeringstidspunkt,
                  status: ghostPeriode.deaktivert ? 'ghostDeaktivert' : 'ghost',
                  ghostPeriode,
                  generasjonIndex: 0,
              }))
            : [];

        return {
            id: index,
            navn: isArbeidsgiver(forhold) ? capitalizeArbeidsgiver(forhold.navn) : 'Selvstendig næring',
            icon: <BriefcaseIcon aria-hidden className="text-ax-text-neutral" fontSize="1.5rem" />,
            tidslinjeElementer: [...behandlingElements, ...ghostElements].sort((a, b) => a.fom.localeCompare(b.fom)),
        };
    });

    const infotrygdRad: TidslinjeRad = {
        id: 'infotrygd',
        navn: 'Infotrygd',
        icon: <ArchiveIcon aria-hidden className="text-ax-text-neutral" fontSize="1.5rem" />,
        tidslinjeElementer: infotrygdPeriods.map((periode) => ({
            fom: periode.fom,
            tom: periode.tom,
            status: getPeriodCategory(getPeriodState(periode)) ?? 'ukjent',
            infotrygdPeriode: periode,
            generasjonIndex: 0,
        })),
    };

    const tilkommenRader: TidslinjeRad[] = tilkomneInntektskilder.map((inntektskilde) => ({
        id: inntektskilde.organisasjonsnummer,
        navn: capitalizeArbeidsgiver(
            navnMap.get(inntektskilde.organisasjonsnummer) ?? inntektskilde.organisasjonsnummer,
        ),
        icon: <SackKronerIcon aria-hidden fontSize="1.5rem" />,
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

    return { arbeidsgiverRader, infotrygdRad, tilkommenRader, isLoading };
}
