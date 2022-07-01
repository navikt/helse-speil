import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import React from 'react';

import { ErrorAlert, InfoAlert } from '@utils/error';
import { varslerState } from '@state/varsler';

import { Varsler } from './Varsler';

describe('Varsler', () => {
    test('rendrer alle varsler fra state', () => {
        render(
            <RecoilRoot
                initializeState={({ set }) => {
                    set(varslerState, [
                        new InfoAlert('Dette er et infovarsel'),
                        new ErrorAlert('Dette er et feilvarsel'),
                    ]);
                }}
            >
                <Varsler />
            </RecoilRoot>,
        );
        expect(screen.getByText('Dette er et infovarsel')).toBeVisible();
        expect(screen.getByText('Dette er et feilvarsel')).toBeVisible();
    });
});
