import { RedisClient } from 'redis';

import personInfoLookup from './personinfoLookup';
import logger from '../logging';
import { Request, Response } from 'express';
import { Personinfo } from '../../types';
import { SparkelClient } from '../adapters/sparkelClient';
import { AktørIdLookup } from '../aktørid/aktøridlookup';
import { StsClient } from '../auth/stsClient';

interface SetupParameters {
    sparkelClient: SparkelClient;
    aktørIdLookup: AktørIdLookup;
    stsClient: StsClient;
    cache: RedisClient;
}

const timeToExpire = 34 * 60 * 60 * 1000;
let cache: RedisClient;

const setup = ({ sparkelClient, aktørIdLookup, stsClient, cache: _cache }: SetupParameters) => {
    personInfoLookup.init({ sparkelClient, stsClient, aktørIdLookup });
    cache = _cache;
};

const getPersoninfo = (req: Request, res: Response) => {
    const aktørId = req.params.aktorId;
    cache.get(`person-${aktørId}`, (err: Error | null, personinfo: string) => {
        if (err) {
            logger.error('error fetching person info from cache', err);
            res.sendStatus(500);
        } else if (personinfo) {
            res.send(JSON.parse(personinfo));
        } else {
            personInfoLookup
                .hentPersoninfo(aktørId)
                .then((personinfo: Personinfo) => {
                    cache.setex(`person-${aktørId}`, timeToExpire, JSON.stringify(personinfo));
                    res.send(personinfo);
                })
                .catch(err => {
                    logger.error('error reading person info from sparkel', err);
                    res.sendStatus(500);
                });
        }
    });
};

export default {
    setup,
    getPersoninfo
};
