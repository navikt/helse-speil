import {
    ApiGraderteAndreYtelser,
    ApiGraderteAndreYtelserDag,
} from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { ApiArbeidsgiver, ApiSelvstendigNaering } from '@io/rest/generated/spesialist.schemas';
import { tilDagendring, tilEndringForDag } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endreDagerUtils';
import { lagDag } from '@saksbilde/utbetaling/utbetalingstabell/validering.fixtures';

import { tilGraderteAndreYtelserRequest } from './graderteAndreYtelserRequest';
import { Feriedag, Foreldrepengerdag, Pleiepengerdag, Sykedag } from './utbetalingstabelldager';

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
                {
                    dato: '2024-07-01',
                    andreYtelserGrader: { FORELDREPENGER: 40 },
                    sykdomsgrad: 30,
                    arbeidsgrad: 30,
                    sykdomsgradFørFordeling: 70,
                },
                {
                    dato: '2024-07-03',
                    andreYtelserGrader: { PLEIEPENGER: 50 },
                    sykdomsgrad: 20,
                    arbeidsgrad: 30,
                    sykdomsgradFørFordeling: 70,
                },
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

    it('bevarer sykdomsgrad før fordeling uten å beregne den fra de fordelte gradene', () => {
        const dag = gradertDag('2024-07-01', 30, 40);
        dag.gradertAnnenYtelse!.sykdomsgradFørFordeling = 60;

        const request = tilGraderteAndreYtelserRequest({
            overstyrteDager: [dag],
            inntektsforhold: arbeidsgiver('967170232'),
            graderteAndreYtelser: [],
            behandlingId,
            notatTilBeslutter: '',
        });

        expect(request.dager[0]!.sykdomsgradFørFordeling).toBe(60);
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

    it('fjerner lagret fordeling fra dager som ikke lenger har fordeling, uansett dagtype', () => {
        const request = tilGraderteAndreYtelserRequest({
            overstyrteDager: [
                lagDag({ dato: '2024-07-01', dag: Sykedag, grad: 100 }),
                lagDag({ dato: '2024-07-02', dag: Feriedag, grad: undefined }),
            ],
            inntektsforhold: arbeidsgiver('967170232'),
            graderteAndreYtelser: [
                lagGraderteAndreYtelser({
                    dager: [
                        lagretDag('2024-07-01', 100, { FORELDREPENGER: 40 }),
                        lagretDag('2024-07-02', 80, { PLEIEPENGER: 30 }),
                    ],
                }),
            ],
            behandlingId,
            notatTilBeslutter: '',
        });

        expect(request.dager).toEqual([
            {
                dato: '2024-07-01',
                andreYtelserGrader: {},
                sykdomsgrad: 100,
                arbeidsgrad: 0,
                sykdomsgradFørFordeling: 100,
            },
            {
                dato: '2024-07-02',
                andreYtelserGrader: {},
                sykdomsgrad: 80,
                arbeidsgrad: 20,
                sykdomsgradFørFordeling: 80,
            },
        ]);
    });

    it('sender ikke dager uten lagret fordeling eller der fordelingen allerede er fjernet', () => {
        const request = tilGraderteAndreYtelserRequest({
            overstyrteDager: [
                lagDag({ dato: '2024-07-01', dag: Feriedag, grad: undefined }),
                lagDag({ dato: '2024-07-02', dag: Feriedag, grad: undefined }),
            ],
            inntektsforhold: arbeidsgiver('967170232'),
            graderteAndreYtelser: [lagGraderteAndreYtelser({ dager: [lagretDag('2024-07-02', 80, {})] })],
            behandlingId,
            notatTilBeslutter: '',
        });

        expect(request.dager).toEqual([]);
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
    it('tar vare på fordelingen for gradert annen ytelse, men ikke innvilget grad', () => {
        const endring = tilDagendring({
            dagtype: 'Foreldrepenger',
            grad: null,
            innvigletGrad: 80,
            sykepengerGrad: 30,
            gradAndreYtelser: 40,
            gradererAnnenYtelse: true,
        });

        expect(endring).toMatchObject({ grad: 70 });
        expect(endring.gradertAnnenYtelse).toEqual({ sykdomsgrad: 30, andreYtelseGrad: 40 });
    });

    it('fjerner fordelingen når dagen ikke er gradert annen ytelse', () => {
        const endring = tilDagendring({ dagtype: 'Syk', grad: 100, gradererAnnenYtelse: false });

        expect(endring.gradertAnnenYtelse).toBeNull();
    });
});

describe('tilEndringForDag', () => {
    const endringMedFordeling = tilDagendring({
        dagtype: 'Foreldrepenger',
        grad: null,
        innvigletGrad: 50,
        sykepengerGrad: 30,
        gradAndreYtelser: 20,
        gradererAnnenYtelse: true,
    });

    it('bruker sykdomsgraden dagen har i Spleis som sykdomsgrad før fordeling', () => {
        const endring = tilEndringForDag(endringMedFordeling, lagDag({ dato: '2026-01-01', grad: 60 }));

        expect(endring.gradertAnnenYtelse).toEqual({
            sykdomsgrad: 30,
            andreYtelseGrad: 20,
            sykdomsgradFørFordeling: 60,
        });
    });

    it('gir hver dag sin egen sykdomsgrad før fordeling', () => {
        const dager = [lagDag({ dato: '2026-01-01', grad: 100 }), lagDag({ dato: '2026-01-02', grad: 80 })];

        const førFordeling = dager.map(
            (dag) => tilEndringForDag(endringMedFordeling, dag).gradertAnnenYtelse?.sykdomsgradFørFordeling,
        );

        expect(førFordeling).toEqual([100, 80]);
    });

    it('sender 0 som sykdomsgrad før fordeling når dagen ikke har grad i Spleis', () => {
        const endring = tilEndringForDag(endringMedFordeling, lagDag({ dato: '2026-01-01', grad: null }));

        expect(endring.gradertAnnenYtelse?.sykdomsgradFørFordeling).toBe(0);
    });

    it('lar endringer uten fordeling være som de er', () => {
        const endring = tilDagendring({ dagtype: 'Syk', grad: 100, gradererAnnenYtelse: false });

        expect(tilEndringForDag(endring, lagDag({ dato: '2026-01-01', grad: 60 }))).toEqual(endring);
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

function lagretDag(
    dato: string,
    sykdomsgradFørFordeling: number,
    andreYtelserGrader: Record<string, number>,
): ApiGraderteAndreYtelserDag {
    const andreYtelser = Object.values(andreYtelserGrader).reduce((sum, grad) => sum + grad, 0);
    return {
        dato,
        andreYtelserGrader,
        sykdomsgrad: sykdomsgradFørFordeling - andreYtelser,
        arbeidsgrad: 100 - sykdomsgradFørFordeling,
        sykdomsgradFørFordeling,
    };
}

function gradertDag(dato: string, sykdomsgrad: number, andreYtelseGrad: number, dag = Foreldrepengerdag) {
    return lagDag({
        dato,
        dag,
        grad: sykdomsgrad + andreYtelseGrad,
        gradertAnnenYtelse: { sykdomsgrad, andreYtelseGrad, sykdomsgradFørFordeling: 70 },
    });
}
