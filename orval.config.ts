// noinspection ES6PreferShortImport
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { defineConfig } from 'orval';

import { decodeComponentKeys } from '@io/rest/componentKeys';
import {
    spesialistOpenAPITransformer,
    sporhundOpenAPITransformer,
    vilkarsprovingOpenAPITransformer,
} from '@io/rest/openapi-transformer';

const sharedOutput = {
    mode: 'tags-split',
    client: 'react-query',
    httpClient: 'fetch',
    // Otherwise v8 writes an index.ts to the output folder, which the three projects would overwrite for each other
    indexFiles: false,
    override: {
        query: {
            queryOptions: {
                path: 'src/io/rest/defaultQueryOptions.ts',
                name: 'withDefaultQueryOptions',
            },
        },
        fetch: {
            // Return data directly instead of { data, status, headers }
            includeHttpResponseReturnType: false,
            // Throw on non-2xx responses (Error & { info, status }) instead of returning the error body as data
            forceSuccessResponse: true,
            // Repeat array query parameters instead of adding [] to the name
            arrayFormat: 'repeat',
        },
    },
    mock: false,
} as const;

const sharedHooks = {
    // Restore ÆØÅ in type names (see componentKeys.ts), then run prettier on all generated files
    afterAllFilesWrite: [restoreNorwegianCharacters, 'prettier --write'],
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
    vilkarsproving: {
        input: {
            target: 'http://localhost:8181/api/openapi.json',
            override: {
                transformer: vilkarsprovingOpenAPITransformer,
            },
        },
        output: {
            ...sharedOutput,
            target: 'src/io/rest/generated/vilkarsproving.ts',
        },
        hooks: sharedHooks,
    },
});

async function restoreNorwegianCharacters(paths: unknown) {
    const files = (await Promise.all((paths as string[]).map(findTsFiles))).flat();
    for (const file of files) {
        const content = await readFile(file, 'utf8');
        const restored = decodeComponentKeys(content);
        if (restored !== content) await writeFile(file, restored);
    }
}

async function findTsFiles(filePath: string): Promise<string[]> {
    const info = await stat(filePath).catch(() => undefined);
    if (!info) return [];
    if (info.isFile()) return filePath.endsWith('.ts') ? [filePath] : [];
    const entries = await readdir(filePath);
    return (await Promise.all(entries.map((name) => findTsFiles(path.join(filePath, name))))).flat();
}
