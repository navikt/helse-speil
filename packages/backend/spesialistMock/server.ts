import express, { Request, Response } from 'express';

import { sleep } from '../devHelpers';
import { setUpGraphQLMiddleware } from './graphql';
import { setUpOpptegnelse } from './opptegnelser';
import { setUpOverstyring } from './overstyringer';
import { Notat } from './schemaTypes';
import { NotatMock } from './storage/notat';
import { OppgaveMock, getDefaultOppgave } from './storage/oppgave';

const app = express();
const port = 9001;

const passeLenge = () => {
    const minimumforsinkelse = Math.random() > 0.8 ? 700 : 200;
    const varians = Math.random() * 500;
    return Math.round(minimumforsinkelse + varians);
};

app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:1234');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, fodselsnummer',
    );
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
    const ventetid = passeLenge();
    const pathOrQuery: string = req.url === '/graphql' ? req.body['operationName'] : req.url;
    if (!pathOrQuery.includes('/opptegnelse/hent')) {
        console.log(`Behandler ${req.method} til ${pathOrQuery} etter ${ventetid} ms`);
    }
    sleep(ventetid).then(next);
});

app.post('/api/notater/:vedtaksperiodeId', (req: Request, res: Response) => {
    const vedtaksperiodeId = req.params.vedtaksperiodeId;

    NotatMock.addNotat(vedtaksperiodeId, {
        vedtaksperiodeId: vedtaksperiodeId,
        tekst: req.body.tekst,
        type: req.body.type,
    });

    res.sendStatus(200);
});

app.put('/api/notater/:vedtaksperiodeId/feilregistrer/:notatId', (req: Request, res: Response) => {
    const vedtaksperiodeId = req.params.vedtaksperiodeId;
    const notatId = Number.parseInt(req.params.notatId);

    NotatMock.updateNotat(vedtaksperiodeId, notatId, { feilregistrert: true });

    res.sendStatus(200);
});

app.get('/api/notater', (req: Request, res: Response) => {
    const vedtaksperioderIdQueryParameter = req.query.vedtaksperiode_id as string | Array<string>;

    if (vedtaksperioderIdQueryParameter === undefined) {
        res.sendStatus(400);
        return;
    }

    const vedtaksperiodeIder: Array<string> = Array.isArray(vedtaksperioderIdQueryParameter)
        ? vedtaksperioderIdQueryParameter
        : [vedtaksperioderIdQueryParameter];

    const response: { [oppgaveref: string]: Array<Notat> } = {};

    for (const id of vedtaksperiodeIder) {
        let notater = NotatMock.getNotater(id);
        response[id] = notater ?? [];
    }

    res.send(response);
});

app.post('/api/totrinnsvurdering/retur', (req: Request, res: Response) => {
    const oppgavereferanse = req.body.oppgavereferanse;
    const tidligereSaksbehandler = OppgaveMock.getOppgave(oppgavereferanse)?.totrinnsvurdering?.saksbehandler;
    const oppgave: Oppgave = {
        ...getDefaultOppgave(),
        id: oppgavereferanse,
        tildelt: tidligereSaksbehandler,
        totrinnsvurdering: {
            saksbehandler: 'uuid',
            erRetur: true,
            erBeslutteroppgave: false,
        },
    };

    OppgaveMock.addOrUpdateOppgave(oppgavereferanse, oppgave);

    NotatMock.addNotat(oppgavereferanse, {
        vedtaksperiodeId: oppgavereferanse,
        tekst: req.body.notat.tekst,
        type: req.body.notat.type,
    });

    res.sendStatus(200);
});

app.post('/api/totrinnsvurdering', (req: Request, res: Response) => {
    // mangler å legge til periodehistorikk
    const oppgavereferanse = req.body.oppgavereferanse;
    const tidligereSaksbehandler = OppgaveMock.getOppgave(oppgavereferanse)?.totrinnsvurdering?.saksbehandler;
    const oppgave: Oppgave = {
        ...getDefaultOppgave(),
        id: oppgavereferanse,
        tildelt: tidligereSaksbehandler === 'uuid' ? null : 'uuid',
        totrinnsvurdering: {
            erRetur: false,
            erBeslutteroppgave: true,
            saksbehandler: 'uuid',
        },
    };

    OppgaveMock.addOrUpdateOppgave(oppgavereferanse, oppgave);

    res.sendStatus(200);
});

app.post('/api/annullering', (req, res) => {
    Math.random() > 0.2 ? res.sendStatus(200) : res.status(503).send('dev annullering feil');
});

app.post('/api/vedtak', (req, res) => {
    Math.random() > 0.1 ? res.sendStatus(204) : res.status(500).send({ feilkode: 'ikke_aapen_saksbehandleroppgave' });
});

app.post('/api/person/oppdater', (req, res) => {
    console.log(`Mottok forespørsel om oppdatering ${JSON.stringify(req.body)}`);
    return Math.random() < 0.2 ? res.status(503).send('Dev feil!') : res.sendStatus(200);
});

app.get('/api/mock/erbeslutteroppgave/:oppgavereferanse', (req: Request, res: Response) => {
    const oppgavereferanse = req.params.oppgavereferanse;
    res.send(OppgaveMock.getOppgave(oppgavereferanse)?.totrinnsvurdering?.erBeslutteroppgave ?? false);
});

app.get('/api/mock/erreturoppgave/:oppgavereferanse', (req: Request, res: Response) => {
    const oppgavereferanse = req.params.oppgavereferanse;
    res.send(OppgaveMock.getOppgave(oppgavereferanse)?.totrinnsvurdering?.erRetur ?? false);
});

app.get('/api/mock/tidligeresaksbehandler/:oppgavereferanse', (req: Request, res: Response) => {
    const oppgavereferanse = req.params.oppgavereferanse;
    res.send(OppgaveMock.getOppgave(oppgavereferanse)?.totrinnsvurdering?.saksbehandler ?? null);
});

setUpGraphQLMiddleware(app);
setUpOpptegnelse(app);
setUpOverstyring(app);

app.listen(port, () => console.log(`Spesialist-mock kjører på port ${port}`));
