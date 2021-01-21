import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { VedtaksstatusBanner } from './VedtaksstatusBanner';
import { toastsState } from '../state/toastsState';
import { vedtaksstatusToastKey } from '../routes/oversikt/VedtaksstatusToast';

describe('VedtaksstatusBanner', () => {
    test('unmountes når den timer ut', async () => {
        render(
            <RecoilRoot
                initializeState={({ set }) => {
                    const cleanup = () => set(toastsState, []);
                    set(toastsState, [
                        {
                            key: vedtaksstatusToastKey,
                            timeToLiveMs: 0,
                            message: 'Et vedtak',
                            callback: cleanup,
                        },
                    ]);
                }}
            >
                <VedtaksstatusBanner />
            </RecoilRoot>
        );
        expect(screen.getByText('Et vedtak')).toBeVisible();
        await waitFor(() => {
            expect(screen.queryByText('Et vedtak')).toBeNull();
        });
    });
});
