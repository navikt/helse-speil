export default {
    overstyrDager: async (): Promise<any> => (Math.random() > 0.05 ? Promise.resolve() : Promise.reject('Dev-feil!')),
};
