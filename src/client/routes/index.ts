export const routeForMiljø = (route: string) =>
    process.env.NODE_ENV === 'github_pages' ? `/helse-speil${route}` : route;

export const Routes = {
    Oversikt: routeForMiljø('/'),
    Saksbilde: routeForMiljø('/person/:aktorId'),
    Utbetalingshistorikk: routeForMiljø('/utbetalingshistorikk'),
    Uautorisert: routeForMiljø('/uautorisert'),
    TildelingTest: routeForMiljø('/boomer'),
    OpptegnelseTest: routeForMiljø('/remoob'),
};
