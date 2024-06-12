import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { ActivePeriod } from '@/types/shared';
import { Maybe, Periodetilstand, PersonFragment } from '@io/graphql';
import { useCurrentPerson, useFetchPersonQuery } from '@person/query';
import { raise } from '@utils/ts';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

const activePeriodIdState = atom<string | null>({
    key: 'activePeriodId',
    default: null,
});

export const useSetActivePeriodId = () => {
    const { data } = useFetchPersonQuery();
    const [activePeriodId, setActivePeriodId] = useRecoilState(activePeriodIdState);

    return (periodeId: string) => {
        if (activePeriodId === periodeId) return;
        const periode = findPeriod(periodeId, data?.person ?? raise('Kan ikke aktivere periode uten person'));
        if (!periode) return;
        setActivePeriodId(periode.id);
    };
};

export const useActivePeriod = (): ActivePeriod | null => {
    const person = useCurrentPerson();
    const activePeriodId = useRecoilValue(activePeriodIdState);
    const periodToSelect = person ? findPeriodToSelect(person) : null;

    if (!person) return null;

    return findPeriod(activePeriodId, person) ?? periodToSelect;
};

export const useActivePeriodWithPerson = (person: PersonFragment) => {
    const activePeriodId = useRecoilValue(activePeriodIdState);
    const periodToSelect = person ? findPeriodToSelect(person) : null;

    return findPeriod(activePeriodId, person) ?? periodToSelect;
};

export const useSelectPeriod = () => {
    const setActivePeriodId = useSetRecoilState(activePeriodIdState);
    return (person: PersonFragment) => {
        const periodToSelect = findPeriodToSelect(person);
        if (periodToSelect) {
            setActivePeriodId(periodToSelect.id);
        }
    };
};

const findPeriodToSelect = (person: PersonFragment): Maybe<ActivePeriod> => {
    const perioderINyesteGenerasjoner = person.arbeidsgivere.flatMap(
        (arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [],
    );
    const aktuellePerioder = perioderINyesteGenerasjoner
        .sort((a, b) => new Date(b.fom).getTime() - new Date(a.fom).getTime())
        .filter(
            (period) =>
                (isBeregnetPeriode(period) || isUberegnetPeriode(period)) &&
                period.periodetilstand !== Periodetilstand.TilInfotrygd,
        );

    const periodeTilBehandling = aktuellePerioder.find(
        (periode) =>
            isBeregnetPeriode(periode) &&
            periode.periodetilstand === Periodetilstand.TilGodkjenning &&
            typeof periode.oppgave?.id === 'string',
    );
    return periodeTilBehandling ?? aktuellePerioder[0] ?? null;
};

const findPeriod = (periodeId: string | null, person: PersonFragment) => {
    if (periodeId == null) return null;

    return (
        person?.arbeidsgivere
            .flatMap((arbeidsgiver) => [
                ...arbeidsgiver.generasjoner.flatMap((generasjon) => generasjon.perioder),
                ...arbeidsgiver.ghostPerioder,
            ])
            .find((periode) => periode.id === periodeId) ?? null
    );
};
