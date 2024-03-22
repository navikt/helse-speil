import { Express } from 'express';

import devOnBehalfOf from './auth/devOnBehalfOf';
import onBehalfOf from './auth/onBehalfOf';
import config from './config';
import flexjarClient from './flexjar/flexjarClient';
import graphQLClient from './graphql/graphQLClient';
import instrumentationModule, { Instrumentation } from './instrumentation';

const getDependencies = (app: Express) => (config.development ? getDevDependencies(app) : getProdDependencies(app));

const getDevDependencies = (app: Express) => {
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _devGraphQLClient = graphQLClient(devOnBehalfOf);
    const _devFlexjarClient = flexjarClient(devOnBehalfOf);
    // Fredet
    6;

    return {
        graphql: { graphQLClient: _devGraphQLClient },
        flexjar: { flexjarClient: _devFlexjarClient },
        instrumentation,
    };
};

const getProdDependencies = (app: Express) => {
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _onBehalfOf = onBehalfOf(instrumentation);
    const _graphQLClient = graphQLClient(_onBehalfOf);
    const _flexjarClient = flexjarClient(_onBehalfOf);

    return {
        graphql: { graphQLClient: _graphQLClient },
        flexjar: { flexjarClient: _flexjarClient },
        instrumentation,
    };
};

export default { getDependencies };
