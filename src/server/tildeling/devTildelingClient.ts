export default {
    postTildeling: async (): Promise<any> =>
        Math.random() < 0.5
            ? Promise.resolve()
            : Promise.reject({
                  feilkode: 409,
                  kildesystem: 'mockSpesialist',
                  kontekst: {
                      tildeltTil: 'Saksbehandler Frank',
                  },
              }),
    fjernTildeling: async (): Promise<any> => (Math.random() < 1 ? Promise.resolve() : Promise.reject()),
};
