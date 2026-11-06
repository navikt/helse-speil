import { ApiGraderteAndreYtelserDag } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { lagDag } from '@saksbilde/utbetaling/utbetalingstabell/validering.fixtures';

import { erReellEndring } from './erReellEndring';
import { Foreldrepengerdag, Pleiepengerdag, Sykedag } from './utbetalingstabelldager';

const fraDag = lagDag({ dato: '2024-07-01', dag: Foreldrepengerdag, grad: 70 });

describe('erReellEndring', () => {
    it('er endring når dagen ikke har lagrede graderte andre ytelser', () => {
        expect(erReellEndring(gradertEndring(30, 40), fraDag)).toBe(true);
    });

    it('er ikke endring når fordelingen er lik den lagrede', () => {
        expect(erReellEndring(gradertEndring(30, 40), fraDag, lagretDag(30, { FORELDREPENGER: 40 }))).toBe(false);
    });

    it('er endring når fordelingen er byttet om, selv om kombinert grad er lik', () => {
        expect(erReellEndring(gradertEndring(40, 30), fraDag, lagretDag(30, { FORELDREPENGER: 40 }))).toBe(true);
    });

    it('er endring når bare sykdomsgraden før fordeling er endret', () => {
        const endring = gradertEndring(30, 40);
        endring.gradertAnnenYtelse.sykdomsgradFørFordeling = 60;

        expect(erReellEndring(endring, fraDag, lagretDag(30, { FORELDREPENGER: 40 }))).toBe(true);
    });

    it('er endring når ytelsen er en annen', () => {
        expect(
            erReellEndring(gradertEndring(30, 40, Pleiepengerdag), fraDag, lagretDag(30, { FORELDREPENGER: 40 })),
        ).toBe(true);
    });

    it('er endring når lagret dag har flere ytelser', () => {
        expect(
            erReellEndring(gradertEndring(30, 40), fraDag, lagretDag(30, { FORELDREPENGER: 40, PLEIEPENGER: 10 })),
        ).toBe(true);
    });

    it('er endring når dagen mister en lagret fordeling, selv om dagtype og grad er lik', () => {
        const sykedag = lagDag({ dato: '2024-07-01', dag: Sykedag, grad: 70 });

        expect(
            erReellEndring(
                { dag: Sykedag, grad: 70, gradertAnnenYtelse: null },
                sykedag,
                lagretDag(30, { FORELDREPENGER: 40 }),
            ),
        ).toBe(true);
    });

    it('er ikke endring når den lagrede fordelingen allerede er fjernet', () => {
        const sykedag = lagDag({ dato: '2024-07-01', dag: Sykedag, grad: 70 });

        expect(erReellEndring({ dag: Sykedag, grad: 70, gradertAnnenYtelse: null }, sykedag, lagretDag(70, {}))).toBe(
            false,
        );
    });

    it('sammenligner vanlige endringer med fraDag', () => {
        expect(erReellEndring({ dag: Foreldrepengerdag, grad: 70 }, fraDag)).toBe(false);
        expect(erReellEndring({ dag: Sykedag, grad: 70 }, fraDag)).toBe(true);
    });
});

function gradertEndring(sykdomsgrad: number, andreYtelseGrad: number, dag = Foreldrepengerdag) {
    return {
        dag,
        grad: sykdomsgrad + andreYtelseGrad,
        gradertAnnenYtelse: { sykdomsgrad, andreYtelseGrad, sykdomsgradFørFordeling: 70 },
    };
}

function lagretDag(sykdomsgrad: number, andreYtelserGrader: Record<string, number>): ApiGraderteAndreYtelserDag {
    const andreYtelser = Object.values(andreYtelserGrader).reduce((sum, grad) => sum + grad, 0);
    return {
        dato: '2024-07-01',
        andreYtelserGrader,
        sykdomsgrad,
        arbeidsgrad: 100 - sykdomsgrad - andreYtelser,
        sykdomsgradFørFordeling: 70,
        begrunnelse: 'En begrunnelse',
    };
}
