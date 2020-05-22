export default {
    annuller: async (): Promise<any> =>
        Math.random() > 0.5 ? Promise.resolve() : Promise.reject('dev annullering feil'),
};
