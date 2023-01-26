export default {
    overstyrDager: async (): Promise<any> => (Math.random() > 0.05 ? Promise.resolve() : Promise.reject('Dev-feil!')),
    overstyrInntekt: async (): Promise<any> => (Math.random() > 0.05 ? Promise.resolve() : Promise.reject('Dev-feil!')),
    overstyrInntektOgRefusjon: async (): Promise<any> =>
        Math.random() > 0.05 ? Promise.resolve() : Promise.reject('Dev-feil!'),
    overstyrArbeidsforhold: async (): Promise<any> =>
        Math.random() > 0.05 ? Promise.resolve() : Promise.reject('Dev-feil!'),
};
