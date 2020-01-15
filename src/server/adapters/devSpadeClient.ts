import * as fs from 'fs';
import { SpadeClient } from './spadeClient';

const behandlingerForPeriode = (_fom: string, _tom: string, _accessToken: string) => {
    const fromFile = fs.readFileSync('__mock-data__/behov.json', 'utf-8');
    const behov = JSON.parse(fromFile);
    return Promise.resolve({
        statusCode: 200,
        body: behov
    });
};

const devSpadeClient: SpadeClient = { behandlingerForPeriode };

export default devSpadeClient;
