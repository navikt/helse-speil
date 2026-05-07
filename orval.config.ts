// noinspection ES6PreferShortImport
import { spesialistOpenAPITransformer, sporhundOpenAPITransformer } from './src/io/rest/spesialist-openapi-transformer';
import { defineConfig } from 'orval';

const sharedOutput = {
    mode: 'tags-split',
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
} as const;

const sharedHooks = {
    // Kjør prettier på alle genererte filer etter generering
    afterAllFilesWrite: 'prettier --write',
};

export default defineConfig({
    spesialist: {
        input: {
            target: 'http://localhost:8080/api/openapi.json',
            override: {
                transformer: spesialistOpenAPITransformer,
            },
        },
        output: {
            ...sharedOutput,
            target: 'src/io/rest/generated/spesialist.ts',
        },
        hooks: sharedHooks,
    },
    sporhund: {
        input: {
            target: 'http://localhost:8282/api/openapi.json',
            override: {
                transformer: sporhundOpenAPITransformer,
            },
        },
        output: {
            ...sharedOutput,
            target: 'src/io/rest/generated/sporhund.ts',
        },
        hooks: sharedHooks,
    },
});
