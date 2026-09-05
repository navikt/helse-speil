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

// Default AxiosResponse to prevent React Query "Query data cannot be undefined" warning
export const defaultAxiosResponse = {
    data: [],
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { headers: {} },
};

type MockFn = ReturnType<typeof vi.fn>;
type CustomAxiosMock = MockFn & {
    get: MockFn;
    delete: MockFn;
    head: MockFn;
    options: MockFn;
    post: MockFn;
    put: MockFn;
    patch: MockFn;
};

function createCustomAxiosMock(): CustomAxiosMock {
    const mockFn = vi.fn() as unknown as CustomAxiosMock;
    mockFn.get = vi.fn();
    mockFn.delete = vi.fn();
    mockFn.head = vi.fn();
    mockFn.options = vi.fn();
    mockFn.post = vi.fn();
    mockFn.put = vi.fn();
    mockFn.patch = vi.fn();
    return mockFn;
}

const customAxiosMock = createCustomAxiosMock();

vi.mock('@app/axios/axiosClient', () => ({
    customAxios: customAxiosMock,
}));

// Node 26 deaktiverer localStorage som eksperimentell global. Vi setter opp en in-memory mock
// slik at kode som bruker localStorage fungerer i testmiljøet.
if (typeof localStorage === 'undefined' || localStorage === null) {
    const store: Record<string, string> = {};
    const localStorageMock: Storage = {
        getItem: (key) => store[key] ?? null,
        setItem: (key, value) => {
            store[key] = String(value);
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            Object.keys(store).forEach((key) => delete store[key]);
        },
        get length() {
            return Object.keys(store).length;
        },
        key: (index) => Object.keys(store)[index] ?? null,
    };
    Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });
}

beforeEach(() => {
    vi.clearAllMocks();
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
