import request from 'request-promise-native';

export default {
    leggPåVent: async (speilToken: string, oppgavereferanse: string): Promise<any> =>
        request.post(`http://localhost:9001/api/leggpåvent/${oppgavereferanse}`),

    fjernPåVent: async (speilToken: string, oppgavereferanse: string): Promise<any> =>
        request.delete(`http://localhost:9001/api/leggpåvent/${oppgavereferanse}`),
};
