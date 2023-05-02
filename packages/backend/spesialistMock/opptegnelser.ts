import { Express, Request, Response } from 'express';

import { sleep } from '../devHelpers';
import { opptegnelser } from './data/opptegnelser';

let svarPåOpptegnelser = false;

const blokkerSvarPåOpptegnelser = () => {
    svarPåOpptegnelser = false;
    setTimeout(() => {
        svarPåOpptegnelser = true;
    }, 5000);
};

const abonnerPåAktør = async (req: Request, res: Response): Promise<any> => {
    blokkerSvarPåOpptegnelser();
    res.sendStatus(200);
};

const getAlleOpptegnelser = async (req: Request, res: Response): Promise<any> => {
    await sleep(400);
    if (!svarPåOpptegnelser) return res.status(200).send([]);
    const [opptegnelse, opptegnelse2] = opptegnelser;
    return res.status(200).send([opptegnelse, opptegnelse2]);
};
const getOpptegnelser = async (req: Request, res: Response): Promise<any> => {
    await sleep(400);
    const sisteSekvensId = Number(req.params['sisteSekvensId']);
    const opptegnelse3 = opptegnelser[2];
    return svarPåOpptegnelser
        ? res.status(200).send([{ ...opptegnelse3 }].filter((it) => it.sekvensnummer > sisteSekvensId))
        : res.status(200).send([]);
};

export const setUpOpptegnelse = (app: Express) => {
    app.post('/api/opptegnelse/abonner/:aktorId', (req, res) => abonnerPåAktør(req, res));
    app.get('/api/opptegnelse/hent', (req, res) => getAlleOpptegnelser(req, res));
    app.get('/api/opptegnelse/hent/:sisteSekvensId', (req, res) => getOpptegnelser(req, res));
};
