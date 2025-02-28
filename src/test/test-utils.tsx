import React, { PropsWithChildren, ReactElement } from 'react';
import { MutableSnapshot } from 'recoil';

import { logger } from '@/logger';
import { ApolloLink, Cache, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { MockLink, MockedProvider, MockedResponse } from '@apollo/client/testing';
import { apolloCacheConfig, restLink } from '@app/apollo/apolloClient';
import { RecoilWrapper } from '@test-wrappers';
import { RenderHookResult, RenderOptions, Screen, render, renderHook, screen } from '@testing-library/react';

type ProviderProps = {
    // eslint-disable-next-line
    readonly initialQueries?: Cache.WriteQueryOptions<any, any>[];
    readonly mocks?: MockedResponse[];
    readonly state?: (mutableSnapshot: MutableSnapshot) => void;
};

const errorLoggingLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
            if (extensions?.dontLog) {
                logger.error('[GraphQL error]:' + `Message: ${message},` + `Location: ${locations},` + `Path: ${path}`);
            }
        });
    }

    if (networkError) {
        logger.error(`[Network error]: ${networkError}`);
    }
});

const AllTheProviders = ({
    children,
    mocks,
    initialQueries,
    state,
}: PropsWithChildren<ProviderProps>): ReactElement => {
    const mockLink = new MockLink(mocks ?? []);
    const link = ApolloLink.from([errorLoggingLink, restLink, mockLink]);

    const cache = new InMemoryCache(apolloCacheConfig);
    initialQueries?.forEach((it) => cache.writeQuery(it));

    return (
        <MockedProvider link={link} mocks={mocks} cache={cache}>
            <RecoilWrapper initializeState={state}>{children}</RecoilWrapper>
        </MockedProvider>
    );
};

function customRender(
    ui: ReactElement,
    options: Omit<RenderOptions, 'wrapper'> & ProviderProps = {},
): ReturnType<typeof render> {
    const { initialQueries, mocks, state, ...renderOptions } = options;

    return render(ui, {
        wrapper: (props) => <AllTheProviders {...props} initialQueries={initialQueries} mocks={mocks} state={state} />,
        ...renderOptions,
    });
}

function customRenderHook<Result, Props>(
    render: (initialProps: Props) => Result,
    options: Omit<RenderOptions, 'wrapper'> & ProviderProps = {},
): RenderHookResult<Result, Props> {
    const { initialQueries, mocks, state, ...renderOptions } = options;

    return renderHook(render, {
        wrapper: (props) => <AllTheProviders {...props} initialQueries={initialQueries} mocks={mocks} state={state} />,
        ...renderOptions,
    });
}

async function openPlayground(screen: Screen): Promise<void> {
    screen.logTestingPlaygroundURL();
}

const customScreen = {
    ...screen,
    openPlayground: () => openPlayground(screen),
};

export * from './apollo-utils';
export * from '@testing-library/react';
export { customRender as render, customRenderHook as renderHook, customScreen as screen };
