// noinspection ES6PreferShortImport
import { spesialistOpenAPITransformer } from './src/io/rest/spesialist-openapi-transformer';
import { defineConfig } from 'orval';

export default defineConfig({
    spesialist: {
        input: {
            target: 'http://localhost:8080/api/openapi.json',
            override: {
                transformer: spesialistOpenAPITransformer,
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
