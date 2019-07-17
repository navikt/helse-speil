import { behandlingerFor } from '../../src/io/http';
import 'jest-dom/extend-expect';

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
                return Promise.resolve('nope...');
            }
        });
    });
    const response = await behandlingerFor(12345);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toEqual({
        data: `Fant ingen behandlinger for 12345`,
        status: 404
    });
});
