import React from 'react';

export const withContextProviders = (Component, contextProviders = []) => {
    return props => {
        return contextProviders.reduce(
            (acc, provider) => React.createElement(provider, null, acc),
            <Component {...props} />
        );
    };
};
