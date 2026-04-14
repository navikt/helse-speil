export const getStub = async (_request: Request) => {
    return Response.json({
        erStanset: false,
        årsaker: [], // [ApiVeilederStansÅrsak.MANGLENDE_MEDVIRKING],
        tidspunkt: null, // '2026-04-14T09:06:30.090206',
    });
};

export const patchStub = async (_request: Request) => {
    return Response.json({ status: 200 });
};
