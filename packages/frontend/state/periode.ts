import { useEffect } from 'react';
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { Maybe, Periodetilstand } from '@io/graphql';
import { useCurrentPerson } from '@state/person';
import { isBeregnetPeriode, isUberegnetPeriode, isUberegnetVilkarsprovdPeriode } from '@utils/typeguards';

const activePeriodIdState = atom<string | null>({
    key: 'activePeriodId',
    default: null,
});

export const useSetActivePeriodId = () => {
    const person = useCurrentPerson();
    const [activePeriodId, setActivePeriodId] = useRecoilState(activePeriodIdState);

    return (periodeId: string) => {
        if (activePeriodId === periodeId) return;
        const periode = findPeriod(periodeId, person);
        if (!periode) return;
        setActivePeriodId(periode.id);
    };
};

export const useActivePeriod = (): ActivePeriod | null => {
    const person = useCurrentPerson();
    const activePeriodId = useRecoilValue(activePeriodIdState);
    const setActivePeriodId = useSetRecoilState(activePeriodIdState);
    const periodToSelect = person ? findPeriodToSelect(person) : null;
    useEffect(() => {
        if (periodToSelect && activePeriodId === null) {
            setActivePeriodId(periodToSelect.id);
        }
        const lastSelectedPeriod = findPeriod(activePeriodId!, person);
        if (lastSelectedPeriod === null) setActivePeriodId(null);
    }, [periodToSelect]);
    if (!person) return null;
    return findPeriod(activePeriodId!, person) ?? periodToSelect;
};

export const useSelectPeriod = () => {
    const setActivePeriodId = useSetRecoilState(activePeriodIdState);
    return (person: FetchedPerson) => {
        const periodToSelect = findPeriodToSelect(person);
        periodToSelect && setActivePeriodId(periodToSelect.id);
    };
};

const findPeriodToSelect = (person: FetchedPerson): Maybe<ActivePeriod> => {
    const perioderINyesteGenerasjoner = person.arbeidsgivere.flatMap(
        (arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [],
    );
    const aktuellePerioder = perioderINyesteGenerasjoner
        .sort((a, b) => new Date(b.fom).getTime() - new Date(a.fom).getTime())
        .filter(
            (period) =>
                (isBeregnetPeriode(period) || isUberegnetVilkarsprovdPeriode(period) || isUberegnetPeriode(period)) &&
                period.periodetilstand !== Periodetilstand.TilInfotrygd,
        );

    const periodeTilBehandling = aktuellePerioder.find(
        (periode) =>
            (isBeregnetPeriode(periode) &&
                periode.periodetilstand === Periodetilstand.TilGodkjenning &&
                typeof periode.oppgave?.id === 'string') ||
            (isUberegnetVilkarsprovdPeriode(periode) &&
                periode.periodetilstand === Periodetilstand.TilSkjonnsfastsettelse),
    );
    return periodeTilBehandling ?? aktuellePerioder[0] ?? null;
};

const findPeriod = (periodeId: string, person: FetchPersonQuery['person']) =>
    person?.arbeidsgivere
        .flatMap((arbeidsgiver) => [
            ...arbeidsgiver.generasjoner.flatMap((generasjon) => generasjon.perioder),
            ...arbeidsgiver.ghostPerioder,
        ])
        .find((periode) => periode.id === periodeId) ?? null;
