import request from 'request-promise-native';

export default {
    feilregistrerNotat: async (speilToken: string, vedtaksperiodeId: string, notatId: string): Promise<any> => {
        const options = {
            uri: `http://localhost:9001/api/notater/${vedtaksperiodeId}/feilregistrer/${notatId}`,
            resolveWithFullResponse: true,
            json: false,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };
        return request.put(options);
    },
};
