export default {
    postVedtak: async (): Promise<any> => (Math.random() > 0 ? Promise.resolve() : Promise.reject('Dev-feil!')),
};
