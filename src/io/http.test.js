import { behandlingerFor } from './http';
import '@testing-library/jest-dom/extend-expect';

afterEach(() => {
    global.fetch = undefined;
});

test('behandlinger funnet', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
            status: 200,
            json: () => {
                return Promise.resolve('yup');
            }
        });
    });
    const response = await behandlingerFor(12345);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ data: 'yup', status: 200 });
});

test('behandlinger ikke funnet', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
            status: 404,
            json: () => {
                return Promise.resolve();
            }
        });
    });
    const response = await behandlingerFor(12345).catch(err => {
        expect(err).toEqual({
            message: undefined,
            statusCode: 404
        });
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toEqual(undefined);
});
