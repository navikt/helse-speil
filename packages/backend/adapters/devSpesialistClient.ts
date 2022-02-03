import * as fs from 'fs';
import request from 'request-promise-native';

import { Instrumentation } from '../instrumentation';
import { SpesialistClient } from '../person/spesialistClient';

const devSpesialistClient = (_: Instrumentation): SpesialistClient => ({
    behandlingerForPeriode: async (_accessToken: string): Promise<Response> => {
        const fromFile = fs.readFileSync('__mock-data__/oppgaver.json', 'utf-8');
        const oppgaver = await Promise.all(
            JSON.parse(fromFile).map(async (oppgave: ExternalOppgave) => {
                const tildeling = await hentPersonStatus(oppgave.aktørId);
                return { ...oppgave, tildeling };
            })
        );
        return Promise.resolve({
            status: 200,
            body: oppgaver,
        } as unknown as Response);
    },

    hentPersonByAktørId: lesPerson,

    hentPersonByFødselsnummer: lesPerson,

    hentBehandlingsstatistikk: async (): Promise<Response> => {
        return Promise.resolve({
            status: 200,
            body: {
                antallOppgaverTilGodkjenning: {
                    totalt: 1000,
                    perPeriodetype: [
                        { periodetypeForSpeil: 'FØRSTEGANGSBEHANDLING', antall: 500 },
                        { periodetypeForSpeil: 'FORLENGELSE', antall: 100 },
                        { periodetypeForSpeil: 'INFOTRYGDFORLENGELSE', antall: 150 },
                        { periodetypeForSpeil: 'OVERGANG_FRA_IT', antall: 250 },
                        { periodetypeForSpeil: 'UTBETALING_TIL_SYKMELDT', antall: 2 },
                        { periodetypeForSpeil: 'DELVIS_REFUSJON', antall: 1 },
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
                        { periodetypeForSpeil: 'UTBETALING_TIL_SYKMELDT', antall: 100 },
                        { periodetypeForSpeil: 'DELVIS_REFUSJON', antall: 10 },
                    ],
                },
            },
        } as unknown as Response);
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
        case '2469366399586':
        case '25068609936':
            return 'bråkete-tranflaske.json';
        case '87654321962123':
        case '12020042069':
            return 'dronning-sonja_infotrygdforlengelse.json';
        case '2836012894592':
        case '19047622436':
            return 'sniff_to_skjæringstidspunkt_første_utbetalt.json';
        case '2259231338047':
        case '09038400182':
            return 'luke_skywalker_revurdering.json';
        case '2287435975709':
        case '11117615091':
            return 'mummitrollet_revurdering_tre_perioder.json';
        case '1000000009872':
        case '21023701902':
            return 'snorkfrøken_to_utbetalte_skjæringstidspunkt.json';
        case '05068821403':
        case '2446602102797':
            return 'hufsa_flere_ag_forlengelse_første_utbetalt.json';
        case '19026500128':
        case '2750243667998':
            return 'stinky_stank_to_skjæringstidspunkt_første_ingen_utbetaling.json';
        case '2750243667999':
        case '19026500129':
            return 'teknobasse_revurderer_revurderinger.json';
        case '05068821404':
        case '2446602102798':
            return 'vakker_ert_avventer_simulering_revurdering.json';
        case '09038418927':
        case '2259231372981':
            return 'vakker_ert_enkel_forlengelse.json';
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
            return 'stor_bolle_feilende_opptjeningsvilkår.json';
        case '12020052345':
        case '42':
            return 'abel_tesfaye_ghost.json';
        case '02126721911':
        case '2513379298794':
            return 'robust_mulvarp_revurdering_ghosts.json';
        case '1624661706686':
        case '09128322660':
            return 'robust_brannhydrant_flere_ag_revurdering_pågår.json';
        case '1624661706687':
        case '09128322661':
            return 'robust_brannhydrant_flere_ag_revurdering_pågår_én_periode_utbetalt.json';
        case '1042000009872':
        case '12029240045':
            return 'whiteout_jakke_delvis_refusjon.json';
        case '2285145663954':
        case '03058022887':
            return 'lunken_trane_agp_før_periode.json';
        case '2258733201004':
        case '03038111204':
            return 'god_gaselle_agp_før_periode_med_kort_periode_før.json';
        case '2367127008792':
        case '28128219910':
            return 'smekker_konsoll_kort_periode_som_egentlig_har_utbetaling.json';
        case '1000000001337':
        case '20046913337':
            return 'bare_hege_med_ghostpølser.json';
        case '2000000001337':
        case '30042213337':
            return 'bare_kevin_med_ghostpølser.json';
        default:
            throw new Error('Mangler oppsett i devSpesialistClient.ts');
    }
};

export default devSpesialistClient;
