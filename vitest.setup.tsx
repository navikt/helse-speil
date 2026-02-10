import * as mockRouter from 'next-router-mock';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import { beforeEach, vi } from 'vitest';
import 'vitest-axe/extend-expect';

import '@testing-library/jest-dom/vitest';
import '@utils/dayjs.setup';

process.env.RUNTIME_ENVIRONMENT = 'test';

mockRouter.default.useParser(
    createDynamicRouteParser([
        '/',
        '/person/[personPseudoId]/dagoversikt',
        '/person/[personPseudoId]/inngangsvilkår',
        '/person/[personPseudoId]/sykepengegrunnlag',
        '/person/[personPseudoId]/vurderingsmomenter',
        '/person/[personPseudoId]/tilkommen-inntekt',
    ]),
);

const useRouter = mockRouter.useRouter;

export const MockNextNavigation = {
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
        priority,
        unoptimized,
        fill,
        ...rest
    }: {
        src: string;
        alt: string;
        priority?: boolean;
        unoptimized?: boolean;
        fill?: boolean;
        [_: string]: unknown;
    }) => {
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

// Type for the custom axios mock that includes HTTP method properties
type MockFn = ReturnType<typeof vi.fn>;
interface CustomAxiosMock extends MockFn {
    get: MockFn;
    delete: MockFn;
    head: MockFn;
    options: MockFn;
    post: MockFn;
    put: MockFn;
    patch: MockFn;
}

// Custom mock function that maintains default implementations
const createCustomAxiosMock = (): CustomAxiosMock => {
    const mockFn = vi.fn() as CustomAxiosMock;
    mockFn.get = vi.fn();
    mockFn.delete = vi.fn();
    mockFn.head = vi.fn();
    mockFn.options = vi.fn();
    mockFn.post = vi.fn();
    mockFn.put = vi.fn();
    mockFn.patch = vi.fn();
    return mockFn;
};

const customAxiosMock = createCustomAxiosMock();

vi.mock('@app/axios/axiosClient', () => ({
    customAxios: customAxiosMock,
}));

beforeEach(() => {
    vi.resetAllMocks();
    // Re-apply default implementations after reset
});

// Suppress known console warnings/errors that are not relevant to tests
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
    const message = typeof args[0] === 'string' ? args[0] : '';
    // Suppress Apollo Client canonizeResults deprecation warning
    if (message.includes('canonizeResults') || message.includes('go.apollo.dev')) {
        return;
    }
    originalConsoleError(...args);
};
