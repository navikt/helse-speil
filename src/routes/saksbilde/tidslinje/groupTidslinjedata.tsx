import { ArchiveIcon, BriefcaseIcon, SackKronerIcon } from '@navikt/aksel-icons';

import { capitalizeArbeidsgiver } from '@components/Inntektsforholdnavn';
import { useOrganisasjonerQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { Arbeidsgiver, GhostPeriode, Periode } from '@io/graphql';
import { ApiTilkommenInntekt, ApiTilkommenInntektskilde } from '@io/rest/generated/spesialist.schemas';
import { PeriodCategory, getPeriodCategory } from '@saksbilde/timeline/Period';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { InfotrygdPeriod } from '@typer/shared';
import { getPeriodState } from '@utils/mapping';

type TidslinjeElement = {
    fom: string;
    tom: string;
    skjæringstidspunkt?: string;
    behandlingId?: string;
    status: PeriodCategory;
    periode?: Periode;
    ghostPeriode?: GhostPeriode;
    infotrygdPeriode?: InfotrygdPeriod;
    tilkommenInntekt?: ApiTilkommenInntekt;
    generasjonIndex: number;
};

export function groupTidslinjeData(inntektsforhold: Inntektsforhold[], infotrygdPeriods: InfotrygdPeriod[]) {
    const arbeidsgiverRader = inntektsforhold.map((forhold, index) => {
        const isArbeidsgiver = (f: Inntektsforhold): f is Arbeidsgiver => 'navn' in f;

        const behandlingElements: TidslinjeElement[] = forhold.behandlinger.flatMap((behandling, generasjonIndex) =>
            behandling.perioder.map((periode) => ({
                fom: periode.fom,
                tom: periode.tom,
                skjæringstidspunkt: periode.skjaeringstidspunkt,
                behandlingId: periode.behandlingId,
                status: generasjonIndex === 0 ? (getPeriodCategory(getPeriodState(periode)) ?? 'ukjent') : 'historisk',
                periode: periode,
                generasjonIndex,
            })),
        );

        const ghostElements: TidslinjeElement[] = isArbeidsgiver(forhold)
            ? forhold.ghostPerioder.map((ghostPeriode: GhostPeriode) => ({
                  fom: ghostPeriode.fom,
                  tom: ghostPeriode.tom,
                  skjæringstidspunkt: ghostPeriode.skjaeringstidspunkt,
                  status: 'ghost',
                  ghostPeriode: ghostPeriode,
                  generasjonIndex: 0,
              }))
            : [];

        const tidslinjeElementer = [...behandlingElements, ...ghostElements].sort((a, b) => a.fom.localeCompare(b.fom));

        return {
            id: index,
            navn: isArbeidsgiver(forhold) ? capitalizeArbeidsgiver(forhold.navn) : 'Selvstendig næring',
            icon: <BriefcaseIcon aria-hidden className="text-ax-text-neutral" fontSize="1.5rem" />,
            tidslinjeElementer,
        };
    });
    return {
        arbeidsgiverRader,
        infotrygdRad: {
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
        },
    };
}

export function useTilkomneInntekterRader(tilkomneInntektskilder: ApiTilkommenInntektskilde[]) {
    const orgnumre = tilkomneInntektskilder.map((k) => k.organisasjonsnummer);
    const { navnMap, isLoading } = useOrganisasjonerQuery(orgnumre);

    const tilkommenRader = tilkomneInntektskilder.map((inntektskilde) => ({
        id: inntektskilde.organisasjonsnummer,
        navn: capitalizeArbeidsgiver(
            navnMap.get(inntektskilde.organisasjonsnummer) ?? inntektskilde.organisasjonsnummer,
        ),
        icon: <SackKronerIcon aria-hidden fontSize="1.5rem" />,
        tidslinjeElementer: inntektskilde.inntekter
            .map((inntekt) => ({
                fom: inntekt.periode.fom,
                tom: inntekt.periode.tom,
                status: (inntekt.fjernet ? 'neutral' : 'plus') as PeriodCategory,
                tilkommenInntekt: inntekt,
                generasjonIndex: 0,
            }))
            .sort((a, b) => a.fom.localeCompare(b.fom)),
    }));

    return { tilkommenRader, isLoading };
}
