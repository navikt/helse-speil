import { testOrganisasjonsnummer } from './person';

export const umappetInfotrygdutbetalinger = (
    organisasjonsnummer: string = testOrganisasjonsnummer
): ExternalInfotrygdutbetaling => ({
    fom: '2021-08-09',
    tom: '2021-08-19',
    dagsats: 1500,
    grad: '100',
    typetekst: 'ArbRef',
    organisasjonsnummer: organisasjonsnummer,
});
