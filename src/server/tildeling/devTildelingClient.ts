export default {
    postTildeling: async (): Promise<any> => (Math.random() > 0.5 ? Promise.resolve() : Promise.reject('Dev-feil!')),
    fjernTildeling: async (): Promise<any> => (Math.random() > 0.5 ? Promise.resolve() : Promise.reject('Dev-feil!')),
};
