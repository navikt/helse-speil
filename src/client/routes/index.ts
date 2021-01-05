export const routeForMiljø = (route: string) =>
    process.env.NODE_ENV === 'github_pages' ? `/helse-speil${route}` : route;

export const Routes = {
    Oversikt: routeForMiljø('/'),
    Utbetalingshistorikk: routeForMiljø('/person/:aktorId/utbetalingshistorikk'),
    Saksbilde: routeForMiljø('/person/:aktorId'),
    Uatutorisert: routeForMiljø('/uautorisert'),
    TildelingTest: routeForMiljø('/boomer'),
    OpptengelseTest: routeForMiljø('/remoob'),
};
