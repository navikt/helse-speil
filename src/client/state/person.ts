import { Person } from 'internal-types';
import { atom, selector, useRecoilValue, useRecoilValueLoadable, useResetRecoilState, useSetRecoilState } from 'recoil';
import { fetchPerson, getPersoninfo } from '../io/http';
import { mapPerson } from '../mapping/person';
import { aktivVedtaksperiodeIdState } from './vedtaksperiode';

interface PersonState {
    problems?: Error[];
    person?: Person;
}

const hentPerson = (id: string): Promise<PersonState> =>
    fetchPerson(id)
        .then(async ({ data }) => {
            const personinfo =
                data.person.personinfo.kjønn === null
                    ? await getPersoninfo(data.person.aktørId).then(({ data }) => data)
                    : undefined;
            return { ...mapPerson(data.person, personinfo) };
        })
        .catch((error) => {
            console.log('error', error);
            switch (error.statusCode) {
                case 404:
                    throw Error('Personen har ingen utbetalinger i NAV Sykepenger');
                case 401:
                    throw Error('Du må logge inn for å utføre søk');
                default:
                    throw Error('Kunne ikke utføre søket. Prøv igjen senere');
            }
        });

const personTilBehandlingState = atom<string | undefined>({
    key: 'personTilBehandlingState',
    default: undefined,
});

export const personState = selector<PersonState>({
    key: 'personState',
    get: ({ get }) => {
        const personTilBehandling = get(personTilBehandlingState);
        return personTilBehandling ? hentPerson(personTilBehandling) : {};
    },
});

export const useTildelPerson = () => {
    // const setPerson = useSetRecoilState(personState);
    // return (id: string) => setPerson((it) => ({ ...it, person: it.person && { ...it.person, tildeltTil: id } }));
};

export const usePerson = () => useRecoilValue(personState).person;

export const useHentPerson = () => {
    const setPerson = useSetRecoilState(personTilBehandlingState);
    const resetAktivVedtaksperiode = useResetRecoilState(aktivVedtaksperiodeIdState);
    return (id: string) => {
        setPerson(id);
        resetAktivVedtaksperiode();
    };
};

export const useIsLoadingPerson = () => useRecoilValueLoadable(personState).state === 'loading';
