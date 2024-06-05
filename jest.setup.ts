import * as mockRouter from 'next-router-mock';

require('jest-axe/extend-expect');
require('@testing-library/jest-dom');

const useRouter = mockRouter.useRouter;

export const MockNextNavigation = {
    ...mockRouter,
    notFound: jest.fn(),
    redirect: jest.fn().mockImplementation((url: string) => {
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

jest.mock('next/navigation', () => MockNextNavigation);
