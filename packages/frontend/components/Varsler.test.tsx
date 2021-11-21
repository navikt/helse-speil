import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { RecoilRoot } from 'recoil';

import { varslerState } from '../state/varsler';

import { Varsler } from './Varsler';

describe('Varsler', () => {
    test('rendrer alle varslerState fra state', () => {
        render(
            <RecoilRoot
                initializeState={({ set }) => {
                    set(varslerState, [
                        {
                            key: 'test',
                            type: 'info',
                            message: 'Dette er et infovarsel',
                        },
                        {
                            key: 'test',
                            type: 'feil',
                            message: 'Dette er et feilvarsel',
                        },
                    ]);
                }}
            >
                <Varsler />
            </RecoilRoot>
        );
        expect(screen.getByText('Dette er et infovarsel')).toBeVisible();
        expect(screen.getByText('Dette er et feilvarsel')).toBeVisible();
    });
});
