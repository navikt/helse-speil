import '@testing-library/jest-dom/extend-expect';
import { Inntektskildetype } from 'internal-types';
import { kilde } from './inntektskilde';

test('kilde', () => {
    expect(kilde(Inntektskildetype.AOrdningen)).toEqual('AO');
    expect(kilde(Inntektskildetype.Infotrygd)).toEqual('IT');
    expect(kilde(Inntektskildetype.Inntektsmelding)).toEqual('IM');
    expect(kilde()).toEqual('-');
});
