import { Person } from 'internal-types';
import { atom, selector, useSetRecoilState } from 'recoil';
import { fetchPerson, getPersoninfo } from '../io/http';
import { mapPerson } from '../mapping/person';

interface PersonState {
    person: Person;
    problems: Error[];
}

const tildelingState = atom<string | undefined>({
    key: 'tildelingState',
    default: undefined,
});

const personFetchKey = atom<string | undefined>({
    key: 'personFetchKey',
    default: undefined,
});

const remotePersonState = selector<PersonState | undefined>({
    key: 'personState',
    get: ({ get }) => {
        const personTilBehandling = get(personFetchKey);
        return personTilBehandling
            ? fetchPerson(personTilBehandling)
                  .then(async ({ data }) => {
                      const personinfo =
                          data.person.personinfo.kjønn === null
                              ? await getPersoninfo(data.person.aktørId).then(({ data }) => data)
                              : undefined;
                      return mapPerson(data.person, personinfo);
                  })
                  .catch((error) => {
                      switch (error.statusCode) {
                          case 404:
                              throw Error('Personen har ingen utbetalinger i NAV Sykepenger');
                          case 401:
                              throw Error('Du må logge inn for å utføre søk');
                          default:
                              throw Error('Kunne ikke utføre søket. Prøv igjen senere');
                      }
                  })
            : undefined;
    },
});

export const personState = selector<PersonState | undefined>({
    key: 'personState',
    get: async ({ get }) => {
        const personState = await get(remotePersonState);
        const tildeling = get(tildelingState);

        return (
            personState && {
                person: { ...personState.person, tildeltTil: tildeling },
                problems: personState.problems,
            }
        );
    },
});

export const useHentPerson = () => {
    const setKey = useSetRecoilState(personFetchKey);
    const setTildeling = useSetRecoilState(tildelingState);
    return (id: string) => {
        setTildeling(undefined);
        setKey(id);
    };
};

export const useTildelPerson = () => {
    const setTildeling = useSetRecoilState(tildelingState);
    return (id: string) => setTildeling(id);
};
