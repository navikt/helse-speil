import { useEffect } from 'react';
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { Periodetilstand } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useOpptegnelser } from '@state/opptegnelser';
import { useCurrentPerson } from '@state/person';
import { isBeregnetPeriode, isUberegnetVilkarsprovdPeriode } from '@utils/typeguards';

const activePeriodIdState = atom<string | null>({
    key: 'activePeriodId',
    default: null,
});

export const useSetActivePeriodId = () => {
    const person = useCurrentPerson();
    const [activePeriodId, setActivePeriodId] = useRecoilState(activePeriodIdState);

    return (periodeId: string) => {
        const periode = findPeriod(periodeId, person);
        if (activePeriodId === periode || !periode) return;
        setActivePeriodId(periode.id);
    };
};

export const useActivePeriod = (): ActivePeriod | null => {
    const person = useCurrentPerson();
    const activePeriodId = useRecoilValue(activePeriodIdState);
    useSelectInitialPeriod();
    useUnsetActivePeriodOnNewPerson();
    useSelectInitialPeriodOnOppgaveChanged();
    return activePeriodId ? findPeriod(activePeriodId, person) : null;
};

const useSelectInitialPeriodOnOppgaveChanged = () => {
    const person = useCurrentPerson();
    const opptegnelse = useOpptegnelser();
    const setActivePeriodId = useSetRecoilState(activePeriodIdState);
    const saksbehandler = useInnloggetSaksbehandler();
    if (!opptegnelse || !person || saksbehandler.ident !== 'N115007') return;

    const perioderINyesteGenerasjoner = person.arbeidsgivere.flatMap(
        (arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [],
    );

    const periodeTilBehandling = perioderINyesteGenerasjoner.find(
        (periode) => isBeregnetPeriode(periode) && typeof periode.oppgave?.id === 'string',
    );
    if (!periodeTilBehandling) return;
    setActivePeriodId(periodeTilBehandling.id);
};

const useSelectInitialPeriod = () => {
    const person = useCurrentPerson();
    const [activePeriodId, setActivePeriodId] = useRecoilState(activePeriodIdState);

    useEffect(() => {
        if (!person || activePeriodId) return;
        const perioderINyesteGenerasjoner = person.arbeidsgivere.flatMap(
            (arbeidsgiver) => arbeidsgiver.generasjoner[0]?.perioder ?? [],
        );
        const aktuellePerioder = perioderINyesteGenerasjoner
            .sort((a, b) => new Date(b.fom).getTime() - new Date(a.fom).getTime())
            .filter(
                (period) =>
                    (isBeregnetPeriode(period) || isUberegnetVilkarsprovdPeriode(period)) &&
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
        setActivePeriodId((periodeTilBehandling ?? aktuellePerioder[0] ?? null)?.id);
    }, [person, activePeriodId]);
};

const useUnsetActivePeriodOnNewPerson = () => {
    const person = useCurrentPerson();
    const [activePeriodId, setActivePeriodId] = useRecoilState(activePeriodIdState);
    useEffect(() => {
        if (person && activePeriodId && !findPeriod(activePeriodId, person)) {
            setActivePeriodId(null);
        }
    }, [person, activePeriodId]);
};

const findPeriod = (periodeId: string, person: FetchPersonQuery['person']) =>
    person?.arbeidsgivere
        .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner)
        .flatMap((generasjon) => generasjon.perioder)
        .find((periode) => periode.id === periodeId) ?? null;
