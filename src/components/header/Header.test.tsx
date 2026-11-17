import mockRouter from 'next-router-mock';
import { Mock } from 'vitest';

import { ApiBrukerrolle } from '@io/rest/generated/spesialist.schemas';
import { useFetchPersonQuery } from '@state/person';
import { act, render, screen, waitFor } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { fetchMock, jsonResponse } from '../../../vitest.setup';
import { Header } from './Header';

vi.mock('@state/person');

const vedtaksperiodeId = 'b5b7a8e4-1c55-4c4a-9d6e-3c1f0b7a2a11';

beforeEach(() => {
    mockRouter.setCurrentUrl('/');
    (useFetchPersonQuery as Mock).mockReturnValue({});
});

describe('Header', () => {
    it.each([ApiBrukerrolle.COACH, ApiBrukerrolle.SUPERSAKSBEHANDLER])(
        'lar %s søke på vedtaksperiodeId i spoogle',
        async (brukerrolle) => {
            await renderHeaderFor([brukerrolle]);

            await søkPåVedtaksperiodeId();

            await waitFor(() => expect(kallTilSpoogle()).toHaveLength(1));
            expect(String(kallTilSpoogle()[0]![0])).toEqual(`/api/spoogle/sok/${vedtaksperiodeId}`);
        },
    );

    it('bruker vanlig personsøk for andre saksbehandlere', async () => {
        await renderHeaderFor([ApiBrukerrolle.BESLUTTER]);

        await søkPåVedtaksperiodeId();

        expect(kallTilSpoogle()).toHaveLength(0);
    });
});

async function renderHeaderFor(brukerroller: ApiBrukerrolle[]) {
    mockBruker(brukerroller);
    render(<Header />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/spesialist/bruker', expect.anything()));
    // Søkefeltet byttes når brukerrollene er lastet, så svaret må være behandlet før vi skriver i det.
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
}

function mockBruker(brukerroller: ApiBrukerrolle[]) {
    fetchMock.mockImplementation((input) =>
        Promise.resolve(
            String(input) === '/api/spesialist/bruker'
                ? jsonResponse({ brukerroller, tilganger: ['LES'] })
                : jsonResponse(undefined, 404),
        ),
    );
}

async function søkPåVedtaksperiodeId() {
    await userEvent.type(screen.getByRole('searchbox', { name: 'Søk' }), vedtaksperiodeId);
    await userEvent.click(screen.getByRole('button', { name: 'Søk' }));
}

function kallTilSpoogle() {
    return fetchMock.mock.calls.filter(([input]) => String(input).startsWith('/api/spoogle/'));
}
