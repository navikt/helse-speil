'use strict';

import env from 'dotenv';
import * as process from 'process';

import { OidcConfig, ServerConfig } from './types';

env.config();

const oidc: OidcConfig = {
    clientIDSpesialist: process.env.CLIENT_ID_SPESIALIST || 'unknown',
    clientIDFlexjar: process.env.CLIENT_ID_FLEXJAR || 'unknown',
    modiaApiScope: process.env.MODIA_API_SCOPE || 'unknown',
};

const server: ServerConfig = {
    port: process.env.SPEIL_BACKEND_PORT ? parseInt(process.env.SPEIL_BACKEND_PORT) : 3000,
    sessionSecret: process.env.SESSION_SECRET,
    spesialistBaseUrl: process.env.SPESIALIST_BASE_URL || 'http://spesialist',
    spesialistWsUrl: process.env.SPESIALIST_WS_URL || 'ws://spesialist',
    flexjarBaseUrl: process.env.FLEXJAR_BASE_URL || 'http://flexjar',
    modiaBaseUrl: process.env.MODIA_BASE_URL || 'http://localhost',
};

const development = process.env.NODE_ENV === 'development';

export default {
    oidc,
    server,
    development,
};
