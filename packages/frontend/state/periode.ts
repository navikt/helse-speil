import { useParams } from 'react-router-dom';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import { useQuery } from '@apollo/client';
import { FetchPersonDocument, Periodetilstand } from '@io/graphql';
import { isBeregnetPeriode, isPerson, isUberegnetVilkarsprovdPeriode } from '@utils/typeguards';

const activePeriodIdState = atom<string | null>({
    key: 'activePeriodIdState',
    default: null,
});

export const useSetActivePeriodId = () => useSetRecoilState(activePeriodIdState);
export const useActivePeriod = (): ActivePeriod | null => {
    const { aktorId } = useParams<{ aktorId: string }>();
    const { data } = useQuery(FetchPersonDocument, { variables: { aktorId }, skip: !aktorId });
    const activePeriodId = useRecoilValue(activePeriodIdState);

    if (data === undefined || !isPerson(data?.person)) {
        return null;
    }

    const activPeriodFraId =
        data.person.arbeidsgivere
            .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner.flatMap((generasjon) => generasjon.perioder))
            .find((periode) => periode.id === activePeriodId) ?? null;

    if (activPeriodFraId !== null) return activPeriodFraId;

    const allePerioderINyesteGenerasjon = data.person.arbeidsgivere.flatMap((arbeidsgiver) => {
        if (arbeidsgiver.generasjoner.length > 0) {
            return arbeidsgiver.generasjoner[0].perioder;
        }
        return [];
    });

    const aktuellePerioder = allePerioderINyesteGenerasjon
        .sort((a, b) => new Date(b.fom).getTime() - new Date(a.fom).getTime())
        .filter(
            (period) =>
                (isBeregnetPeriode(period) || isUberegnetVilkarsprovdPeriode(period)) &&
                period.periodetilstand !== Periodetilstand.TilInfotrygd,
        );

    return (
        aktuellePerioder.find(
            (periode) =>
                (isBeregnetPeriode(periode) &&
                    periode.periodetilstand === Periodetilstand.TilGodkjenning &&
                    typeof periode.oppgave?.id === 'string') ||
                (isUberegnetVilkarsprovdPeriode(periode) &&
                    periode.periodetilstand === Periodetilstand.TilSkjonnsfastsettelse),
        ) ??
        aktuellePerioder[0] ??
        null
    );
};
