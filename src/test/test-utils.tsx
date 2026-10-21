import type { WritableAtom } from 'jotai';
import React, { PropsWithChildren, ReactElement } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JotaiWrapper } from '@test-wrappers';
import { RenderHookOptions, RenderHookResult, RenderOptions, render, renderHook, screen } from '@testing-library/react';

type ProviderProps = {
    readonly atomValues?: Iterable<readonly [WritableAtom<unknown, [never], unknown>, unknown]>;
};

const AllTheProviders = ({ children, atomValues }: PropsWithChildren<ProviderProps>): ReactElement => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    return (
        <QueryClientProvider client={queryClient}>
            <JotaiWrapper atomValues={atomValues}>{children}</JotaiWrapper>
        </QueryClientProvider>
    );
};

function customRender(
    ui: ReactElement,
    options: Omit<RenderOptions, 'wrapper'> & ProviderProps = {},
): ReturnType<typeof render> {
    const { atomValues, ...renderOptions } = options;

    return render(ui, {
        wrapper: (props) => <AllTheProviders {...props} atomValues={atomValues} />,
        ...renderOptions,
    });
}

function customRenderHook<Result, Props>(
    render: (initialProps: Props) => Result,
    options: Omit<RenderHookOptions<Props>, 'wrapper'> & ProviderProps = {},
): RenderHookResult<Result, Props> {
    const { atomValues, ...renderOptions } = options;

    return renderHook(render, {
        wrapper: (props) => <AllTheProviders {...props} atomValues={atomValues} />,
        ...renderOptions,
    });
}

const customScreen = {
    ...screen,
};

export { act, waitFor, within } from '@testing-library/react';
export { customRender as render, customRenderHook as renderHook, customScreen as screen };
