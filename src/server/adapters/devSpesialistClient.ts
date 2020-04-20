import * as fs from 'fs';
import { SpesialistClient } from './spesialistClient';

const behandlingerForPeriode = (_fom: string, _tom: string, _accessToken: string) => {
    const fromFile = fs.readFileSync('__mock-data__/oppgaver.json', 'utf-8');
    const behov = JSON.parse(fromFile);
    return Promise.resolve({
        statusCode: 200,
        body: behov
    });
};

const devSpesialistClient: SpesialistClient = { behandlingerForPeriode };

export default devSpesialistClient;
