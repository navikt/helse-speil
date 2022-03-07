import { testOrganisasjonsnummer } from './person';

export const umappetInfotrygdutbetalinger = (
    organisasjonsnummer: string = testOrganisasjonsnummer
): ExternalInfotrygdutbetaling => ({
    fom: '2017-12-01',
    tom: '2017-12-31',
    dagsats: 1500,
    grad: '100',
    typetekst: 'ArbRef',
    organisasjonsnummer: organisasjonsnummer,
});
