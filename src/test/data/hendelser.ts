import dayjs from 'dayjs';
import { SpleisHendelse, SpleisHendelsetype, SpleisSykdomsdag, SpleisSykdomsdagtype } from 'external-types';

const sykmelding = (sykdomsdager: SpleisSykdomsdag[]) => {
    const fom = sykdomsdager[0];
    const tom = sykdomsdager.slice(-1).pop()!;
    const rapportertDato = dayjs(tom.dagen).add(15, 'day').format('YYYY-MM-DD');
    return {
        id: 'c554ee9b-30ca-4c7f-adce-c0224108e83a',
        rapportertdato: rapportertDato,
        fom: fom.dagen,
        tom: tom.dagen,
        type: SpleisHendelsetype.SYKMELDING,
    };
};

const søknad = (sykdomsdager: SpleisSykdomsdag[]) => {
    const fom = sykdomsdager[0];
    const tom = sykdomsdager.slice(-1).pop()!;
    const rapportertDato = dayjs(tom.dagen).add(15, 'day').format('YYYY-MM-DD');
    return {
        id: '726e57d9-7844-4a28-886b-8485dbdbd4d2',
        rapportertdato: rapportertDato,
        sendtNav: rapportertDato,
        fom: fom.dagen,
        tom: tom.dagen,
        type: SpleisHendelsetype.SØKNAD_NAV,
    };
};

const inntektsmelding = (sykdomsdager: SpleisSykdomsdag[]) => {
    const førsteFraværsdag = sykdomsdager.find(({ type }) => type === SpleisSykdomsdagtype.SYKEDAG)!;
    const mottattDato = dayjs(førsteFraværsdag.dagen).add(15, 'day').format('YYYY-MM-DD');
    return {
        id: '09851096-bcba-4c7a-8dc0-a1617a744f1f',
        beregnetInntekt: 31000.0,
        førsteFraværsdag: førsteFraværsdag.dagen,
        mottattDato: mottattDato,
        type: SpleisHendelsetype.INNTEKTSMELDING,
    };
};

export const hendelser = (sykdomsdager: SpleisSykdomsdag[]): SpleisHendelse[] => [
    sykmelding(sykdomsdager),
    søknad(sykdomsdager),
    inntektsmelding(sykdomsdager),
];
