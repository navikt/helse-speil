import { SpesialistOppgave } from 'external-types';
import * as fs from 'fs';
import request from 'request-promise-native';

import { Instrumentation } from '../instrumentation';
import { SpesialistClient } from '../person/spesialistClient';

const devSpesialistClient = (_: Instrumentation): SpesialistClient => ({
    behandlingerForPeriode: async (_accessToken: string): Promise<Response> => {
        const fromFile = fs.readFileSync('__mock-data__/oppgaver.json', 'utf-8');
        const oppgaver = await Promise.all(
            JSON.parse(fromFile).map(async (oppgave: SpesialistOppgave) => {
                const tildeling = await hentPersonStatus(oppgave.aktørId);
                return { ...oppgave, tildeling };
            })
        );
        return Promise.resolve(({
            status: 200,
            body: oppgaver,
        } as unknown) as Response);
    },

    hentPersonByAktørId: lesPerson,

    hentPersonByFødselsnummer: lesPerson,

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

const lesPerson = async (aktørId: string): Promise<Response> => {
    const fromFile = fs.readFileSync(`__mock-data__/${filenameForPersonId(aktørId)}`, 'utf-8');
    const person = JSON.parse(fromFile);
    const tildeling = await hentPersonStatus(person.aktørId);
    return Promise.resolve({
        status: 200,
        body: { ...person, tildeling },
    } as Response);
};

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
        case '2750243667999':
        case '19026500129':
            return 'teknobasse_revurderer_revurderinger.json';
        case '05068821404':
        case '2446602102798':
            return 'vakker_ert_avventer_simulering_revurdering.json';
        case '09038418927':
        case '2259231372981':
            return 'vakker_ert_en_utbetalt_periode.json';
        case '30086320343':
        case '2315736979797':
            return 'lur_muldvarp_flere_ag_utbetalt.json';
        case '30086320344':
        case '2315736979798':
            return 'lur_muldvarp_flere_ag_utbetalt_revurdering.json';
        case '30086320345':
        case '2315736979799':
            return 'lur_muldvarp_flere_ag_utbetalt_revurdering_ingen_endring.json';
        case '17086922452':
        case '2510206713982':
            return 'bråkete_konsoll_utbetalt_revurdering_kun_ferie.json';
        case '2287435975702':
        case '11117615092':
            return 'feilende_opptjeningsvilkår.json';
        case '12020052345':
        case '42':
            return 'abel_tesfaye_ghost.json';
        default:
            throw new Error('Mangler oppsett i devSpesialistClient.ts');
    }
};

export default devSpesialistClient;
