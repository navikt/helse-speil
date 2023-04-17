import express, { Request, Response } from 'express';

import oppgaveFil from '../__mock-data__/oppgaver.json';
import { sleep } from '../devHelpers';
import { setUpGraphQLMiddleware } from './graphql';
import { setUpOpptegnelse } from './opptegnelser';
import { setUpOverstyring } from './overstyringer';
import { Notat } from './schemaTypes';
import { NotatMock } from './storage/notat';
import { OppgaveMock, getDefaultOppgave } from './storage/oppgave';

const app = express();
const port = 9001;

const passeLenge = () => Math.random() * 500 + 200;

app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:1234');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, fodselsnummer'
    );
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
    next();
});

const personer: { [aktørId: string]: string } = oppgaveFil
    .map(({ aktørId, oppgavereferanse }: { aktørId: string; oppgavereferanse: string }) => [aktørId, oppgavereferanse])
    .reduce((acc, [aktørId, oppgavereferanse]) => {
        let ret: {
            [aktørId: string]: string;
        } = { ...acc, [aktørId]: oppgavereferanse };
        return ret;
    }, {});

app.post('/api/tildeling/:oppgavereferanse', (req: Request, res: Response) => {
    const oppgavereferanse = req.params.oppgavereferanse;

    OppgaveMock.addOrUpdateOppgave(oppgavereferanse, { tildelt: 'uuid' });

    res.sendStatus(200);
});

app.delete('/api/tildeling/:oppgavereferanse', async (req: Request, res: Response) => {
    const oppgavereferanse = req.params.oppgavereferanse;

    OppgaveMock.addOrUpdateOppgave(oppgavereferanse, {
        tildelt: undefined,
        erPåVent: false,
    });

    await sleep(passeLenge());
    res.sendStatus(200);
});

app.post('/api/leggpaavent/:oppgavereferanse', (req: Request, res: Response) => {
    const oppgavereferanse = req.params.oppgavereferanse;

    OppgaveMock.addOrUpdateOppgave(oppgavereferanse, { erPåVent: true });
    NotatMock.addNotat(oppgavereferanse, {
        vedtaksperiodeId: oppgavereferanse,
        tekst: req.body.tekst,
        type: req.body.type,
    });

    res.sendStatus(200);
});

app.delete('/api/leggpaavent/:oppgavereferanse', (req: Request, res: Response) => {
    const oppgavereferanse = req.params.oppgavereferanse;

    OppgaveMock.addOrUpdateOppgave(oppgavereferanse, { erPåVent: false });

    res.sendStatus(200);
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
        response[id] = NotatMock.getNotater(id) ?? [];
    }

    res.send(response);
});

app.post('/api/totrinnsvurdering/retur', (req: Request, res: Response) => {
    const oppgavereferanse = req.body.oppgavereferanse;
    const tidligereSaksbehandler = OppgaveMock.getOppgave(oppgavereferanse)?.totrinnsvurdering?.saksbehandler;
    const oppgave: Oppgave = {
        ...getDefaultOppgave(),
        id: oppgavereferanse,
        erRetur: true,
        erBeslutter: false,
        tidligereSaksbehandler: 'uuid',
        tildelt: tidligereSaksbehandler,
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
        erRetur: false,
        erBeslutter: true,
        tildelt: tidligereSaksbehandler === 'uuid' ? null : 'uuid',
        tidligereSaksbehandler: 'uuid',
    };

    OppgaveMock.addOrUpdateOppgave(oppgavereferanse, oppgave);

    res.sendStatus(200);
});

app.post('/api/annullering', (req, res) => {
    Math.random() > 0.2 ? res.sendStatus(200) : res.status(503).send('dev annullering feil');
});

app.post('/api/vedtak', (req, res) => {
    sleep(420).then((_) => (Math.random() > 1 ? res.sendStatus(204) : res.status(500).send('Dev-feil!')));
});

app.post('/api/person/oppdater', (req, res) => {
    console.log(`Mottok forespørsel om oppdatering ${JSON.stringify(req.body)}`);
    return Math.random() < 0.2 ? res.status(503).send('Dev feil!') : res.sendStatus(200);
});

app.get('/api/mock/personstatus/:aktorId', (req: Request, res: Response) => {
    const aktørId = req.params.aktorId;
    const oppgavereferanse = personer[aktørId];
    const påVent = OppgaveMock.getOppgave(oppgavereferanse)?.erPåVent || false;
    const oid = OppgaveMock.getOppgave(oppgavereferanse)?.tildelt;

    if (oid) {
        res.send({ påVent, oid, epost: 'dev@nav.no', navn: 'dev' });
    } else {
        res.send(undefined);
    }
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
