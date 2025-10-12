import type {
    OpenAPIObject,
    OperationObject,
    ParameterObject,
    PathItemObject,
    PathsObject,
    ReferenceObject,
} from 'openapi3-ts/oas30';
import { defineConfig } from 'orval';

const erstattÆØÅ = (text: string): string =>
    text
        .replace(/æ/g, 'ae')
        .replace(/Æ/g, 'Ae')
        .replace(/ø/g, 'oe')
        .replace(/Ø/g, 'Oe')
        .replace(/å/g, 'aa')
        .replace(/Å/g, 'Aa');

const erstattÆØÅIParametere = (
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

function erstattÆØÅIPathItem(pathItem: PathItemObject): PathItemObject {
    const endretPathItem: PathItemObject = { ...pathItem };

    if (endretPathItem.parameters) {
        endretPathItem.parameters = erstattÆØÅIParametere(endretPathItem.parameters);
    }

    const metoder: (keyof PathItemObject)[] = ['get', 'put', 'post', 'patch', 'delete', 'options', 'head', 'trace'];
    for (const metode of metoder) {
        const operasjon = endretPathItem[metode] as OperationObject | undefined;
        if (operasjon) {
            const endretOperasjon: OperationObject = { ...operasjon };
            if (endretOperasjon.parameters) {
                endretOperasjon.parameters = erstattÆØÅIParametere(endretOperasjon.parameters);
            }
            endretPathItem[metode] = endretOperasjon;
        }
    }

    return endretPathItem;
}

export default defineConfig({
    spesialist: {
        input: {
            target: 'http://localhost:8080/api/openapi.json',
            override: {
                transformer: (api: OpenAPIObject) => {
                    const endredePaths: PathsObject = {};
                    for (const [path, item] of Object.entries(api.paths)) {
                        // Endre fra /api/* til /api/spesialist/*
                        const speilPath = path.replace(/^\/api\//, '/api/spesialist/');
                        // Erstatt ÆØÅ i paths siden Orval ikke takler det
                        const pathUtenÆØÅ = erstattÆØÅ(speilPath);
                        endredePaths[pathUtenÆØÅ] = erstattÆØÅIPathItem(item);
                    }
                    return { ...api, paths: endredePaths };
                },
            },
        },
        output: {
            mode: 'tags-split',
            target: 'src/io/rest/generated/spesialist.ts',
            client: 'react-query',
            override: {
                query: {
                    // Oppførselen vi er vant med fra Apollo-cachen - caches uendelig når man gjør samme kall,
                    // frem til man rendrer uten kallet, eller frem til man refetcher eller evicter
                    options: {
                        staleTime: Infinity,
                        gcTime: 0,
                    },
                },
                mutator: {
                    // Overstyring for å sørge for at arrayer i queryparametere blir riktig
                    path: 'src/app/axios/orval-mutator.ts',
                    name: 'callCustomAxios',
                },
            },
            mock: false,
        },
        hooks: {
            // Kjør prettier på alle genererte filer etter generering
            afterAllFilesWrite: 'prettier --write',
        },
    },
});
