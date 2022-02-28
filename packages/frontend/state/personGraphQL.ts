import { selector, selectorFamily, useRecoilValue } from 'recoil';

import { fetchPerson, Person } from '@io/graphql';

class Cache<T> {
    private current: T | null = null;

    setData = (data: T): void => {
        this.current = data;
    };

    getData = (): T | null => {
        return this.current;
    };
}

const cache = new Cache<Person>();

export const currentPerson = selector<Person | null>({
    key: 'currentPerson',
    get: () => {
        return cache.getData();
    },
});

export const fetchedPerson = selectorFamily<Person | null, string>({
    key: 'fetchedPerson',
    get: (id: string) => () => {
        return fetchPerson(id).then((res) => {
            const person = res.person ?? null;
            if (person) {
                cache.setData(person);
            }
            return person;
        });
    },
});

export const useFetchedPerson = (personId: string): Person | null => {
    return useRecoilValue(fetchedPerson(personId));
};

export const useCurrentPerson = (): Person | null => {
    return useRecoilValue(currentPerson);
};
