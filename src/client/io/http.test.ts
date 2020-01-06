import { fetchPerson } from './http';
import '@testing-library/jest-dom/extend-expect';

const globalAny: any = global;

afterEach(() => {
    globalAny.fetch = undefined;
});

test('behandlinger funnet', async () => {
    globalAny.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
            status: 200,
            json: () => {
                return Promise.resolve('yup');
            }
        });
    });
    const response = await fetchPerson('12345');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ data: 'yup', status: 200 });
});

test('behandlinger ikke funnet', async () => {
    globalAny.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
            status: 404,
            json: () => {
                return Promise.resolve();
            }
        });
    });
    const response = await fetchPerson('12345').catch(err => {
        expect(err).toEqual({
            message: undefined,
            statusCode: 404
        });
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response).toEqual(undefined);
});
