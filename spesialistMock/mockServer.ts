import express, { Request, Response } from 'express';

import oppgaveFil from '../__mock-data__/oppgaver.json';
import { sleep } from '../src/server/devHelpers';

const app = express();
const port = 9001;

const passeLenge = () => Math.random() * 500 + 200;

app.disable('x-powered-by');
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:1234');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, fodselsnummer'
    );
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
    next();
});

const tildelinger: { [oppgavereferanse: string]: string } = {
    '2327': 'uuid',
    '2274': 'uuid',
};

const venter: { [oppgavereferanse: string]: boolean } = {
    '2274': true,
};

const personer: { [aktørId: string]: string } = oppgaveFil
    .map(({ aktørId, oppgavereferanse }: { aktørId: string; oppgavereferanse: string }) => [aktørId, oppgavereferanse])
    .reduce((acc, [aktørId, oppgavereferanse]) => {
        let ret: {
            [aktørId: string]: string;
        } = { ...acc, [aktørId]: oppgavereferanse };
        return ret;
    }, {});

const feilresponsForTildeling = {
    feilkode: 'oppgave_er_allerede_tildelt',
    kildesystem: 'mockSpesialist',
    kontekst: {
        tildeling: {
            navn: 'Saksbehandler Frank',
            epost: 'frank@nav.no',
            oid: 'en annen oid',
        },
    },
};

app.post('/api/tildeling/:oppgavereferanse', (req: Request, res: Response) => {
    sleep(passeLenge()).then(() => {
        if (Math.random() < 1) {
            const oppgavereferanse = req.params.oppgavereferanse;
            tildelinger[oppgavereferanse] = 'uuid';
            res.sendStatus(200);
        } else {
            res.status(409).json(feilresponsForTildeling);
        }
    });
});

app.delete('/api/tildeling/:oppgavereferanse', (req: Request, res: Response) => {
    const oppgavereferanse = req.params.oppgavereferanse;
    delete tildelinger[oppgavereferanse];
    delete venter[oppgavereferanse];
    sleep(passeLenge()).then(() => res.sendStatus(200));
});

app.post('/api/leggpåvent/:oppgaveReferanse', (req: Request, res: Response) => {
    const oppgavereferanse = req.params.oppgaveReferanse;
    venter[oppgavereferanse] = true;
    res.sendStatus(200);
});

app.delete('/api/leggpåvent/:oppgaveReferanse', (req: Request, res: Response) => {
    const oppgavereferanse = req.params.oppgaveReferanse;
    delete venter[oppgavereferanse];
    res.sendStatus(200);
});

app.get('/api/mock/personstatus/:aktorId', (req: Request, res: Response) => {
    const aktørId = req.params.aktorId;
    const oppgavereferanse = personer[aktørId];
    const påVent = venter[oppgavereferanse] || false;
    const oid = tildelinger[oppgavereferanse];
    res.send(oid ? { påVent, oid, epost: 'dev@nav.no', navn: 'dev' } : undefined);
});

let pollCounter = 0;
const pollLimit = 3;

app.get('/api/v1/oppgave', (_req: Request, res: Response) => {
    pollCounter += 1;
    if (pollCounter === pollLimit) {
        pollCounter = 0;
        res.send({ oppgavereferanse: 'hunter2' });
    } else {
        res.sendStatus(404);
    }
});

app.listen(port, () => console.log(`Spesialist-mock kjører på port ${port}`));
