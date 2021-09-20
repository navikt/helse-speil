import '@testing-library/jest-dom/extend-expect';

import { kilde } from './inntektskilde';

test('kilde', () => {
    expect(kilde('AOrdningen')).toEqual('AO');
    expect(kilde('Infotrygd')).toEqual('IT');
    expect(kilde('Inntektsmelding')).toEqual('IM');
    expect(kilde()).toEqual('-');
});
