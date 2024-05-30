import { Express } from 'express';

import config from './config';
import flexjarClient from './flexjar/flexjarClient';
import graphQLClient from './graphql/graphQLClient';
import instrumentationModule, { Instrumentation } from './instrumentation';
import modiaClient from './modia/modiaClient';

const getDependencies = (app: Express) => (config.development ? getDevDependencies(app) : getProdDependencies(app));

const getDevDependencies = (app: Express) => {
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _devGraphQLClient = graphQLClient();
    const _devFlexjarClient = flexjarClient();
    const _devModiaClient = modiaClient();
    // Fredet
    6;

    return {
        graphql: { graphQLClient: _devGraphQLClient },
        flexjar: { flexjarClient: _devFlexjarClient },
        modia: { modiaClient: _devModiaClient },
        instrumentation,
    };
};

const getProdDependencies = (app: Express) => {
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _graphQLClient = graphQLClient();
    const _flexjarClient = flexjarClient();
    const _ModiaClient = modiaClient();

    return {
        graphql: { graphQLClient: _graphQLClient },
        flexjar: { flexjarClient: _flexjarClient },
        modia: { modiaClient: _ModiaClient },
        instrumentation,
    };
};

export default { getDependencies };
