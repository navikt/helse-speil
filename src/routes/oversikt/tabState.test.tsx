import { Provider } from 'jotai';
import React from 'react';

import { render, screen } from '@testing-library/react';

import { useAktivTab } from './tabState';

describe('tabState', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    // Fanen leses fra sessionStorage når atomet mountes. Alle komponenter må få med seg verdien, også de som
    // abonnerer etter at den er satt. Ellers viser f.eks. fanen «Mine oppgaver» mens lista viser Til godkjenning.
    it('gir lagret fane til alle komponenter i en ny store', () => {
        sessionStorage.setItem('tabState', JSON.stringify('mine'));

        render(
            <Provider>
                <VisAktivTab testId="a" />
                <VisAktivTab testId="b" />
                <VisAktivTab testId="c" />
            </Provider>,
        );

        expect(screen.getByTestId('a')).toHaveTextContent('mine');
        expect(screen.getByTestId('b')).toHaveTextContent('mine');
        expect(screen.getByTestId('c')).toHaveTextContent('mine');
    });
});

function VisAktivTab({ testId }: { testId: string }) {
    return <span data-testid={testId}>{useAktivTab()}</span>;
}
