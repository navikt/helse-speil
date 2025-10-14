import { error } from 'console';
import type { WritableAtom } from 'jotai/index';
import React, { PropsWithChildren, ReactElement } from 'react';

import { ApolloLink, Cache, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { MockLink, MockedResponse } from '@apollo/client/testing';
import { apolloCacheConfig, restLink } from '@app/apollo/apolloClient';
import { ApolloWrapper } from '@test-wrappers';
import {
    RenderHookOptions,
    RenderHookResult,
    RenderOptions,
    Screen,
    render,
    renderHook,
    screen,
} from '@testing-library/react';

type ProviderProps = {
    // eslint-disable-next-line
    readonly initialQueries?: Cache.WriteQueryOptions<any, any>[];
    readonly mocks?: MockedResponse[];
    readonly atomValues?: Iterable<readonly [WritableAtom<unknown, [never], unknown>, unknown]>;
};

const errorLoggingLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
            if (extensions?.dontLog) {
                error('[GraphQL error]:' + `Message: ${message},` + `Location: ${locations},` + `Path: ${path}`);
            }
        });
    }

    if (networkError) {
        error(`[Network error]: ${networkError}`);
    }
});

const AllTheProviders = ({
    children,
    mocks,
    initialQueries,
    atomValues,
}: PropsWithChildren<ProviderProps>): ReactElement => {
    const mockLink = new MockLink(mocks ?? []);
    const link = ApolloLink.from([errorLoggingLink, restLink, mockLink]);

    const cache = new InMemoryCache(apolloCacheConfig);
    initialQueries?.forEach((it) => cache.writeQuery(it));

    return (
        <ApolloWrapper link={link} mocks={mocks} cache={cache} atomValues={atomValues}>
            {children}
        </ApolloWrapper>
    );
};

function customRender(
    ui: ReactElement,
    options: Omit<RenderOptions, 'wrapper'> & ProviderProps = {},
): ReturnType<typeof render> {
    const { initialQueries, mocks, atomValues, ...renderOptions } = options;

    return render(ui, {
        wrapper: (props) => (
            <AllTheProviders {...props} initialQueries={initialQueries} mocks={mocks} atomValues={atomValues} />
        ),
        ...renderOptions,
    });
}

function customRenderHook<Result, Props>(
    render: (initialProps: Props) => Result,
    options: Omit<RenderHookOptions<Props>, 'wrapper'> & ProviderProps = {},
): RenderHookResult<Result, Props> {
    const { initialQueries, mocks, atomValues, ...renderOptions } = options;

    return renderHook(render, {
        wrapper: (props) => (
            <AllTheProviders {...props} initialQueries={initialQueries} mocks={mocks} atomValues={atomValues} />
        ),
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
