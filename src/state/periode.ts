import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { Maybe, Periodetilstand, PersonFragment } from '@io/graphql';
import { useCurrentPerson, useFetchPersonQuery } from '@state/person';
import { ActivePeriod } from '@typer/shared';
import { raise } from '@utils/ts';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

const activePeriodIdState = atom<Maybe<string>>({
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

/**
 * @deprecated Use useActivePeriods instead
 */
export const useActivePeriodOld = (): Maybe<ActivePeriod> => {
    const person = useCurrentPerson();
    const activePeriodId = useRecoilValue(activePeriodIdState);
    const periodToSelect = person ? findPeriodToSelect(person) : null;

    if (!person) return null;

    return findPeriod(activePeriodId, person) ?? periodToSelect;
};

export const useActivePeriod = (person: PersonFragment): Maybe<ActivePeriod> => {
    const activePeriodId = useRecoilValue(activePeriodIdState);
    const periodToSelect = person ? findPeriodToSelect(person) : null;

    if (!person) return null;

    return findPeriod(activePeriodId, person) ?? periodToSelect;
};

export const useActivePeriodWithPerson = (person: PersonFragment): Maybe<ActivePeriod> => {
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

const findPeriod = (periodeId: Maybe<string>, person: PersonFragment) => {
    if (periodeId == null) return null;

    return (
        person?.arbeidsgivere
            .flatMap((arbeidsgiver) => [
                ...arbeidsgiver.generasjoner.flatMap((generasjon) => generasjon.perioder),
                ...arbeidsgiver.ghostPerioder,
                ...arbeidsgiver.nyeInntektsforholdPerioder,
            ])
            .find((periode) => periode.id === periodeId) ?? null
    );
};
