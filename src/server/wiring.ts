import config from './config';
import redisClient from './redisClient';
import devRedisClient from './devRedisClient';

import instrumentationModule, { Instrumentation } from './instrumentation';
import onBehalfOf from './auth/onBehalfOf';
import devOnBehalfOf from './auth/devOnBehalfOf';
import vedtakClient from './payment/vedtakClient';
import devVedtakClient from './payment/devVedtakClient';
import annulleringClient from './payment/annulleringClient';
import devAnnulleringClient from './payment/devAnnulleringClient';
import spesialistClient from './person/spesialistClient';
import devSpesialistClient from './adapters/devSpesialistClient';
import overstyringClient from './overstyring/overstyringClient';
import devOverstyringClient from './overstyring/devOverstyringClient';
import tildelingClient from './tildeling/tildelingClient';
import devTildelingClient from './tildeling/devTildelingClient';
import dummyClient from './dummy/dummyClient';
import devDummyClient from './dummy/devDummyClient';
import { personClient } from './person/personClient';
import { devPersonClient } from './adapters/devPersonClient';
import opptegnelseClient from './opptegnelse/opptegnelseClient';
import devOpptegnelseClient from './opptegnelse/devOpptegnelseClient';
import devOppgaveClient from './oppgave/devOppgaveClient';
import oppgaveClient from './oppgave/oppgaveClient';

import { Express } from 'express';
import { RedisClient } from 'redis';
import { Helsesjekk } from './types';

const getDependencies = (app: Express, helsesjekk: Helsesjekk) =>
    process.env.NODE_ENV === 'development' ? getDevDependencies(app) : getProdDependencies(app, helsesjekk);

const getDevDependencies = (app: Express) => {
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _devSpesialistClient = devSpesialistClient(instrumentation);
    const _devPersonClient = devPersonClient(instrumentation);
    return {
        person: {
            spesialistClient: _devSpesialistClient,
            personClient: _devPersonClient,
            onBehalfOf: devOnBehalfOf,
            config,
        },
        payments: { vedtakClient: devVedtakClient, annulleringClient: devAnnulleringClient },
        redisClient: devRedisClient,
        overstyring: { overstyringClient: devOverstyringClient },
        tildeling: { tildelingClient: devTildelingClient },
        opptegnelse: { opptegnelseClient: devOpptegnelseClient },
        oppgave: { oppgaveClient: devOppgaveClient },
        dummy: { dummyClient: devDummyClient },
    };
};

const getProdDependencies = (app: Express, helsesjekk: Helsesjekk) => {
    const _redisClient: RedisClient = redisClient.init(config.redis, helsesjekk);
    const instrumentation: Instrumentation = instrumentationModule.setup(app);
    const _onBehalfOf = onBehalfOf(config.oidc, instrumentation);
    const _vedtakClient = vedtakClient(config.oidc, _onBehalfOf);
    const _overstyringClient = overstyringClient(config.oidc, _onBehalfOf);
    const _tildelingClient = tildelingClient(config.oidc, _onBehalfOf);
    const _dummyClient = dummyClient(config.oidc, _onBehalfOf);
    const _annulleringClient = annulleringClient(config, _onBehalfOf);
    const _spesialistClient = spesialistClient(instrumentation);
    const _personClient = personClient(instrumentation, config.oidc, _onBehalfOf);
    const _opptegnelseClient = opptegnelseClient(config.oidc, _onBehalfOf);
    const _oppgaveClient = oppgaveClient(config.oidc, _onBehalfOf);
    return {
        person: {
            spesialistClient: _spesialistClient,
            personClient: _personClient,
            onBehalfOf: _onBehalfOf,
            config,
        },
        payments: { vedtakClient: _vedtakClient, annulleringClient: _annulleringClient },
        redisClient: _redisClient,
        overstyring: { overstyringClient: _overstyringClient },
        tildeling: { tildelingClient: _tildelingClient },
        opptegnelse: { opptegnelseClient: _opptegnelseClient },
        oppgave: { oppgaveClient: _oppgaveClient },
        dummy: { dummyClient: _dummyClient },
    };
};

export default { getDependencies };
