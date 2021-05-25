import { Person, Tildeling, Vedtaksperiode } from 'internal-types';
import { atom, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { fetchPerson } from '../io/http';
import { mapPerson } from '../mapping/person';

import { useInnloggetSaksbehandler } from './authentication';
import { aktivPeriodeState } from './tidslinje';

interface PersonState {
    problems?: Error[];
    person?: Person;
}

const hentPerson = (id: string): Promise<PersonState> =>
    fetchPerson(id)
        .then(async ({ data }) => ({ ...mapPerson(data.person) }))
        .catch((error) => {
            switch (error.statusCode) {
                case 404:
                    throw Error('Personen har ingen utbetalinger i NAV Sykepenger');
                case 401:
                    throw Error('Du må logge inn for å utføre søk');
                default:
                    console.error(error);
                    throw Error('Kunne ikke utføre søket. Prøv igjen senere');
            }
        });

export const personState = atom<PersonState | undefined>({
    key: 'personState',
    default: undefined,
});

const tildelingState = atom<Tildeling | undefined>({
    key: 'tildelingState',
    default: undefined,
});

// Avgjør om tilstand i frontend skal overstyre tilstand as of backend
const frontendOverstyrerTildelingState = atom<boolean>({
    key: 'frontendOverstyrerTildeling',
    default: false,
});

const loadingPersonState = atom<boolean>({
    key: 'loadingPersonState',
    default: false,
});

export const anonymiserPersonState = atom<boolean>({
    key: 'anonymiserPersonState',
    default: false,
});

export const useAnonymiserPerson = () => useSetRecoilState(anonymiserPersonState);
export const useSkalAnonymiserePerson = () => useRecoilValue(anonymiserPersonState);

export const useTildelPerson = () => {
    const setTildeling = useSetRecoilState(tildelingState);
    const setFrontendOverstyrerTildeling = useSetRecoilState(frontendOverstyrerTildelingState);
    const saksbehandler = useInnloggetSaksbehandler();
    return {
        tildelPerson: (påVent?: boolean) => {
            setFrontendOverstyrerTildeling(true);
            setTildeling({ saksbehandler: { ...saksbehandler }, påVent: påVent ?? false });
        },
        fjernTildeling: () => {
            setFrontendOverstyrerTildeling(true);
            setTildeling(undefined);
        },
    };
};

export const usePersonPåVent = () => {
    const { tildelPerson } = useTildelPerson();
    return (påVent: boolean) => tildelPerson(påVent);
};

export const usePerson = () => {
    const person = useRecoilValue(personState)?.person;
    const tildeling = useRecoilValue(tildelingState);
    const frontendOverstyrerTildeling = useRecoilValue(frontendOverstyrerTildelingState);
    return (
        person && {
            ...person,
            tildeling: frontendOverstyrerTildeling ? tildeling : person.tildeling,
        }
    );
};

export const useRefreshPerson = () => {
    const setPerson = useSetRecoilState(personState);
    const person = useRecoilValue(personState)?.person;

    return () => {
        if (person?.aktørId) {
            hentPerson(person.aktørId).then((res) => setPerson(res));
        }
    };
};

export const useHentPerson = () => {
    const setPerson = useSetRecoilState(personState);
    const setLoadingPerson = useSetRecoilState(loadingPersonState);
    const resetAktivPeriode = useResetRecoilState(aktivPeriodeState);
    const resetTildeling = useResetRecoilState(tildelingState);
    const resetFrontendOverstyrerTildeling = useResetRecoilState(frontendOverstyrerTildelingState);

    return (id: string) => {
        resetTildeling();
        resetFrontendOverstyrerTildeling();
        resetAktivPeriode();
        setPerson(undefined);
        setLoadingPerson(true);
        return hentPerson(id)
            .then((res) => {
                setPerson(res);
                return res;
            })
            .finally(() => setLoadingPerson(false));
    };
};

export const useSykepengegrunnlag = (beregningId: string) => {
    return (usePerson()
        ?.arbeidsgivere.flatMap((a) => a.vedtaksperioder)
        .find((v) => v.beregningIder?.find((id) => id === beregningId)) as Vedtaksperiode)?.vilkår?.sykepengegrunnlag;
};

export const useIsLoadingPerson = () => useRecoilValue(loadingPersonState);
