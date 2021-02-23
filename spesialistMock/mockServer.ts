import express, { Request, Response } from 'express';

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

const tildelinger: { [oppgavereferanse: string]: string } = {};

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
    res.sendStatus(200);
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
