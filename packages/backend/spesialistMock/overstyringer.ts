import { Express, Request, Response } from 'express';

const overstyrDager = async (req: Request, res: Response): Promise<any> => {
    Math.random() > 0.05 ? res.sendStatus(200) : res.status(500).send('Dev-feil!');
};

const overstyrInntektOgRefusjon = async (req: Request, res: Response): Promise<any> => {
    Math.random() > 0.05 ? res.sendStatus(200) : res.status(500).send('Dev-feil!');
};

const overstyrArbeidsforhold = async (req: Request, res: Response): Promise<any> => {
    Math.random() > 0.05 ? res.sendStatus(200) : res.status(500).send('Dev-feil!');
};

export const setUpOverstyring = (app: Express) => {
    app.post('/api/overstyr/dager', (req, res) => overstyrDager(req, res));
    app.post('/api/overstyr/inntektogrefusjon', (req, res) => overstyrInntektOgRefusjon(req, res));
    app.post('/api/overstyr/arbeidsforhold', (req, res) => overstyrArbeidsforhold(req, res));
};
