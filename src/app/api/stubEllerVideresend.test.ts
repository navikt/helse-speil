import { NextRequest } from 'next/server';

import { lagStubEllerVideresend } from '@app/api/stubEllerVideresend';

// Testmiljøet kjører med backend 'mock'.
describe('lagStubEllerVideresend', () => {
    it('videresender uten å laste stubben når backend ikke er stubbet', async () => {
        const videresend = vi.fn(async () => new Response('videresendt'));
        const lastStub = vi.fn();
        const handler = lagStubEllerVideresend({ stubbetFor: ['lokal'], videresend, forsinkelse: false })(lastStub);

        const request = new NextRequest('http://localhost/api/test');
        const response = await handler(request, { params: Promise.resolve({}) });

        expect(await response.text()).toBe('videresendt');
        expect(videresend).toHaveBeenCalledWith(request);
        expect(lastStub).not.toHaveBeenCalled();
    });

    it('laster og kaller stubben når backend er stubbet', async () => {
        const videresend = vi.fn();
        const stub = vi.fn(async () => new Response('stubbet'));
        const lastStub = vi.fn(async () => stub);
        const handler = lagStubEllerVideresend({ stubbetFor: ['mock'], videresend, forsinkelse: false })<{
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
