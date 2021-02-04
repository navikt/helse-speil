import '@testing-library/jest-dom/extend-expect';
import { Inntektskildetype } from 'internal-types';
import { kilde } from './inntektskilde';

test('kilde', () => {
    expect(kilde(Inntektskildetype.AOrdningen)).toEqual('AO');
});
