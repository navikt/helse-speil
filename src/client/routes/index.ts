export const routeForMiljø = (route: string) =>
    process.env.NODE_ENV === 'github_pages' ? `/helse-speil${route}` : route;

export const Routes = {
    Oversikt: routeForMiljø('/'),
    Saksbilde: routeForMiljø('/*/:aktorId'),
    SaksbildeV2: routeForMiljø('/v2/:aktorId'),
    Uatutorisert: routeForMiljø('/uautorisert'),
    TildelingTest: routeForMiljø('/boomer'),
};
