import { JSDOM } from 'jsdom';
import * as mockRouter from 'next-router-mock';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import { beforeEach, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';
import '@utils/dayjs.setup';

process.env.RUNTIME_ENVIRONMENT = 'test';

mockRouter.default.useParser(
    createDynamicRouteParser(['/', '/person/[personPseudoId]', '/person/[personPseudoId]/tilkommen-inntekt']),
);

const useRouter = mockRouter.useRouter;

const MockNextNavigation = {
    ...mockRouter,
    notFound: vi.fn(),
    redirect: vi.fn().mockImplementation((url: string) => {
        mockRouter.memoryRouter.setCurrentUrl(url);
    }),
    usePathname: () => {
        const router = useRouter();
        return router.asPath;
    },
    useSearchParams: () => {
        const router = useRouter();
        const path = router.query;
        return new URLSearchParams(path as never);
    },
    useParams: () => {
        const router = useRouter();
        const path = router.query;
        return path as never;
    },
};

vi.mock('next/navigation', () => MockNextNavigation);

vi.mock('next/image', () => ({
    default: ({
        src,
        alt,
        priority: _priority,
        unoptimized: _unoptimized,
        placeholder: _placeholder,
        blurDataURL: _blurDataURL,
        loader: _loader,
        ...rest
    }: {
        src: string;
        alt: string;
        priority?: unknown;
        unoptimized?: unknown;
        placeholder?: unknown;
        blurDataURL?: unknown;
        loader?: unknown;
        [_: string]: unknown;
    }) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={alt} {...rest} />;
    },
}));

// All HTTP calls go through the global fetch, both the Orval-generated functions and getJson/postJson
export const fetchMock = vi.fn<typeof fetch>();
vi.stubGlobal('fetch', fetchMock);

// Responds to every fetch call with the given JSON body. A new Response is needed per call, since a body can only be read once
export function mockFetchResponse(body: unknown, status = 200) {
    fetchMock.mockImplementation(() => Promise.resolve(jsonResponse(body, status)));
}

export function jsonResponse(body: unknown, status = 200): Response {
    return new Response(body === undefined ? null : JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

// Matches the JSON body of a fetch call against an object, regardless of key order
export function jsonBody(expected: unknown) {
    return {
        asymmetricMatch: (body: unknown) =>
            typeof body === 'string' &&
            JSON.stringify(sortKeys(JSON.parse(body))) ===
                JSON.stringify(sortKeys(JSON.parse(JSON.stringify(expected)))),
        toString: () => 'jsonBody',
        toAsymmetricMatcher: () => `jsonBody(${JSON.stringify(expected)})`,
    };
}

function sortKeys(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(sortKeys);
    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.keys(value)
                .sort()
                .map((key) => [key, sortKeys((value as Record<string, unknown>)[key])]),
        );
    }
    return value;
}

// Node 26 defines an un-writable localStorage getter that defaults to undefined.
// We force-override it with jsdom's isolated localStorage instance.
const dom = new JSDOM('', { url: 'http://localhost/' });

Object.defineProperty(globalThis, 'localStorage', {
    value: dom.window.localStorage,
    writable: true,
    configurable: true,
});

Object.defineProperty(globalThis, 'sessionStorage', {
    value: dom.window.sessionStorage,
    writable: true,
    configurable: true,
});

beforeEach(() => {
    vi.clearAllMocks();
    // Default response to prevent React Query "Query data cannot be undefined" warning
    mockFetchResponse([]);
    localStorage.clear();
});

// TODO: Remove when Apollo/GraphQL is fully phased out
// eslint-disable-next-line no-console
const originalConsoleError = console.error;
// eslint-disable-next-line no-console
console.error = (...args: unknown[]) => {
    const message = typeof args[0] === 'string' ? args[0] : '';
    if (message.includes('canonizeResults') || message.includes('go.apollo.dev')) {
        return;
    }
    originalConsoleError(...args);
};

// Aksel sin <Accordion> logger en dev-warning (med hele DOM-noden/Fiber-treet som argument) når
// den kun har ett Accordion.Item. Dette er en designanbefaling, ikke en testfeil, så vi filtrerer
// bort støyen den skaper i test-output.
// eslint-disable-next-line no-console
const originalConsoleWarn = console.warn;
// eslint-disable-next-line no-console
console.warn = (...args: unknown[]) => {
    if (args[0] === '[Aksel]') {
        return;
    }
    originalConsoleWarn(...args);
};
