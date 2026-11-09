import { tilGraderteAndreYtelserEndring } from './graderteAndreYtelserUtils';

describe('tilGraderteAndreYtelserEndring', () => {
    it('tar vare på fordelingen for de valgte ytelsene uten å endre dagen fra Spleis', () => {
        const endring = tilGraderteAndreYtelserEndring({
            ytelser: ['FORELDREPENGER', 'OMSORGSPENGER'],
            sykepengerGrad: 30,
            andreYtelserGrader: { FORELDREPENGER: 20, OMSORGSPENGER: 20, PLEIEPENGER: 10 },
            begrunnelse: 'Begrunnelse for klyngen',
        });

        expect(endring).not.toHaveProperty('dag');
        expect(endring).not.toHaveProperty('grad');
        expect(endring.gradertAnnenYtelse).toEqual({
            sykdomsgrad: 30,
            andreYtelserGrader: { FORELDREPENGER: 20, OMSORGSPENGER: 20 },
            begrunnelse: 'Begrunnelse for klyngen',
        });
    });
});
