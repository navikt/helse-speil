import React from 'react';
import { Varsler } from './Varsler';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { RecoilRoot } from 'recoil';
import { varslerState } from '../state/varsler';
import { Varseltype } from '@navikt/helse-frontend-varsel';

describe('Varsler', () => {
    test('rendrer alle varslerState fra state', () => {
        render(
            <RecoilRoot
                initializeState={({ set }) => {
                    set(varslerState, [
                        {
                            key: 'test',
                            type: Varseltype.Info,
                            message: 'Dette er et infovarsel',
                        },
                        {
                            key: 'test',
                            type: Varseltype.Feil,
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
