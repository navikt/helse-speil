import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { personState } from '@state/person';

import { Personlinje } from './Personlinje';
import { RecoilAndRouterWrapper } from '@test-wrappers';

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
            <Personlinje aktørId="123456789" enhet={{ id: '123', navn: 'Huttiheiti' }} dødsdato={person.dødsdato} />,
            {
                wrapper: ({ children }) => (
                    <RecoilAndRouterWrapper
                        initializeState={({ set }) => {
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
                        {children}
                    </RecoilAndRouterWrapper>
                ),
            }
        );
        expect(screen.getByText('Høiby, Marius Borg', { exact: false })).toBeVisible();
        expect(screen.getByText('123456 78910')).toBeVisible();
        expect(screen.getByText('123456789')).toBeVisible();
        expect(screen.getByText('Boenhet: 123 (Huttiheiti)')).toBeVisible();
    });
});
