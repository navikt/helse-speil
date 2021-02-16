import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Personlinje } from './Personlinje';
import { Person } from 'internal-types';
import { MemoryRouter } from 'react-router';
import { anonymiserPersonState } from '../state/person';
import { RecoilRoot } from 'recoil';

describe('Personlinje', () => {
    test('rendrer personinfo', () => {
        const person = {
            aktørId: '123456789',
            personinfo: {
                fornavn: 'A',
                mellomnavn: 'B',
                etternavn: 'C',
                fnr: '12345678910',
                kjønn: 'mann',
            },
            enhet: {
                id: '123',
                navn: 'Huttiheiti',
            },
        } as Person;
        render(
            <MemoryRouter>
                <RecoilRoot initializeState={({ set }) => set(anonymiserPersonState, false)}>
                    <Personlinje person={person} />
                </RecoilRoot>
            </MemoryRouter>
        );
        expect(screen.getByText('A B C')).toBeVisible();
        expect(screen.getByText('123456 78910')).toBeVisible();
        expect(screen.getByText('123456789')).toBeVisible();
        expect(screen.getByText('Boenhet: 123 (Huttiheiti)')).toBeVisible();
    });
});
