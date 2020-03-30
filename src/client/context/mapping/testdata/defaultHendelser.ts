import {
    SpleisHendelse,
    SpleisHendelsetype,
    SpleisInntektsmelding,
    SpleisSykmelding,
    SpleisSøknad
} from '../external.types';

export const defaultHendelser: SpleisHendelse[] = [
    {
        id: 'c554ee9b-30ca-4c7f-adce-c0224108e83a',
        rapportertdato: '2020-02-14',
        fom: '2019-09-01',
        tom: '2019-10-10',
        type: SpleisHendelsetype.SYKMELDING
    } as SpleisSykmelding,
    {
        id: '726e57d9-7844-4a28-886b-8485dbdbd4d2',
        rapportertdato: '2020-02-14',
        sendtNav: '2019-10-15',
        fom: '2019-09-01',
        tom: '2019-10-10',
        type: SpleisHendelsetype.SØKNAD
    } as SpleisSøknad,
    {
        id: '09851096-bcba-4c7a-8dc0-a1617a744f1f',
        beregnetInntekt: 31000.0,
        førsteFraværsdag: '2019-09-01',
        mottattDato: '2019-10-15T00:00:00',
        type: SpleisHendelsetype.INNTEKTSMELDING
    } as SpleisInntektsmelding
];
