import env from 'dotenv';
import * as process from 'process';

import { ServerConfig } from './types';

('use strict');

env.config();

const server: ServerConfig = {
    port: process.env.SPEIL_BACKEND_PORT ? parseInt(process.env.SPEIL_BACKEND_PORT) : 3000,
    sessionSecret: process.env.SESSION_SECRET,
    spesialistBaseUrl: process.env.SPESIALIST_BASE_URL || 'http://spesialist',
    flexjarBaseUrl: process.env.FLEXJAR_BASE_URL || 'http://flexjar',
};

const development = process.env.NODE_ENV === 'development';

export default {
    server,
    development,
};
