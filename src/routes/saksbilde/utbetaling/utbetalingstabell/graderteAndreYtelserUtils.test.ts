import { tilGraderteAndreYtelserEndring } from './graderteAndreYtelserUtils';
import { Foreldrepengerdag } from './utbetalingstabelldager';

describe('tilGraderteAndreYtelserEndring', () => {
    it('tar vare på fordelingen for gradert annen ytelse', () => {
        const endring = tilGraderteAndreYtelserEndring({
            ytelse: 'Foreldrepenger',
            sykepengerGrad: 30,
            gradAndreYtelser: 40,
            begrunnelse: 'Begrunnelse for klyngen',
        });

        expect(endring).toMatchObject({ grad: 70, dag: Foreldrepengerdag });
        expect(endring.gradertAnnenYtelse).toEqual({
            sykdomsgrad: 30,
            andreYtelseGrad: 40,
            begrunnelse: 'Begrunnelse for klyngen',
        });
    });
});
