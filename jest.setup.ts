import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as mockRouter from 'next-router-mock';
import ReactModal from 'react-modal';

dayjs.extend(isSameOrAfter);

require('jest-axe/extend-expect');
require('@testing-library/jest-dom');

ReactModal.setAppElement(document.createElement('div'));

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
