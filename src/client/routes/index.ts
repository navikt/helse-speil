export const routeForMiljø = (route: string) =>
    process.env.NODE_ENV === 'github_pages' ? `/helse-speil${route}` : route;

export const Routes = {
    Oversikt: routeForMiljø('/'),
    Saksbilde: routeForMiljø('/*/:aktorId'),
    Uatutorisert: routeForMiljø('/uautorisert'),
};
