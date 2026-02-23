import type {
    OpenAPIObject,
    OperationObject,
    ParameterObject,
    PathItemObject,
    PathsObject,
    ReferenceObject,
} from 'openapi3-ts/oas30';

const erstattÆØÅ = (text: string): string =>
    text
        .replace(/æ/g, 'ae')
        .replace(/Æ/g, 'Ae')
        .replace(/ø/g, 'oe')
        .replace(/Ø/g, 'Oe')
        .replace(/å/g, 'aa')
        .replace(/Å/g, 'Aa');

const erstattÆØÅIURLParametere = (
    parametere: (ParameterObject | ReferenceObject)[] = [],
): (ParameterObject | ReferenceObject)[] =>
    parametere
        .map((parameter) => parameter as ParameterObject)
        .filter((parameter) => parameter?.in !== undefined)
        .map((parameter) => {
            if (parameter.in === 'path' && typeof parameter.name === 'string') {
                const endretName = erstattÆØÅ(parameter.name);
                return endretName === parameter.name ? parameter : { ...parameter, name: endretName };
            }
            return parameter;
        });

const transformPathItem = (pathItem: PathItemObject): PathItemObject => {
    const endretPathItem: PathItemObject = { ...pathItem };

    if (endretPathItem.parameters) {
        // Erstatt ÆØÅ i URL-parameternavn tilsvarende det som ble gjort på path
        endretPathItem.parameters = erstattÆØÅIURLParametere(endretPathItem.parameters);
    }

    const metoder: (keyof PathItemObject)[] = ['get', 'put', 'post', 'patch', 'delete', 'options', 'head', 'trace'];
    for (const metode of metoder) {
        const operasjon = endretPathItem[metode] as OperationObject | undefined;
        if (operasjon) {
            const endretOperasjon: OperationObject = { ...operasjon };
            // Ta bort security scheme fra hver operasjon, siden det håndteres av OBO-flyten i rutingen
            endretOperasjon.security = undefined;
            if (endretOperasjon.parameters) {
                // Erstatt ÆØÅ i URL-parameternavn tilsvarende det som ble gjort på path
                endretOperasjon.parameters = erstattÆØÅIURLParametere(endretOperasjon.parameters);
            }
            endretPathItem[metode] = endretOperasjon;
        }
    }

    return endretPathItem;
};

export const spesialistOpenAPITransformer = (api: OpenAPIObject): OpenAPIObject => {
    // Ta bort security scheme fra toppen, siden det håndteres av OBO-flyten i rutingen
    let components = api.components;
    if (components) {
        components = { ...components };
        components.securitySchemes = undefined;
    }

    const endredePaths: PathsObject = {};

    for (const [path, item] of Object.entries(api.paths)) {
        // Endre fra /api/* til /api/spesialist/*
        const speilPath = path.replace(/^\/api\//, '/api/spesialist/');
        // Erstatt ÆØÅ i paths siden Orval ikke takler det
        const pathUtenÆØÅ = erstattÆØÅ(speilPath);
        endredePaths[pathUtenÆØÅ] = transformPathItem(item);
    }
    return { ...api, paths: endredePaths, components: components };
};
