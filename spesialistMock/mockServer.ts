import express, { Request, Response } from 'express';
import oppgaveFil from '../__mock-data__/oppgaver.json';

const app = express();
const port = 9001;

app.disable('x-powered-by');
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:1234');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, fodselsnummer'
    );
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
    next();
});

const tildelinger: { [oppgavereferanse: string]: string } = {
    ['ea5d644b-0000-9999-0000-f93744554d5e']: 'dev@nav.no',
    ['ab3344fa-92e6-4f11-abcd-87866a8bbbbe']: 'dev@nav.no',
};

const venter: { [oppgavereferanse: string]: boolean } = {
    ['ab3344fa-92e6-4f11-abcd-87866a8bbbbe']: true,
};

const personer: { [aktørId: string]: string } = oppgaveFil
    .map(({ aktørId, oppgavereferanse }: { aktørId: string; oppgavereferanse: string }) => [aktørId, oppgavereferanse])
    .reduce((acc, [aktørId, oppgavereferanse]) => {
        let ret: {
            [aktørId: string]: string;
        } = { ...acc, [aktørId]: oppgavereferanse };
        return ret;
    }, {});

app.get('/api/tildeling/:oppgavereferanse', (req: Request, res: Response) => {
    const oppgavereferanse = req.params.oppgavereferanse;

    if (tildelinger[oppgavereferanse]) {
        res.status(200).send(tildelinger[oppgavereferanse]);
    } else {
        res.sendStatus(404);
    }
});

app.post('/api/tildeling/:oppgavereferanse', (req: Request, res: Response) => {
    const oppgavereferanse = req.params.oppgavereferanse;
    tildelinger[oppgavereferanse] = 'dev@nav.no';
    res.sendStatus(200);
});

app.delete('/api/tildeling/:oppgavereferanse', (req: Request, res: Response) => {
    const oppgavereferanse = req.params.oppgavereferanse;
    delete tildelinger[oppgavereferanse];
    delete venter[oppgavereferanse];
    res.sendStatus(200);
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

app.get('/api/mock/personstatus/:aktørId', (req: Request, res: Response) => {
    const aktørId = req.params.aktørId;
    const oppgavereferanse = personer[aktørId];
    const erPåVent = venter[oppgavereferanse];
    const tildeltTil = tildelinger[oppgavereferanse];
    res.send({ erPåVent, tildeltTil });
});

let pollCounter = 0;
const pollLimit = 3;

app.get('/api/v1/oppgave', (req: Request, res: Response) => {
    pollCounter += 1;
    if (pollCounter === pollLimit) {
        pollCounter = 0;
        res.send({ oppgavereferanse: 'hunter2' });
    } else {
        res.sendStatus(404);
    }
});

app.listen(port, () => console.log(`Spesialist-mock kjører på port ${port}`));
