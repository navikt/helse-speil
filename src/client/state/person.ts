import { Person } from 'internal-types';
import { atom, useRecoilValue, useRecoilValueLoadable, useResetRecoilState, useSetRecoilState } from 'recoil';
import { fetchPerson } from '../io/http';
import { mapPerson } from '../mapping/person';
import { aktivVedtaksperiodeIdState } from './vedtaksperiode';

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
                    throw Error('Kunne ikke utføre søket. Prøv igjen senere');
            }
        });

export const personTilBehandlingState = atom<string | undefined>({
    key: 'personTilBehandlingState',
    default: undefined,
});

const personHentetSistState = atom<number>({
    key: 'personHentetSistState',
    default: Date.now(),
});

export const useRefreshPerson = () => {
    const setter = useSetRecoilState(personHentetSistState);
    return () => setter(Date.now());
};

export const personState = atom<PersonState | undefined>({
    key: 'personState',
    default: undefined,
});

const tildelingState = atom<string | undefined>({
    key: 'tildelingState',
    default: undefined,
});

const loadingPersonState = atom<boolean>({
    key: 'loadingPersonState',
    default: false,
});

export const useTildelPerson = () => useSetRecoilState(tildelingState);

export const usePerson = () => {
    const person = useRecoilValue(personState)?.person;
    const tildeling = useRecoilValue(tildelingState);
    return (
        person && {
            ...person,
            tildeltTil: person.tildeltTil ?? tildeling,
        }
    );
};

export const useHentPerson = () => {
    const setPerson = useSetRecoilState(personState);
    const setLoadingPerson = useSetRecoilState(loadingPersonState);
    const resetAktivVedtaksperiode = useResetRecoilState(aktivVedtaksperiodeIdState);
    const resetTildeling = useResetRecoilState(tildelingState);

    return (id: string) => {
        resetTildeling();
        resetAktivVedtaksperiode();
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

export const useIsLoadingPerson = () => useRecoilValue(loadingPersonState);
