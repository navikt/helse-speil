import React from 'react';
import { Faresignaler } from './Faresignaler';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { Person, Vedtaksperiode } from 'internal-types';
import { mappetPerson } from 'test-data';

export const personMedFaresignaler = async (arbeidsuførhetvurdering: string[]): Promise<Person> => {
    const person = await mappetPerson();
    return {
        ...person,
        arbeidsgivere: [
            {
                ...person.arbeidsgivere[0],
                vedtaksperioder: [
                    {
                        ...person.arbeidsgivere[0].vedtaksperioder[0],
                        risikovurdering: {
                            ufullstendig: false,
                            arbeidsuførhetvurdering: arbeidsuførhetvurdering,
                        },
                    },
                ],
            },
        ],
    };
};

enum TestId {
    faresignalerOppdaget = 'faresignaler-oppdaget',
    faresignalerKontrollert = 'faresignaler-kontrollert',
}

describe('Faresignaler', () => {
    it('faresignaler-oppdaget', async () => {
        const person = await personMedFaresignaler(['Går alltid med solbriller', 'Spiser aldri lunsj']);
        renderFaresignaler(person);
        expect(screen.queryByTestId(TestId.faresignalerOppdaget)).toBeVisible();
        expect(screen.queryByTestId(TestId.faresignalerKontrollert)).toBeVisible();
    });
});

export const renderFaresignaler = (person: Person) =>
    render(<Faresignaler vedtaksperiode={person.arbeidsgivere[0].vedtaksperioder[0] as Vedtaksperiode} />);
