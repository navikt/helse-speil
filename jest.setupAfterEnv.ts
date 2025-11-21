import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isoWeek from 'dayjs/plugin/isoWeek';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'jest-axe/extend-expect';
import * as mockRouter from 'next-router-mock';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';

import { customAxios } from '@app/axios/axiosClient';
import '@testing-library/jest-dom';

dayjs.extend(relativeTime);
dayjs.extend(minMax);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);
dayjs.locale('nb');

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

beforeEach(() => {
    (customAxios.get as jest.Mock).mockReset();
    (customAxios.delete as jest.Mock).mockReset();
    (customAxios.head as jest.Mock).mockReset();
    (customAxios.options as jest.Mock).mockReset();
    (customAxios.post as jest.Mock).mockReset();
    (customAxios.put as jest.Mock).mockReset();
    (customAxios.patch as jest.Mock).mockReset();
    (customAxios as unknown as jest.Mock).mockReset();
});
