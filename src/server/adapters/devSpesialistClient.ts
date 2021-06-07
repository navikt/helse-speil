import { SpesialistOppgave } from 'external-types';
import * as fs from 'fs';
import request from 'request-promise-native';

import { Instrumentation } from '../instrumentation';
import { SpesialistClient } from '../person/spesialistClient';

const devSpesialistClient = (instrumentation: Instrumentation): SpesialistClient => ({
    behandlingerForPeriode: async (_accessToken: string): Promise<Response> => {
        const fromFile = fs.readFileSync('__mock-data__/oppgaver.json', 'utf-8');
        const tidtakning = instrumentation.requestHistogram.startTidtakning('/api/oppgaver');
        const oppgaver = await Promise.all(
            JSON.parse(fromFile).map(async (oppgave: SpesialistOppgave) => {
                const tildeling = await hentPersonStatus(oppgave.aktørId);
                return { ...oppgave, tildeling };
            })
        );
        tidtakning();
        return Promise.resolve(({
            status: 200,
            body: oppgaver,
        } as unknown) as Response);
    },

    hentPersonByAktørId: async (aktørId: string): Promise<Response> => {
        const fromFile = fs.readFileSync(`__mock-data__/${filenameForPersonId(aktørId)}`, 'utf-8');
        const tidtakning = instrumentation.requestHistogram.startTidtakning('/api/person/aktørId');
        const person = JSON.parse(fromFile);
        tidtakning();
        const tildeling = await hentPersonStatus(person.aktørId);
        return Promise.resolve({
            status: 200,
            body: { ...person, tildeling },
        } as Response);
    },
    hentPersonByFødselsnummer: async (aktørId: string): Promise<Response> => {
        const tidtakning = instrumentation.requestHistogram.startTidtakning('/api/person/fnr');
        const fromFile = fs.readFileSync(`__mock-data__/${filenameForPersonId(aktørId)}`, 'utf-8');
        const person = JSON.parse(fromFile);
        tidtakning();
        const tildeling = await hentPersonStatus(person.aktørId);
        return Promise.resolve({
            status: 200,
            body: { ...person, tildeling },
        } as Response);
    },
    hentBehandlingsstatistikk: async (): Promise<Response> => {
        return Promise.resolve(({
            status: 200,
            body: {
                antallOppgaverTilGodkjenning: {
                    totalt: 1000,
                    perPeriodetype: [
                        { periodetypeForSpeil: 'FØRSTEGANGSBEHANDLING', antall: 500 },
                        { periodetypeForSpeil: 'FORLENGELSE', antall: 100 },
                        { periodetypeForSpeil: 'INFOTRYGDFORLENGELSE', antall: 150 },
                        { periodetypeForSpeil: 'OVERGANG_FRA_IT', antall: 250 },
                    ],
                },
                fullførteBehandlinger: {
                    totalt: 6045,
                    manuelt: 1000,
                    automatisk: 5000,
                    annulleringer: 45,
                },
                antallTildelteOppgaver: {
                    totalt: 300,
                    perPeriodetype: [
                        { periodetypeForSpeil: 'FØRSTEGANGSBEHANDLING', antall: 100 },
                        { periodetypeForSpeil: 'FORLENGELSE', antall: 15 },
                        { periodetypeForSpeil: 'INFOTRYGDFORLENGELSE', antall: 85 },
                        { periodetypeForSpeil: 'OVERGANG_FRA_IT', antall: 100 },
                    ],
                },
            },
        } as unknown) as Response);
    },
});

const hentPersonStatus = async (aktørId: string): Promise<any> => {
    const options = {
        uri: `http://localhost:9001/api/mock/personstatus/${aktørId}`,
        resolveWithFullResponse: true,
    };
    try {
        const res = await request.get(options);
        return JSON.parse(res.body);
    } catch (ignore) {
        return undefined;
    }
};

export const tildel = (oppgavereferanse: string) => {
    const options = {
        uri: `http://localhost:9001/api/tildeling/${oppgavereferanse}`,
        resolveWithFullResponse: true,
    };
    return request
        .post(options)
        .then((res) => res.body)
        .catch(() => {});
};

const filenameForPersonId = (id: string) => {
    switch (id) {
        case '1000000009871':
        case '12020069420':
            return 'kong-harald_egenmelding.json';
        case '87654321962123':
        case '12020042069':
            return 'dronning-sonja_forlengelse-revurdering.json';
        case '2836012894592':
        case '19047622436':
            return 'sniff_førstegangsbehandling_revurdering.json';
        case '2259231338047':
        case '09038400182':
            return 'knerten_revurdering.json';
        case '2287435975709':
        case '11117615091':
            return 'mummitrollet_revurdering_tre_perioder.json';
        case '1000000009872':
        case '21023701902':
            return 'snorkfrøken_flere_arbeidsgivere.json';
        case '05068821403':
        case '2446602102797':
            return 'hufsa_annullert.json';
        case '19026500128':
        case '2750243667998':
            return 'stinky_stank_førstegangsbehandling.json';
        default:
            throw new Error('Mangler oppsett i devSpesialistClient.ts');
    }
};

export default devSpesialistClient;
