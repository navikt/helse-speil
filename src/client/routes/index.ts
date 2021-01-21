export const routeForMiljø = (route: string) =>
    process.env.NODE_ENV === 'github_pages' ? `/helse-speil${route}` : route;

export const Routes = {
    Oversikt: routeForMiljø('/'),
    Saksbilde: routeForMiljø('/person/:aktorId'),
    Utbetalingshistorikk: routeForMiljø('/utbetalingshistorikk'),
    Uatutorisert: routeForMiljø('/uautorisert'),
    TildelingTest: routeForMiljø('/boomer'),
    OpptengelseTest: routeForMiljø('/remoob'),
};
