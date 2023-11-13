export const ResponseError = (statusCode: number, message?: string) => ({
    statusCode,
    message,
});

export type SpeilResponse<T = null> = {
    status: number;
    data?: T;
};

type Headers = {
    [key: string]: unknown;
};

const baseUrlGraphQL = (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '') + '/graphql';

const getData = async (response: Response) => {
    try {
        return await response.json();
    } catch (e) {
        return undefined;
    }
};

const getErrorMessage = async (response: Response) => {
    try {
        return await response.text();
    } catch (e) {
        return undefined;
    }
};

const post = async (url: string, data: unknown, headere?: Headers): Promise<SpeilResponse<unknown>> => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            ...headere,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (response.status !== 200 && response.status !== 204) {
        const message = await getErrorMessage(response);

        throw ResponseError(response.status, message);
    }

    return {
        status: response.status,
        data: await getData(response),
    };
};

// GraphQL
export const postGraphQLQuery = async (operation: string) => {
    return post(`${baseUrlGraphQL}`, JSON.parse(operation));
};
