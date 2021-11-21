import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { RecoilRoot } from 'recoil';

import { persondataSkalAnonymiseres, personState } from '../state/person';

import { Personlinje } from './Personlinje';

describe('Personlinje', () => {
    test('rendrer personinfo', () => {
        const person = {
            aktørId: '123456789',
            personinfo: {
                fornavn: 'MARIUS',
                mellomnavn: 'BORG',
                etternavn: 'HØIBY',
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
                <RecoilRoot
                    initializeState={({ set }) => {
                        set(persondataSkalAnonymiseres, false);
                        set(personState, {
                            person: {
                                ...person,
                                vilkårsgrunnlagHistorikk: {},
                                arbeidsgivereV2: [],
                                arbeidsforhold: [],
                            },
                        });
                    }}
                >
                    <Personlinje dødsdato={person.dødsdato} />
                </RecoilRoot>
            </MemoryRouter>
        );
        expect(screen.getByText('Høiby, Marius Borg', { exact: false })).toBeVisible();
        expect(screen.getByText('123456 78910')).toBeVisible();
        expect(screen.getByText('123456789')).toBeVisible();
        expect(screen.getByText('Boenhet: 123 (Huttiheiti)')).toBeVisible();
    });
});
