import { ApiArbeidsgiver, ApiGraderteAndreYtelser, ApiSelvstendigNaering } from '@io/rest/generated/spesialist.schemas';
import { tilDagendring } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endreDagerUtils';
import { lagDag } from '@saksbilde/utbetaling/utbetalingstabell/validering.fixtures';

import { tilGraderteAndreYtelserRequest } from './graderteAndreYtelserRequest';
import { Foreldrepengerdag, Pleiepengerdag, Sykedag } from './utbetalingstabelldager';

const selvstendig = { behandlinger: [], overstyringer: [] } as ApiSelvstendigNaering;
const behandlingId = '94926180-4e95-4879-8975-0a63b5659831';

describe('tilGraderteAndreYtelserRequest', () => {
    it('sender bare graderte dager med full fordeling', () => {
        const request = tilGraderteAndreYtelserRequest({
            overstyrteDager: [
                gradertDag('2024-07-01', 30, 40),
                lagDag({ dato: '2024-07-02', dag: Sykedag, grad: 50 }),
                gradertDag('2024-07-03', 20, 50, Pleiepengerdag),
            ],
            inntektsforhold: arbeidsgiver('967170232'),
            graderteAndreYtelser: [],
            behandlingId,
            notatTilBeslutter: 'Et notat',
        });

        expect(request).toEqual({
            yrkesaktivitet: 'ARBEIDSTAKER',
            organisasjonsnummer: '967170232',
            versjon: null,
            behandlingId,
            notatTilBeslutter: 'Et notat',
            dager: [
                { dato: '2024-07-01', andreYtelserGrader: { FORELDREPENGER: 40 }, sykdomsgrad: 30, arbeidsgrad: 30 },
                { dato: '2024-07-03', andreYtelserGrader: { PLEIEPENGER: 50 }, sykdomsgrad: 20, arbeidsgrad: 30 },
            ],
        });
    });

    it('bruker versjonen for samme arbeidsgiver', () => {
        const request = tilGraderteAndreYtelserRequest({
            overstyrteDager: [gradertDag('2024-07-01', 30, 40)],
            inntektsforhold: arbeidsgiver('967170232'),
            graderteAndreYtelser: [
                lagGraderteAndreYtelser({ organisasjonsnummer: '947064649', versjon: 'annen-arbeidsgiver' }),
                lagGraderteAndreYtelser({ versjon: 'riktig-versjon' }),
            ],
            behandlingId,
            notatTilBeslutter: '',
        });

        expect(request.versjon).toBe('riktig-versjon');
    });

    it('sender null som versjon når arbeidsgiveren ikke har graderte andre ytelser', () => {
        const request = tilGraderteAndreYtelserRequest({
            overstyrteDager: [gradertDag('2024-07-01', 30, 40)],
            inntektsforhold: arbeidsgiver('967170232'),
            graderteAndreYtelser: [lagGraderteAndreYtelser({ organisasjonsnummer: '947064649' })],
            behandlingId,
            notatTilBeslutter: '',
        });

        expect(request.versjon).toBeNull();
    });

    it('sender selvstendig uten organisasjonsnummer', () => {
        const request = tilGraderteAndreYtelserRequest({
            overstyrteDager: [gradertDag('2024-07-01', 30, 40)],
            inntektsforhold: selvstendig,
            graderteAndreYtelser: [
                lagGraderteAndreYtelser({ yrkesaktivitet: 'SELVSTENDIG', organisasjonsnummer: null }),
            ],
            behandlingId,
            notatTilBeslutter: '',
        });

        expect(request).toMatchObject({
            yrkesaktivitet: 'SELVSTENDIG',
            organisasjonsnummer: null,
            versjon: 'versjon-1',
        });
    });

    it('feiler for gradert dag uten type for gradert annen ytelse', () => {
        expect(() =>
            tilGraderteAndreYtelserRequest({
                overstyrteDager: [gradertDag('2024-07-01', 30, 40, Sykedag)],
                inntektsforhold: arbeidsgiver('967170232'),
                graderteAndreYtelser: [],
                behandlingId,
                notatTilBeslutter: '',
            }),
        ).toThrow();
    });
});

describe('tilDagendring', () => {
    it('tar vare på fordelingen for gradert annen ytelse', () => {
        const endring = tilDagendring({
            dagtype: 'Foreldrepenger',
            grad: null,
            innvigletGrad: 80,
            sykepengerGrad: 30,
            gradAndreYtelser: 40,
            gradererAnnenYtelse: true,
        });

        expect(endring).toMatchObject({
            grad: 70,
            gradertAnnenYtelse: { sykdomsgrad: 30, andreYtelseGrad: 40 },
        });
    });

    it('fjerner fordelingen når dagen ikke er gradert annen ytelse', () => {
        const endring = tilDagendring({ dagtype: 'Syk', grad: 100, gradererAnnenYtelse: false });

        expect(endring.gradertAnnenYtelse).toBeNull();
    });
});

function arbeidsgiver(organisasjonsnummer: string): ApiArbeidsgiver {
    return { organisasjonsnummer, behandlinger: [] } as unknown as ApiArbeidsgiver;
}

function lagGraderteAndreYtelser(overstyringer: Partial<ApiGraderteAndreYtelser>): ApiGraderteAndreYtelser {
    return {
        yrkesaktivitet: 'ARBEIDSTAKER',
        organisasjonsnummer: '967170232',
        versjon: 'versjon-1',
        dager: [],
        events: [],
        ...overstyringer,
    };
}

function gradertDag(dato: string, sykdomsgrad: number, andreYtelseGrad: number, dag = Foreldrepengerdag) {
    return lagDag({
        dato,
        dag,
        grad: sykdomsgrad + andreYtelseGrad,
        gradertAnnenYtelse: { sykdomsgrad, andreYtelseGrad },
    });
}
