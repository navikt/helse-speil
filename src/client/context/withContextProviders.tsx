import React from 'react';

export const withContextProviders = (
    Component: React.ComponentType,
    contextProviders: React.FunctionComponent[] = []
) => {
    return (props: React.ComponentProps<any>) => {
        return contextProviders.reduce(
            (acc, provider) => React.createElement(provider, null, acc),
            <Component {...props} />
        );
    };
};
