import { NextRequest } from 'next/server';

import { skalStubbe } from '@app/api/backends';
import { lagStubEllerVideresend } from '@app/api/stubEllerVideresend';

vi.mock('@app/api/backends', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@app/api/backends')>()),
    skalStubbe: vi.fn(),
}));

describe('lagStubEllerVideresend', () => {
    it('videresender uten å laste stubben når backenden ikke skal stubbes', async () => {
        vi.mocked(skalStubbe).mockReturnValue(false);
        const videresend = vi.fn(async () => new Response('videresendt'));
        const lastStub = vi.fn();
        const handler = lagStubEllerVideresend({ backend: 'sporhund', videresend, forsinkelse: false })(lastStub);

        const request = new NextRequest('http://localhost/api/test');
        const response = await handler(request, { params: Promise.resolve({}) });

        expect(await response.text()).toBe('videresendt');
        expect(skalStubbe).toHaveBeenCalledWith('sporhund');
        expect(videresend).toHaveBeenCalledWith(request);
        expect(lastStub).not.toHaveBeenCalled();
    });

    it('laster og kaller stubben når backenden skal stubbes', async () => {
        vi.mocked(skalStubbe).mockReturnValue(true);
        const videresend = vi.fn();
        const stub = vi.fn(async () => new Response('stubbet'));
        const lastStub = vi.fn(async () => stub);
        const handler = lagStubEllerVideresend({ backend: 'sporhund', videresend, forsinkelse: false })<{
            id: string;
        }>(lastStub);

        const request = new NextRequest('http://localhost/api/test');
        const params = Promise.resolve({ id: '1' });
        const response = await handler(request, { params });

        expect(await response.text()).toBe('stubbet');
        expect(stub).toHaveBeenCalledWith(request, params);
        expect(videresend).not.toHaveBeenCalled();
    });
});
