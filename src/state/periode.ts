'use client';

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { usePathname } from 'next/navigation';

import { ApiPeriodetilstand, ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { ActivePeriod } from '@typer/shared';
import { raise } from '@utils/ts';
import { isArbeidsgiver, isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';
import { erPåSideUtenAktivPeriode } from '@utils/undersider';

const activePeriodIdState = atom<string | null>(null);

export const useSetActivePeriodId = (person: ApiSaksbildePerson) => {
    const [activePeriodId, setActivePeriodId] = useAtom(activePeriodIdState);

    return (periodeId: string) => {
        if (activePeriodId === periodeId) return;
        const periode = findPeriod(periodeId, person ?? raise('Kan ikke aktivere periode uten person'));
        if (!periode) return;
        setActivePeriodId(periode.id);
    };
};

export const useSetActivePeriodIdUtenPerson = () => {
    const [activePeriodId, setActivePeriodId] = useAtom(activePeriodIdState);

    return (periodeId: string) => {
        if (activePeriodId === periodeId) return;
        setActivePeriodId(periodeId);
    };
};

export const useActivePeriod = (person: ApiSaksbildePerson | null): ActivePeriod | null => {
    const activePeriodId = useAtomValue(activePeriodIdState);
    const pathname = usePathname();
    const erUtenAktivPeriode = erPåSideUtenAktivPeriode(pathname);

    if (erUtenAktivPeriode || !person) return null;

    return findPeriod(activePeriodId, person) ?? findPeriodToSelect(person);
};

export const useActivePeriodWithPerson = (person: ApiSaksbildePerson): ActivePeriod | null => useActivePeriod(person);

// siste periode brukeren har klikket på i tidslinjen
export const useSistValgtePeriode = (person: ApiSaksbildePerson | null): ActivePeriod | null =>
    findPeriod(useAtomValue(activePeriodIdState), person);

export const useSelectPeriod = () => {
    const setActivePeriodId = useSetAtom(activePeriodIdState);
    return (person: ApiSaksbildePerson) => {
        const periodToSelect = findPeriodToSelect(person);
        if (periodToSelect) {
            setActivePeriodId(periodToSelect.id);
        }
    };
};

const findPeriodToSelect = (person: ApiSaksbildePerson): ActivePeriod | null => {
    const perioderINyesteBehandlinger = finnAlleInntektsforhold(person)
        .flatMap((inntektsforhold) => inntektsforhold.behandlinger[0]?.perioder ?? [])
        .filter((periode) => isUberegnetPeriode(periode) || isBeregnetPeriode(periode));

    const aktuellePerioder = perioderINyesteBehandlinger
        .sort((a, b) => new Date(b.fom).getTime() - new Date(a.fom).getTime())
        .filter(
            (period) =>
                (isBeregnetPeriode(period) || isUberegnetPeriode(period)) &&
                period.periodetilstand !== ApiPeriodetilstand.TilInfotrygd,
        );

    const venteperioder = perioderINyesteBehandlinger
        .sort((a, b) => new Date(a.fom).getTime() - new Date(b.fom).getTime())
        .filter((period) => venterTilstander.includes(period.periodetilstand));

    const periodeTilBehandling = aktuellePerioder.find((periode) =>
        tilBehandlingTilstander.includes(periode.periodetilstand),
    );

    return periodeTilBehandling ?? venteperioder[0] ?? aktuellePerioder[0] ?? null;
};

const findPeriod = (periodeId: string | null, person: ApiSaksbildePerson | null) => {
    if (periodeId == null || person == null) return null;

    return (
        finnAlleInntektsforhold(person)
            .flatMap((arbeidsgiver) => {
                const perioder = arbeidsgiver.behandlinger
                    .flatMap((behandling) => behandling.perioder)
                    .filter((periode) => isUberegnetPeriode(periode) || isBeregnetPeriode(periode));
                const ghostPerioder = (isArbeidsgiver(arbeidsgiver) ? arbeidsgiver.ghostPerioder : []).filter(
                    isGhostPeriode,
                );
                return [...perioder, ...ghostPerioder];
            })
            .find((periode) => periode.id === periodeId) ?? null
    );
};

const tilBehandlingTilstander: ApiPeriodetilstand[] = [
    ApiPeriodetilstand.TilGodkjenning,
    ApiPeriodetilstand.TilUtbetaling,
];
const venterTilstander: ApiPeriodetilstand[] = [
    ApiPeriodetilstand.VenterPaEnAnnenPeriode,
    ApiPeriodetilstand.UtbetaltVenterPaEnAnnenPeriode,
    ApiPeriodetilstand.AvventerInntektsopplysninger,
    ApiPeriodetilstand.ForberederGodkjenning,
    ApiPeriodetilstand.AvventerAnnullering,
];
